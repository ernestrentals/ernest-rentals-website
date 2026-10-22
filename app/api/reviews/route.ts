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

const REVIEW_IMAGE_BUCKET =
  "review-images";

const MAX_IMAGE_BYTES =
  3 * 1024 * 1024;

const IP_RATE_LIMIT_MAX =
  8;

const IP_RATE_LIMIT_WINDOW_SECONDS =
  30 * 60;

const EMAIL_RATE_LIMIT_MAX =
  4;

const EMAIL_RATE_LIMIT_WINDOW_SECONDS =
  6 * 60 * 60;

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retry_after_seconds: number;
};

type ImageType = {
  extension: "jpg" | "png" | "webp";
  mimeType: "image/jpeg" | "image/png" | "image/webp";
};

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
  additionalHeaders: Record<string, string> = {}
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
  value: FormDataEntryValue | null
) {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function cleanSingleLine(
  value: FormDataEntryValue | null
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

  return hashValue(
    forwardedFor
      ?.split(",")[0]
      ?.trim() ||
      realIp?.trim() ||
      "unknown"
  );
}

function isUuid(
  value: string
) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
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
      "Review rate-limit error:",
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
  ) as RateLimitResult | null;
}

function detectImageType(
  bytes: Uint8Array
): ImageType | null {
  if (
    bytes.length >=
      3 &&
    bytes[0] ===
      0xff &&
    bytes[1] ===
      0xd8 &&
    bytes[2] ===
      0xff
  ) {
    return {
      extension:
        "jpg",
      mimeType:
        "image/jpeg",
    };
  }

  const pngSignature = [
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a,
  ];

  if (
    bytes.length >=
      pngSignature.length &&
    pngSignature.every(
      (
        value,
        index
      ) =>
        bytes[index] ===
        value
    )
  ) {
    return {
      extension:
        "png",
      mimeType:
        "image/png",
    };
  }

  if (
    bytes.length >=
      12 &&
    String.fromCharCode(
      ...bytes.slice(
        0,
        4
      )
    ) ===
      "RIFF" &&
    String.fromCharCode(
      ...bytes.slice(
        8,
        12
      )
    ) ===
      "WEBP"
  ) {
    return {
      extension:
        "webp",
      mimeType:
        "image/webp",
    };
  }

  return null;
}

export async function POST(
  request: NextRequest
) {
  let formData:
    FormData;

  try {
    formData =
      await request.formData();
  } catch {
    return jsonResponse(
      {
        success:
          false,
        error:
          "The review form could not be read. Please try again.",
      },
      400
    );
  }

  if (
    cleanText(
      formData.get(
        "website"
      )
    )
  ) {
    return jsonResponse({
      success:
        true,
    });
  }

  const billboardId =
    cleanSingleLine(
      formData.get(
        "billboardId"
      )
    );

  const reviewerName =
    cleanSingleLine(
      formData.get(
        "reviewerName"
      )
    );

  const reviewerCompany =
    cleanSingleLine(
      formData.get(
        "company"
      )
    );

  const reviewerEmail =
    cleanSingleLine(
      formData.get(
        "email"
      )
    ).toLowerCase();

  const reviewTitle =
    cleanSingleLine(
      formData.get(
        "title"
      )
    );

  const reviewText =
    cleanText(
      formData.get(
        "reviewText"
      )
    );

  const rating =
    Number(
      cleanSingleLine(
        formData.get(
          "rating"
        )
      )
    );

  if (
    !isUuid(
      billboardId
    ) ||
    reviewerName.length <
      2 ||
    reviewerName.length >
      100 ||
    reviewerCompany.length >
      150 ||
    !isValidEmail(
      reviewerEmail
    ) ||
    reviewerEmail.length >
      254 ||
    reviewTitle.length >
      120 ||
    reviewText.length <
      10 ||
    reviewText.length >
      2000 ||
    !Number.isInteger(
      rating
    ) ||
    rating <
      1 ||
    rating >
      5
  ) {
    return jsonResponse(
      {
        success:
          false,
        error:
          "Please review the required fields and try again.",
      },
      400
    );
  }

  const imageEntry =
    formData.get(
      "image"
    );

  const image =
    imageEntry instanceof
      File &&
    imageEntry.size >
      0
      ? imageEntry
      : null;

  let imageBuffer:
    ArrayBuffer | null =
    null;

  let imageType:
    ImageType | null =
    null;

  if (
    image
  ) {
    if (
      image.size >
      MAX_IMAGE_BYTES
    ) {
      return jsonResponse(
        {
          success:
            false,
          error:
            "The ad image must be 3 MB or smaller.",
        },
        400
      );
    }

    imageBuffer =
      await image.arrayBuffer();

    imageType =
      detectImageType(
        new Uint8Array(
          imageBuffer.slice(
            0,
            16
          )
        )
      );

    if (
      !imageType ||
      image.type !==
        imageType.mimeType
    ) {
      return jsonResponse(
        {
          success:
            false,
          error:
            "Please upload a valid JPG, PNG or WebP image.",
        },
        400
      );
    }
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
      "Review submission server configuration is incomplete."
    );

    return jsonResponse(
      {
        success:
          false,
        error:
          "Review submissions are temporarily unavailable.",
      },
      503
    );
  }

  const ipLimit =
    await consumeRateLimit(
      supabaseUrl,
      serviceRoleKey,
      `review:submit:ip:${getClientFingerprint(
        request
      )}`,
      IP_RATE_LIMIT_MAX,
      IP_RATE_LIMIT_WINDOW_SECONDS
    );

  const emailLimit =
    await consumeRateLimit(
      supabaseUrl,
      serviceRoleKey,
      `review:submit:email:${hashValue(
        reviewerEmail
      )}`,
      EMAIL_RATE_LIMIT_MAX,
      EMAIL_RATE_LIMIT_WINDOW_SECONDS
    );

  if (
    !ipLimit ||
    !emailLimit
  ) {
    return jsonResponse(
      {
        success:
          false,
        error:
          "Review submissions are temporarily unavailable.",
      },
      503
    );
  }

  if (
    !ipLimit.allowed ||
    !emailLimit.allowed
  ) {
    const retryAfter =
      Math.max(
        ipLimit.retry_after_seconds,
        emailLimit.retry_after_seconds,
        60
      );

    return jsonResponse(
      {
        success:
          false,
        error:
          "Too many reviews have been submitted. Please wait and try again.",
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

  const supabase =
    createServerClient(
      supabaseUrl,
      serviceRoleKey
    );

  const {
    data:
      billboard,
    error:
      billboardError,
  } =
    await supabase
      .from(
        "billboards"
      )
      .select(
        "id"
      )
      .eq(
        "id",
        billboardId
      )
      .maybeSingle();

  if (
    billboardError ||
    !billboard
  ) {
    return jsonResponse(
      {
        success:
          false,
        error:
          "This billboard could not be found.",
      },
      404
    );
  }

  let imagePath:
    string | null =
    null;

  if (
    image &&
    imageBuffer &&
    imageType
  ) {
    imagePath = `${billboardId}/${crypto.randomUUID()}.${imageType.extension}`;

    const {
      error:
        uploadError,
    } =
      await supabase.storage
        .from(
          REVIEW_IMAGE_BUCKET
        )
        .upload(
          imagePath,
          imageBuffer,
          {
            contentType:
              imageType.mimeType,
            upsert:
              false,
          }
        );

    if (
      uploadError
    ) {
      console.error(
        "Review image upload error:",
        uploadError
      );

      return jsonResponse(
        {
          success:
            false,
          error:
            "The ad image could not be uploaded. Please try again.",
        },
        500
      );
    }
  }

  const {
    error:
      insertError,
  } =
    await supabase
      .from(
        "billboard_reviews"
      )
      .insert({
        billboard_id:
          billboardId,
        reviewer_name:
          reviewerName,
        reviewer_company:
          reviewerCompany ||
          null,
        reviewer_email:
          reviewerEmail,
        rating,
        review_title:
          reviewTitle ||
          null,
        review_text:
          reviewText,
        image_path:
          imagePath,
        status:
          "pending",
        verified_client:
          false,
      });

  if (
    insertError
  ) {
    if (
      imagePath
    ) {
      await supabase.storage
        .from(
          REVIEW_IMAGE_BUCKET
        )
        .remove([
          imagePath,
        ]);
    }

    console.error(
      "Review insert error:",
      insertError
    );

    return jsonResponse(
      {
        success:
          false,
        error:
          "We could not submit your review. Please try again.",
      },
      500
    );
  }

  return jsonResponse({
    success:
      true,
  });
}
