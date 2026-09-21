import {
  NextResponse,
} from "next/server";

import {
  google,
} from "googleapis";

export const runtime =
  "nodejs";

export async function GET() {
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
    return NextResponse.json(
      {
        success: false,
        error:
          "One or more Google Calendar environment variables are missing.",
      },
      {
        status: 500,
      }
    );
  }

  if (
    calendarId.startsWith(
      "http"
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "GOOGLE_CALENDAR_ID contains a URL. Copy the Calendar ID from Google Calendar → Settings → Ernest Rentals Meetings → Integrate calendar.",
      },
      {
        status: 500,
      }
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
      return NextResponse.json(
        {
          success: false,
          error:
            "Google did not return availability for the configured calendar.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      calendarAvailability
        .errors?.length
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Google returned an error for this Calendar ID.",
          googleErrors:
            calendarAvailability.errors,
        },
        {
          status: 500,
        }
      );
    }

    const busy =
      calendarAvailability.busy ??
      [];

    return NextResponse.json({
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
      "Google Calendar test error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to access Google Calendar.",
      },
      {
        status: 500,
      }
    );
  }
}