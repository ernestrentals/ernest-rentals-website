import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  google,
} from "googleapis";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

function isLocalRequest(
  request: NextRequest
) {
  return [
    "localhost",
    "127.0.0.1",
  ].includes(
    request.nextUrl.hostname
  );
}

function noStoreJson(
  body: Record<
    string,
    unknown
  >,
  status = 200
) {
  return NextResponse.json(
    body,
    {
      status,

      headers: {
        "Cache-Control":
          "no-store",
      },
    }
  );
}

export async function GET(
  request: NextRequest
) {
  /*
    This endpoint is only a development/setup diagnostic.

    It must never expose Google Calendar diagnostic
    information from the production website.
  */

  if (
    process.env.NODE_ENV ===
      "production" ||
    !isLocalRequest(
      request
    )
  ) {
    return noStoreJson(
      {
        error:
          "Not found.",
      },
      404
    );
  }

  const clientId =
    process.env
      .GOOGLE_CLIENT_ID;

  const clientSecret =
    process.env
      .GOOGLE_CLIENT_SECRET;

  const refreshToken =
    process.env
      .GOOGLE_CALENDAR_REFRESH_TOKEN;

  const calendarId =
    process.env
      .GOOGLE_CALENDAR_ID;

  if (
    !clientId ||
    !clientSecret ||
    !refreshToken ||
    !calendarId
  ) {
    return noStoreJson(
      {
        success: false,

        error:
          "One or more Google Calendar environment variables are missing.",
      },
      500
    );
  }

  if (
    calendarId.startsWith(
      "http"
    )
  ) {
    return noStoreJson(
      {
        success: false,

        error:
          "GOOGLE_CALENDAR_ID contains a URL. Copy the Calendar ID from Google Calendar settings.",
      },
      500
    );
  }

  try {
    const auth =
      new google.auth.OAuth2(
        clientId,
        clientSecret
      );

    auth.setCredentials({
      refresh_token:
        refreshToken,
    });

    const calendar =
      google.calendar({
        version: "v3",
        auth,
      });

    const now =
      new Date();

    const sevenDaysLater =
      new Date(
        now.getTime() +
          7 *
            24 *
            60 *
            60 *
            1000
      );

    const result =
      await calendar.freebusy.query({
        requestBody: {
          timeMin:
            now.toISOString(),

          timeMax:
            sevenDaysLater.toISOString(),

          timeZone:
            "America/St_Lucia",

          items: [
            {
              id:
                calendarId,
            },
          ],
        },
      });

    const calendarAvailability =
      result.data
        .calendars?.[
        calendarId
      ];

    if (
      !calendarAvailability
    ) {
      return noStoreJson(
        {
          success: false,

          error:
            "Google did not return availability for the configured calendar.",
        },
        500
      );
    }

    if (
      calendarAvailability
        .errors?.length
    ) {
      console.error(
        "Google Calendar diagnostic errors:",
        calendarAvailability.errors
      );

      return noStoreJson(
        {
          success: false,

          error:
            "Google returned an error for the configured Calendar ID.",
        },
        500
      );
    }

    const busy =
      calendarAvailability
        .busy ??
      [];

    return noStoreJson({
      success: true,

      message:
        "Ernest Rentals Google Calendar connection is working.",

      timeZone:
        "America/St_Lucia",

      range: {
        from:
          now.toISOString(),

        to:
          sevenDaysLater.toISOString(),
      },

      nextSevenDays: {
        busyPeriods:
          busy.length,

        busy,
      },
    });
  } catch (
    error
  ) {
    console.error(
      "Google Calendar diagnostic error:",
      error
    );

    return noStoreJson(
      {
        success: false,

        error:
          "Unable to access Google Calendar.",
      },
      500
    );
  }
}