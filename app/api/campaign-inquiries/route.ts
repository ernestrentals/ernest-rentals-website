import crypto from "crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createClient as createSupabaseClient,
} from "@supabase/supabase-js";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

const IP_RATE_LIMIT_MAX =
  10;

const IP_RATE_LIMIT_WINDOW_SECONDS =
  30 * 60;

const CONTACT_RATE_LIMIT_MAX =
  5;

const CONTACT_RATE_LIMIT_WINDOW_SECONDS =
  6 * 60 * 60;

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retry_after_seconds: number;
};

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
  additionalHeaders: Record<
    string,
    string
  > = {}
) {
  return NextResponse.json(
    body,
    {
      status,

      headers: {
        "Cache-Control":
          "no-store",

        ...additionalHeaders,
      },
    }
  );
}

function cleanText(
  value: unknown
) {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  return value.trim();
}

function cleanSingleLine(
  value: unknown
) {
  return cleanText(
    value
  ).replace(
    /\s+/g,
    " "
  );
}

function hashValue(
  value: string
) {
  return crypto
    .createHash(
      "sha256"
    )
    .update(
      value
    )
    .digest(
      "hex"
    );
}

function getClientFingerprint(
  request: NextRequest
) {
  const forwardedFor =
    request.headers.get(
      "x-forwarded-for"
    );

  const realIp =
    request.headers.get(
      "x-real-ip"
    );

  const clientAddress =
    forwardedFor
      ?.split(",")[0]
      ?.trim() ||
    realIp?.trim() ||
    "unknown";

  return hashValue(
    clientAddress
  );
}

function isValidEmail(
  value: string
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );
}

function createServerClient(
  supabaseUrl: string,
  serviceRoleKey: string
) {
  return createSupabaseClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession:
          false,

        autoRefreshToken:
          false,
      },
    }
  );
}

async function consumeRateLimit(
  supabaseUrl: string,
  serviceRoleKey: string,
  rateKey: string,
  maxRequests: number,
  windowSeconds: number
) {
  const supabase =
    createServerClient(
      supabaseUrl,
      serviceRoleKey
    );

  const {
    data,
    error,
  } =
    await supabase.rpc(
      "check_api_rate_limit",
      {
        p_rate_key:
          rateKey,

        p_max_requests:
          maxRequests,

        p_window_seconds:
          windowSeconds,
      }
    );

  if (
    error
  ) {
    console.error(
      "Campaign inquiry rate-limit error:",
      error
    );

    return null;
  }

  return (
    Array.isArray(
      data
    )
      ? data[0]
      : data
  ) as
    | RateLimitResult
    | null;
}

function rateLimitedResponse(
  retryAfterSeconds: number
) {
  const retryAfter =
    Math.max(
      Number(
        retryAfterSeconds ||
          60
      ),
      1
    );

  return jsonResponse(
    {
      success:
        false,

      code:
        "RATE_LIMITED",

      error:
        "Too many campaign requests have been submitted. Please wait and try again.",
    },
    429,
    {
      "Retry-After":
        String(
          retryAfter
        ),
    }
  );
}

export async function POST(
  request: NextRequest
) {
  let body:
    Record<
      string,
      unknown
    >;

  try {
    const parsed =
      await request.json();

    if (
      !parsed ||
      typeof parsed !==
        "object" ||
      Array.isArray(
        parsed
      )
    ) {
      throw new Error();
    }

    body =
      parsed as Record<
        string,
        unknown
      >;
  } catch {
    return jsonResponse(
      {
        success:
          false,

        error:
          "Invalid campaign request.",
      },
      400
    );
  }

  /*
    Honeypot field.
  */

  if (
    cleanText(
      body.website
    )
  ) {
    return jsonResponse({
      success:
        true,
    });
  }

  const companyName =
    cleanSingleLine(
      body.companyName
    );

  const contactPerson =
    cleanSingleLine(
      body.contactPerson
    );

  const email =
    cleanSingleLine(
      body.email
    ).toLowerCase();

  const phone =
    cleanSingleLine(
      body.phone
    );

  const whatsapp =
    cleanSingleLine(
      body.whatsapp
    );

  const billboardId =
    cleanSingleLine(
      body.billboardId
    );

  const startDate =
    cleanSingleLine(
      body.startDate
    );

  const changeoverDate =
    cleanSingleLine(
      body.changeoverDate
    );

  const billboardType =
    cleanSingleLine(
      body.billboardType
    ).toLowerCase();

  const adOption =
    cleanText(
      body.adOption
    );

  const campaignName =
    cleanSingleLine(
      body.campaignName
    );

  const campaignObjective =
    cleanText(
      body.campaignObjective
    );

  const message =
    cleanText(
      body.message
    );

  const requestedPackageId =
    cleanSingleLine(
      body.requestedPackageId
    );

  const artworkReady =
    typeof body.artworkReady ===
    "boolean"
      ? body.artworkReady
      : null;

  if (
    contactPerson.length <
      2 ||
    contactPerson.length >
      150
  ) {
    return jsonResponse(
      {
        success:
          false,

        error:
          "Please enter a valid contact person.",
      },
      400
    );
  }

  if (
    !email &&
    !phone &&
    !whatsapp
  ) {
    return jsonResponse(
      {
        success:
          false,

        error:
          "Email, phone or WhatsApp is required.",
      },
      400
    );
  }

  if (
    email &&
    (
      email.length >
        254 ||
      !isValidEmail(
        email
      )
    )
  ) {
    return jsonResponse(
      {
        success:
          false,

        error:
          "Please enter a valid email address.",
      },
      400
    );
  }

  if (
    companyName.length >
      200 ||
    phone.length >
      50 ||
    whatsapp.length >
      50 ||
    campaignName.length >
      200 ||
    campaignObjective.length >
      1500 ||
    adOption.length >
      1000 ||
    message.length >
      3000
  ) {
    return jsonResponse(
      {
        success:
          false,

        error:
          "One or more campaign fields are too long.",
      },
      400
    );
  }

  if (
    !billboardId ||
    !startDate ||
    !changeoverDate
  ) {
    return jsonResponse(
      {
        success:
          false,

        error:
          "Billboard and campaign dates are required.",
      },
      400
    );
  }

  if (
    ![
      "static",
      "digital",
    ].includes(
      billboardType
    )
  ) {
    return jsonResponse(
      {
        success:
          false,

        error:
          "Invalid billboard type.",
      },
      400
    );
  }

  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL ||
    process.env
      .SUPABASE_URL;

  const serviceRoleKey =
    process.env
      .SUPABASE_SERVICE_ROLE_KEY;

  if (
    !supabaseUrl ||
    !serviceRoleKey
  ) {
    console.error(
      "Campaign inquiry server configuration is incomplete."
    );

    return jsonResponse(
      {
        success:
          false,

        error:
          "Campaign requests are temporarily unavailable.",
      },
      503
    );
  }

  const ipFingerprint =
    getClientFingerprint(
      request
    );

  const ipLimit =
    await consumeRateLimit(
      supabaseUrl,
      serviceRoleKey,
      `campaign:inquiry:ip:${ipFingerprint}`,
      IP_RATE_LIMIT_MAX,
      IP_RATE_LIMIT_WINDOW_SECONDS
    );

  if (
    !ipLimit
  ) {
    return jsonResponse(
      {
        success:
          false,

        error:
          "Campaign requests are temporarily unavailable.",
      },
      503
    );
  }

  if (
    !ipLimit.allowed
  ) {
    return rateLimitedResponse(
      ipLimit
        .retry_after_seconds
    );
  }

  /*
    Create a contact-based fingerprint without
    storing the actual email/phone/WhatsApp value.
  */

  const contactIdentity =
    email ||
    phone ||
    whatsapp;

  const contactFingerprint =
    hashValue(
      contactIdentity
        .toLowerCase()
    );

  const contactLimit =
    await consumeRateLimit(
      supabaseUrl,
      serviceRoleKey,
      `campaign:inquiry:contact:${contactFingerprint}`,
      CONTACT_RATE_LIMIT_MAX,
      CONTACT_RATE_LIMIT_WINDOW_SECONDS
    );

  if (
    !contactLimit
  ) {
    return jsonResponse(
      {
        success:
          false,

        error:
          "Campaign requests are temporarily unavailable.",
      },
      503
    );
  }

  if (
    !contactLimit.allowed
  ) {
    return rateLimitedResponse(
      contactLimit
        .retry_after_seconds
    );
  }

  const supabase =
    createServerClient(
      supabaseUrl,
      serviceRoleKey
    );

  const {
    data,
    error,
  } =
    await supabase.rpc(
      "submit_public_campaign_inquiry",
      {
        p_company_name:
          companyName ||
          null,

        p_contact_person:
          contactPerson,

        p_email:
          email ||
          null,

        p_phone:
          phone ||
          null,

        p_whatsapp:
          whatsapp ||
          null,

        p_billboard_id:
          billboardId,

        p_start_date:
          startDate,

        p_changeover_date:
          changeoverDate,

        p_billboard_type:
          billboardType,

        p_ad_option:
          adOption ||
          null,

        p_campaign_name:
          campaignName ||
          null,

        p_campaign_objective:
          campaignObjective ||
          null,

        p_artwork_ready:
          artworkReady,

        p_message:
          message ||
          null,

        p_requested_package_id:
          requestedPackageId ||
          null,
      }
    );

  if (
    error
  ) {
    console.error(
      "Campaign inquiry RPC error:",
      error
    );

    const messageText =
      error.message ||
      "";

    /*
      Preserve only the customer-safe business
      availability cases. Do not expose arbitrary
      database errors.
    */

    if (
      messageText
        .toLowerCase()
        .includes(
          "available"
        ) ||
      messageText
        .toLowerCase()
        .includes(
          "booked"
        ) ||
      messageText
        .toLowerCase()
        .includes(
          "package"
        ) ||
      messageText
        .toLowerCase()
        .includes(
          "campaign start"
        ) ||
      messageText
        .toLowerCase()
        .includes(
          "changeover"
        )
    ) {
      return jsonResponse(
        {
          success:
            false,

          code:
            "CAMPAIGN_VALIDATION",

          error:
            messageText,
        },
        409
      );
    }

    return jsonResponse(
      {
        success:
          false,

        error:
          "We could not submit your campaign request. Please try again.",
      },
      500
    );
  }

  const result =
    Array.isArray(
      data
    )
      ? data[0]
      : data;

  return jsonResponse({
    success:
      true,

    leadId:
      result?.lead_id ??
      null,
  });
}