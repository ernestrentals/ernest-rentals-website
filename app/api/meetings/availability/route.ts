import crypto from "crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  google,
} from "googleapis";

import {
  createClient as createSupabaseClient,
} from "@supabase/supabase-js";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

const TIME_ZONE =
  "America/St_Lucia";

const BUSINESS_START_HOUR =
  10;

const BUSINESS_END_HOUR =
  15;

const SLOT_INTERVAL_MINUTES =
  15;

const BUFFER_MINUTES =
  15;

const MIN_NOTICE_HOURS =
  2;

const MAX_BOOKING_DAYS =
  30;

const RATE_LIMIT_MAX_REQUESTS =
  120;

const RATE_LIMIT_WINDOW_SECONDS =
  10 * 60;

const MEETING_TYPES = {
  quick_consultation: {
    label:
      "Quick Advertising Consultation",

    durationMinutes:
      15,
  },

  campaign_planning: {
    label:
      "Campaign Planning Meeting",

    durationMinutes:
      30,
  },

  account_meeting: {
    label:
      "Existing Client / Account Meeting",

    durationMinutes:
      30,
  },
} as const;

type MeetingType =
  keyof typeof MEETING_TYPES;

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retry_after_seconds: number;
};

function jsonResponse(
  body: Record<
    string,
    unknown
  >,
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

function isValidDate(
  value: string
) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    return false;
  }

  const [
    year,
    month,
    day,
  ] =
    value
      .split("-")
      .map(Number);

  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day
      )
    );

  return (
    date.getUTCFullYear() ===
      year &&
    date.getUTCMonth() ===
      month - 1 &&
    date.getUTCDate() ===
      day
  );
}

function saintLuciaDateTime(
  date: string,
  hour: number,
  minute: number
) {
  return new Date(
    `${date}T${String(
      hour
    ).padStart(
      2,
      "0"
    )}:${String(
      minute
    ).padStart(
      2,
      "0"
    )}:00-04:00`
  );
}

function addMinutes(
  date: Date,
  minutes: number
) {
  return new Date(
    date.getTime() +
      minutes *
        60 *
        1000
  );
}

function addDaysToDateKey(
  dateKey: string,
  days: number
) {
  const [
    year,
    month,
    day,
  ] =
    dateKey
      .split("-")
      .map(Number);

  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day + days
      )
    );

  return date
    .toISOString()
    .slice(
      0,
      10
    );
}

function overlaps(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
) {
  return (
    startA <
      endB &&
    endA >
      startB
  );
}

function formatTime(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone:
        TIME_ZONE,

      hour:
        "numeric",

      minute:
        "2-digit",

      hour12:
        true,
    }
  ).format(
    date
  );
}

function getSaintLuciaDateKey(
  date: Date
) {
  const parts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          TIME_ZONE,

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit",
      }
    ).formatToParts(
      date
    );

  const year =
    parts.find(
      (
        part
      ) =>
        part.type ===
        "year"
    )?.value;

  const month =
    parts.find(
      (
        part
      ) =>
        part.type ===
        "month"
    )?.value;

  const day =
    parts.find(
      (
        part
      ) =>
        part.type ===
        "day"
    )?.value;

  return `${year}-${month}-${day}`;
}

function getDayOfWeek(
  date: string
) {
  return saintLuciaDateTime(
    date,
    12,
    0
  ).getUTCDay();
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

  return crypto
    .createHash(
      "sha256"
    )
    .update(
      clientAddress
    )
    .digest(
      "hex"
    );
}

async function checkRateLimit(
  request: NextRequest
) {
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
      "Meeting availability rate limiter is missing Supabase server configuration."
    );

    return {
      error:
        jsonResponse(
          {
            success:
              false,

            error:
              "Meeting availability is temporarily unavailable.",
          },
          503
        ),
    };
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

  const fingerprint =
    getClientFingerprint(
      request
    );

  const {
    data,
    error,
  } =
    await supabase.rpc(
      "check_api_rate_limit",
      {
        p_rate_key:
          `meetings:availability:${fingerprint}`,

        p_max_requests:
          RATE_LIMIT_MAX_REQUESTS,

        p_window_seconds:
          RATE_LIMIT_WINDOW_SECONDS,
      }
    );

  if (
    error
  ) {
    console.error(
      "Meeting availability rate-limit error:",
      error
    );

    return {
      error:
        jsonResponse(
          {
            success:
              false,

            error:
              "Meeting availability is temporarily unavailable.",
          },
          503
        ),
    };
  }

  const result =
    (
      Array.isArray(
        data
      )
        ? data[0]
        : data
    ) as
      | RateLimitResult
      | null;

  if (
    !result
  ) {
    console.error(
      "Meeting availability rate limiter returned no result."
    );

    return {
      error:
        jsonResponse(
          {
            success:
              false,

            error:
              "Meeting availability is temporarily unavailable.",
          },
          503
        ),
    };
  }

  if (
    !result.allowed
  ) {
    const retryAfter =
      Math.max(
        Number(
          result
            .retry_after_seconds ||
            RATE_LIMIT_WINDOW_SECONDS
        ),
        1
      );

    return {
      error:
        jsonResponse(
          {
            success:
              false,

            code:
              "RATE_LIMITED",

            error:
              "Too many availability checks. Please wait a few minutes and try again.",
          },
          429,
          {
            "Retry-After":
              String(
                retryAfter
              ),
          }
        ),
    };
  }

  return {
    error:
      null,
  };
}

export async function GET(
  request: NextRequest
) {
  const date =
    request.nextUrl
      .searchParams
      .get(
        "date"
      );

  const meetingType =
    request.nextUrl
      .searchParams
      .get(
        "type"
      ) as
      | MeetingType
      | null;

  if (
    !date ||
    !isValidDate(
      date
    )
  ) {
    return jsonResponse(
      {
        success:
          false,

        error:
          "A valid date is required.",
      },
      400
    );
  }

  if (
    !meetingType ||
    !MEETING_TYPES[
      meetingType
    ]
  ) {
    return jsonResponse(
      {
        success:
          false,

        error:
          "A valid meeting type is required.",
      },
      400
    );
  }

  const rateLimit =
    await checkRateLimit(
      request
    );

  if (
    rateLimit.error
  ) {
    return rateLimit.error;
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
    return jsonResponse(
      {
        success:
          false,

        error:
          "Google Calendar configuration is incomplete.",
      },
      500
    );
  }

  const dayOfWeek =
    getDayOfWeek(
      date
    );

  if (
    dayOfWeek ===
      0 ||
    dayOfWeek ===
      6
  ) {
    return jsonResponse({
      success:
        true,

      date,

      meetingType,

      available:
        false,

      reason:
        "Meetings are available Monday through Friday only.",

      slots: [],
    });
  }

  const now =
    new Date();

  const todayKey =
    getSaintLuciaDateKey(
      now
    );

  const minimumDateKey =
    addDaysToDateKey(
      todayKey,
      1
    );

  const maxDateKey =
    addDaysToDateKey(
      todayKey,
      MAX_BOOKING_DAYS
    );

  if (
    date <
    minimumDateKey
  ) {
    return jsonResponse({
      success:
        true,

      date,

      meetingType,

      available:
        false,

      reason:
        "Appointments must be booked at least one day in advance.",

      slots: [],
    });
  }

  if (
    date >
    maxDateKey
  ) {
    return jsonResponse({
      success:
        true,

      date,

      meetingType,

      available:
        false,

      reason:
        `Meetings may be booked up to ${MAX_BOOKING_DAYS} days in advance.`,

      slots: [],
    });
  }

  const meeting =
    MEETING_TYPES[
      meetingType
    ];

  const businessStart =
    saintLuciaDateTime(
      date,
      BUSINESS_START_HOUR,
      0
    );

  const businessEnd =
    saintLuciaDateTime(
      date,
      BUSINESS_END_HOUR,
      0
    );

  const minimumStartTime =
    new Date(
      now.getTime() +
        MIN_NOTICE_HOURS *
          60 *
          60 *
          1000
    );

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
        version:
          "v3",

        auth,
      });

    const freeBusyResult =
      await calendar
        .freebusy
        .query({
          requestBody: {
            timeMin:
              businessStart
                .toISOString(),

            timeMax:
              businessEnd
                .toISOString(),

            timeZone:
              TIME_ZONE,

            items: [
              {
                id:
                  calendarId,
              },
            ],
          },
        });

    const calendarData =
      freeBusyResult
        .data
        .calendars?.[
        calendarId
      ];

    if (
      calendarData
        ?.errors
        ?.length
    ) {
      console.error(
        "Google Calendar availability errors:",
        calendarData.errors
      );

      return jsonResponse(
        {
          success:
            false,

          error:
            "Unable to retrieve meeting availability.",
        },
        500
      );
    }

    const busyPeriods =
      (
        calendarData
          ?.busy ??
        []
      )
        .filter(
          (
            period
          ) =>
            period.start &&
            period.end
        )
        .map(
          (
            period
          ) => ({
            start:
              new Date(
                period.start!
              ),

            end:
              addMinutes(
                new Date(
                  period.end!
                ),
                BUFFER_MINUTES
              ),
          })
        );

    const slots: Array<{
      start: string;
      end: string;
      display: string;
      label: string;
    }> = [];

    let slotStart =
      new Date(
        businessStart
      );

    while (
      slotStart <
      businessEnd
    ) {
      const appointmentEnd =
        addMinutes(
          slotStart,
          meeting
            .durationMinutes
        );

      const proposedBlockedUntil =
        addMinutes(
          appointmentEnd,
          BUFFER_MINUTES
        );

      const appointmentFits =
        appointmentEnd <=
        businessEnd;

      const respectsNotice =
        slotStart >=
        minimumStartTime;

      const hasConflict =
        busyPeriods.some(
          (
            busy
          ) =>
            overlaps(
              slotStart,
              proposedBlockedUntil,
              busy.start,
              busy.end
            )
        );

      if (
        appointmentFits &&
        respectsNotice &&
        !hasConflict
      ) {
        slots.push({
          start:
            slotStart
              .toISOString(),

          end:
            appointmentEnd
              .toISOString(),

          display:
            formatTime(
              slotStart
            ),

          label:
            `${formatTime(
              slotStart
            )} – ${formatTime(
              appointmentEnd
            )}`,
        });
      }

      slotStart =
        addMinutes(
          slotStart,
          SLOT_INTERVAL_MINUTES
        );
    }

    return jsonResponse({
      success:
        true,

      date,

      timeZone:
        TIME_ZONE,

      businessHours: {
        start:
          "10:00 AM",

        end:
          "3:00 PM",
      },

      schedulingRules: {
        weekdays:
          "Monday - Friday",

        minimumAdvanceDays:
          1,

        minimumNoticeHours:
          MIN_NOTICE_HOURS,

        bookingWindowDays:
          MAX_BOOKING_DAYS,

        slotIntervalMinutes:
          SLOT_INTERVAL_MINUTES,

        bufferMinutes:
          BUFFER_MINUTES,
      },

      meeting: {
        type:
          meetingType,

        label:
          meeting.label,

        durationMinutes:
          meeting
            .durationMinutes,

        bufferMinutes:
          BUFFER_MINUTES,
      },

      available:
        slots.length >
        0,

      slots,
    });
  } catch (
    error
  ) {
    console.error(
      "Meeting availability error:",
      error
    );

    return jsonResponse(
      {
        success:
          false,

        error:
          "Unable to retrieve meeting availability.",
      },
      500
    );
  }
}