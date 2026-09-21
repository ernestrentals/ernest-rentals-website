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

const TIME_ZONE =
  "America/St_Lucia";

const BUSINESS_START_MINUTES =
  10 * 60;

const BUSINESS_END_MINUTES =
  15 * 60;

const SLOT_INTERVAL_MINUTES =
  15;

const BUFFER_MINUTES =
  15;

const MIN_NOTICE_HOURS =
  2;

const MAX_BOOKING_DAYS =
  30;

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

type BookingRequest = {
  type?: string;
  start?: string;

  customerName?: string;
  companyName?: string;
  customerEmail?: string;
  customerPhone?: string;
  notes?: string;

  website?: string;
};

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
    .slice(0, 10);
}

function isValidEmail(
  value: string
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );
}

function overlaps(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
) {
  return (
    startA < endB &&
    endA > startB
  );
}

function getSaintLuciaParts(
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

        weekday:
          "short",

        hour:
          "2-digit",

        minute:
          "2-digit",

        hourCycle:
          "h23",
      }
    ).formatToParts(date);

  const value = (
    type: string
  ) =>
    parts.find(
      (part) =>
        part.type === type
    )?.value ?? "";

  return {
    year:
      Number(
        value("year")
      ),

    month:
      Number(
        value("month")
      ),

    day:
      Number(
        value("day")
      ),

    weekday:
      value(
        "weekday"
      ),

    hour:
      Number(
        value("hour")
      ),

    minute:
      Number(
        value("minute")
      ),
  };
}

function getSaintLuciaDateKey(
  date: Date
) {
  const parts =
    getSaintLuciaParts(
      date
    );

  return `${String(
    parts.year
  ).padStart(
    4,
    "0"
  )}-${String(
    parts.month
  ).padStart(
    2,
    "0"
  )}-${String(
    parts.day
  ).padStart(
    2,
    "0"
  )}`;
}

function formatSaintLuciaDateTime(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone:
        TIME_ZONE,

      weekday:
        "long",

      year:
        "numeric",

      month:
        "long",

      day:
        "numeric",

      hour:
        "numeric",

      minute:
        "2-digit",

      hour12:
        true,
    }
  ).format(date);
}

function sameSaintLuciaDate(
  first: Date,
  second: Date
) {
  const firstParts =
    getSaintLuciaParts(
      first
    );

  const secondParts =
    getSaintLuciaParts(
      second
    );

  return (
    firstParts.year ===
      secondParts.year &&
    firstParts.month ===
      secondParts.month &&
    firstParts.day ===
      secondParts.day
  );
}

export async function POST(
  request: NextRequest
) {
  let body:
    BookingRequest;

  try {
    body =
      await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error:
          "Invalid booking request.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    body.website
      ?.trim()
  ) {
    return NextResponse.json({
      success: true,
    });
  }

  const meetingType =
    body.type as
      | MeetingType
      | undefined;

  if (
    !meetingType ||
    !MEETING_TYPES[
      meetingType
    ]
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Please select a valid meeting type.",
      },
      {
        status: 400,
      }
    );
  }

  const customerName =
    body.customerName
      ?.trim();

  const companyName =
    body.companyName
      ?.trim() || null;

  const customerEmail =
    body.customerEmail
      ?.trim()
      .toLowerCase();

  const customerPhone =
    body.customerPhone
      ?.trim() || null;

  const notes =
    body.notes
      ?.trim() || null;

  if (
    !customerName ||
    customerName.length > 150
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Please enter your name.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    !customerEmail ||
    !isValidEmail(
      customerEmail
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Please enter a valid email address.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    companyName &&
    companyName.length > 200
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Company name is too long.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    customerPhone &&
    customerPhone.length > 50
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Phone number is too long.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    notes &&
    notes.length > 2000
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Meeting notes must be 2,000 characters or fewer.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    !body.start
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Please select a meeting time.",
      },
      {
        status: 400,
      }
    );
  }

  const start =
    new Date(
      body.start
    );

  if (
    Number.isNaN(
      start.getTime()
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "The selected meeting time is invalid.",
      },
      {
        status: 400,
      }
    );
  }

  const meeting =
    MEETING_TYPES[
      meetingType
    ];

  const end =
    addMinutes(
      start,
      meeting.durationMinutes
    );

  const startParts =
    getSaintLuciaParts(
      start
    );

  const endParts =
    getSaintLuciaParts(
      end
    );

  if (
    [
      "Sat",
      "Sun",
    ].includes(
      startParts.weekday
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Meetings are available Monday through Friday only.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    startParts.minute %
      SLOT_INTERVAL_MINUTES !==
    0
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Please select one of the available meeting times.",
      },
      {
        status: 400,
      }
    );
  }

  const startMinutes =
    startParts.hour *
      60 +
    startParts.minute;

  const endMinutes =
    endParts.hour *
      60 +
    endParts.minute;

  if (
    !sameSaintLuciaDate(
      start,
      end
    ) ||
    startMinutes <
      BUSINESS_START_MINUTES ||
    endMinutes >
      BUSINESS_END_MINUTES
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Meetings may only be scheduled between 10:00 AM and 3:00 PM.",
      },
      {
        status: 400,
      }
    );
  }

  const now =
    new Date();

  const todayKey =
    getSaintLuciaDateKey(
      now
    );

  const startDateKey =
    getSaintLuciaDateKey(
      start
    );

  const minimumBookingDate =
    addDaysToDateKey(
      todayKey,
      1
    );

  const maximumBookingDate =
    addDaysToDateKey(
      todayKey,
      MAX_BOOKING_DAYS
    );

  if (
    startDateKey <
    minimumBookingDate
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Appointments must be booked at least one day in advance.",
      },
      {
        status: 409,
      }
    );
  }

  if (
    startDateKey >
    maximumBookingDate
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          `Meetings may only be booked up to ${MAX_BOOKING_DAYS} days in advance.`,
      },
      {
        status: 400,
      }
    );
  }

  const minimumStart =
    new Date(
      now.getTime() +
        MIN_NOTICE_HOURS *
          60 *
          60 *
          1000
    );

  if (
    start <
    minimumStart
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          `Meetings require at least ${MIN_NOTICE_HOURS} hours' notice.`,
      },
      {
        status: 409,
      }
    );
  }

  const googleClientId =
    process.env
      .GOOGLE_CLIENT_ID;

  const googleClientSecret =
    process.env
      .GOOGLE_CLIENT_SECRET;

  const googleRefreshToken =
    process.env
      .GOOGLE_CALENDAR_REFRESH_TOKEN;

  const googleCalendarId =
    process.env
      .GOOGLE_CALENDAR_ID;

  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL ||
    process.env
      .SUPABASE_URL;

  const supabaseServiceRoleKey =
    process.env
      .SUPABASE_SERVICE_ROLE_KEY;

  if (
    !googleClientId ||
    !googleClientSecret ||
    !googleRefreshToken ||
    !googleCalendarId
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Google Calendar configuration is incomplete.",
      },
      {
        status: 500,
      }
    );
  }

  if (
    !supabaseUrl ||
    !supabaseServiceRoleKey
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Server database configuration is incomplete.",
      },
      {
        status: 500,
      }
    );
  }

  try {
    const auth =
      new google.auth.OAuth2(
        googleClientId,
        googleClientSecret
      );

    auth.setCredentials({
      refresh_token:
        googleRefreshToken,
    });

    const calendar =
      google.calendar({
        version: "v3",
        auth,
      });

    const freeBusyStart =
      addMinutes(
        start,
        -BUFFER_MINUTES
      );

    const proposedBlockedUntil =
      addMinutes(
        end,
        BUFFER_MINUTES
      );

    const freeBusyResult =
      await calendar.freebusy.query({
        requestBody: {
          timeMin:
            freeBusyStart.toISOString(),

          timeMax:
            proposedBlockedUntil.toISOString(),

          timeZone:
            TIME_ZONE,

          items: [
            {
              id:
                googleCalendarId,
            },
          ],
        },
      });

    const calendarData =
      freeBusyResult
        .data
        .calendars?.[
          googleCalendarId
        ];

    if (
      calendarData
        ?.errors
        ?.length
    ) {
      console.error(
        "Google FreeBusy errors:",
        calendarData.errors
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to confirm calendar availability.",
        },
        {
          status: 500,
        }
      );
    }

    const busyPeriods =
      (
        calendarData
          ?.busy ?? []
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

    const hasConflict =
      busyPeriods.some(
        (
          busy
        ) =>
          overlaps(
            start,
            proposedBlockedUntil,
            busy.start,
            busy.end
          )
      );

    if (
      hasConflict
    ) {
      return NextResponse.json(
        {
          success: false,

          code:
            "SLOT_UNAVAILABLE",

          error:
            "That time is no longer available. Please choose another meeting time.",
        },
        {
          status: 409,
        }
      );
    }

    const eventTitle =
      companyName
        ? `Ernest Rentals - ${meeting.label} - ${companyName}`
        : `Ernest Rentals - ${meeting.label} - ${customerName}`;

    const descriptionLines =
      [
        "Meeting booked through ernestrentals.com",
        "",
        `Meeting type: ${meeting.label}`,
        `Customer: ${customerName}`,

        companyName
          ? `Company: ${companyName}`
          : null,

        `Email: ${customerEmail}`,

        customerPhone
          ? `Phone: ${customerPhone}`
          : null,

        "",

        notes
          ? `Customer notes:\n${notes}`
          : "Customer notes: None provided",
      ].filter(
        (
          value
        ): value is string =>
          Boolean(value)
      );

    const googleEvent =
      await calendar.events.insert({
        calendarId:
          googleCalendarId,

        sendUpdates:
          "all",

        requestBody: {
          summary:
            eventTitle,

          description:
            descriptionLines.join(
              "\n"
            ),

          start: {
            dateTime:
              start.toISOString(),

            timeZone:
              TIME_ZONE,
          },

          end: {
            dateTime:
              end.toISOString(),

            timeZone:
              TIME_ZONE,
          },

          attendees: [
            {
              email:
                customerEmail,

              displayName:
                customerName,
            },
          ],

          transparency:
            "opaque",

          guestsCanInviteOthers:
            false,

          guestsCanModify:
            false,

          guestsCanSeeOtherGuests:
            false,

          extendedProperties: {
            private: {
              source:
                "ernestrentals.com",

              meetingType,
            },
          },
        },
      });

    const googleEventId =
      googleEvent
        .data
        .id;

    if (
      !googleEventId
    ) {
      throw new Error(
        "Google created the request but did not return an event ID."
      );
    }

    const supabase =
      createSupabaseClient(
        supabaseUrl,
        supabaseServiceRoleKey,
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
        meetingRecord,

      error:
        meetingInsertError,
    } =
      await supabase
        .from(
          "meetings"
        )
        .insert({
          meeting_type:
            meetingType,

          meeting_title:
            meeting.label,

          customer_name:
            customerName,

          company_name:
            companyName,

          customer_email:
            customerEmail,

          customer_phone:
            customerPhone,

          notes,

          start_time:
            start.toISOString(),

          end_time:
            end.toISOString(),

          time_zone:
            TIME_ZONE,

          status:
            "scheduled",

          source:
            "website",

          google_event_id:
            googleEventId,

          google_event_link:
            googleEvent
              .data
              .htmlLink ?? null,

          google_meet_link:
            null,
        })
        .select(`
          id,
          meeting_type,
          meeting_title,
          customer_name,
          company_name,
          customer_email,
          start_time,
          end_time,
          status,
          google_event_link
        `)
        .single();

    if (
      meetingInsertError ||
      !meetingRecord
    ) {
      console.error(
        "Meeting database insert error:",
        meetingInsertError
      );

      try {
        await calendar.events.delete({
          calendarId:
            googleCalendarId,

          eventId:
            googleEventId,

          sendUpdates:
            "all",
        });
      } catch (
        cleanupError
      ) {
        console.error(
          "Unable to clean up Google event:",
          cleanupError
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            "The meeting could not be saved. Please try again.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,

      message:
        "Your meeting has been scheduled.",

      meeting: {
        id:
          meetingRecord.id,

        type:
          meetingType,

        title:
          meeting.label,

        customerName:
          customerName,

        companyName:
          companyName,

        start:
          meetingRecord.start_time,

        end:
          meetingRecord.end_time,

        displayTime:
          formatSaintLuciaDateTime(
            start
          ),

        timeZone:
          TIME_ZONE,

        googleEventLink:
          meetingRecord.google_event_link,
      },
    });
  } catch (
    error
  ) {
    console.error(
      "Meeting booking error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to schedule the meeting.",
      },
      {
        status: 500,
      }
    );
  }
}