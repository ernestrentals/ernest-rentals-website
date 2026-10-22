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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function isUuid(
  value: string
) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function contentTypeForPath(
  path: string
) {
  const extension =
    path
      .split(".")
      .pop()
      ?.toLowerCase();

  if (
    extension ===
    "png"
  ) {
    return "image/png";
  }

  if (
    extension ===
    "webp"
  ) {
    return "image/webp";
  }

  return "image/jpeg";
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const {
    id,
  } =
    await context.params;

  if (
    !isUuid(
      id
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Image not found.",
      },
      {
        status:
          404,
      }
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
    return NextResponse.json(
      {
        error:
          "Image service unavailable.",
      },
      {
        status:
          503,
      }
    );
  }

  const supabase =
    createSupabaseClient(
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

  const {
    data:
      review,
  } =
    await supabase
      .from(
        "billboard_reviews"
      )
      .select(
        "image_path, status"
      )
      .eq(
        "id",
        id
      )
      .eq(
        "status",
        "approved"
      )
      .not(
        "image_path",
        "is",
        null
      )
      .maybeSingle();

  if (
    !review?.image_path
  ) {
    return NextResponse.json(
      {
        error:
          "Image not found.",
      },
      {
        status:
          404,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  }

  const {
    data:
      image,
    error,
  } =
    await supabase.storage
      .from(
        "review-images"
      )
      .download(
        review.image_path
      );

  if (
    error ||
    !image
  ) {
    console.error(
      "Approved review image download error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Image not found.",
      },
      {
        status:
          404,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  }

  return new NextResponse(
    await image.arrayBuffer(),
    {
      status:
        200,
      headers: {
        "Content-Type":
          contentTypeForPath(
            review.image_path
          ),
        "Content-Disposition":
          "inline",
        "Cache-Control":
          "private, max-age=300",
        "X-Content-Type-Options":
          "nosniff",
      },
    }
  );
}
