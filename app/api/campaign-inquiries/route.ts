import crypto from "crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createClient as createSupabaseClient,
} from "@supabase/supabase-js";

import {
  calculateCombo,
  formatDiscount,
  isComboTerm,
} from "@/lib/combo-packages";

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

type ComboDigitalPackageRow = {
  package_id: string;
  package_name: string;
  package_type: string;
  duration_value: number | null;
  duration_unit: string | null;
  price: number;
  currency_code: string;
};

type ComboStaticPackageRow = {
  package_id: string;
  billboard_id: string;
  package_name: string;
  duration_value: number | null;
  duration_unit: string | null;
  price: number;
  currency_code: string;
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

function isUuid(
  value: string
) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function formatXcd(
  amount: number
) {
  return `EC$${new Intl.NumberFormat(
    "en-LC",
    {
      minimumFractionDigits:
        2,
      maximumFractionDigits:
        2,
    }
  ).format(amount)}`;
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

  const comboTermValue =
    Number(
      body.comboTerm ??
        Number.NaN
    );

  const comboDigitalPackageId =
    cleanSingleLine(
      body.comboDigitalPackageId
    );

  const comboStaticPackageId =
    cleanSingleLine(
      body.comboStaticPackageId
    );

  const hasComboRequest =
    body.comboTerm !==
      undefined ||
    Boolean(
      comboDigitalPackageId
    ) ||
    Boolean(
      comboStaticPackageId
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
    !email
  ) {
    return jsonResponse(
      {
        success:
          false,

        error:
          "Email is required.",
      },
      400
    );
  }

  if (
    !phone
  ) {
    return jsonResponse(
      {
        success:
          false,

        error:
          "Phone number is required.",
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

  if (
    hasComboRequest &&
    (
      !isComboTerm(
        comboTermValue
      ) ||
      !isUuid(
        comboDigitalPackageId
      ) ||
      !isUuid(
        comboStaticPackageId
      ) ||
      billboardType !==
        "static" ||
      requestedPackageId !==
        comboStaticPackageId
    )
  ) {
    return jsonResponse(
      {
        success:
          false,

        error:
          "Please rebuild the Digital + Static combo and try again.",
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

  let messageForSubmission =
    message ||
    null;

  if (
    hasComboRequest &&
    isComboTerm(
      comboTermValue
    )
  ) {
    const [
      digitalResult,
      staticResult,
    ] = await Promise.all([
      supabase.rpc(
        "get_public_ad_packages",
        {
          p_billboard_type:
            "digital",
        }
      ),
      supabase.rpc(
        "get_public_static_billboard_packages"
      ),
    ]);

    if (
      digitalResult.error ||
      staticResult.error
    ) {
      console.error(
        "Unable to verify combo pricing:",
        digitalResult.error ??
          staticResult.error
      );

      return jsonResponse(
        {
          success:
            false,

          error:
            "Combo pricing is temporarily unavailable. Please try again.",
        },
        503
      );
    }

    const digitalPackages =
      (digitalResult.data ??
        []) as ComboDigitalPackageRow[];

    const staticPackages =
      (staticResult.data ??
        []) as ComboStaticPackageRow[];

    const digitalPackage =
      digitalPackages.find(
        (item) =>
          item.package_id ===
            comboDigitalPackageId &&
          item.package_type
            .trim()
            .toLowerCase() ===
            "premium" &&
          item.duration_unit
            ?.trim()
            .toLowerCase() ===
            "month" &&
          Number(
            item.duration_value
          ) ===
            comboTermValue
      );

    const staticPackage =
      staticPackages.find(
        (item) =>
          item.package_id ===
            comboStaticPackageId &&
          item.billboard_id ===
            billboardId &&
          item.duration_unit
            ?.trim()
            .toLowerCase() ===
            "month" &&
          Number(
            item.duration_value
          ) ===
            comboTermValue
      );

    const digitalPrice =
      Number(
        digitalPackage?.price
      );

    const staticPrice =
      Number(
        staticPackage?.price
      );

    if (
      !digitalPackage ||
      !staticPackage ||
      !Number.isFinite(
        digitalPrice
      ) ||
      !Number.isFinite(
        staticPrice
      ) ||
      digitalPrice <= 0 ||
      staticPrice <= 0 ||
      digitalPackage.currency_code !==
        staticPackage.currency_code
    ) {
      return jsonResponse(
        {
          success:
            false,

          error:
            "The selected combo pricing has changed. Please rebuild your combo.",
        },
        409
      );
    }

    const combo =
      calculateCombo({
        term:
          comboTermValue,
        premiumDigitalTotal:
          digitalPrice,
        staticRentalTotal:
          staticPrice,
      });

    const comboSummary = [
      "Digital + Static Combo Inquiry",
      `Term: ${combo.term} months`,
      `Premium Digital: ${digitalPackage.package_name} — ${formatXcd(combo.premiumDigitalTotal)}`,
      `Static package: ${staticPackage.package_name} — ${formatXcd(combo.staticRentalTotal)}`,
      `Static discount: ${formatDiscount(combo.discountRate)}`,
      `Static savings: ${formatXcd(combo.staticSavings)}`,
      `Discounted static rental: ${formatXcd(combo.discountedStaticRental)}`,
      `Estimated combo total: ${formatXcd(combo.comboTotal)}`,
      "Estimate subject to availability and final confirmation. Discount applies only to eligible static rental.",
    ].join(
      "\n"
    );

    messageForSubmission = [
      message,
      comboSummary,
    ]
      .filter(
        Boolean
      )
      .join(
        "\n\n"
      );
  }

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
          messageForSubmission ||
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
