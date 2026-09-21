"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

type MeetingType =
  | "quick_consultation"
  | "campaign_planning"
  | "account_meeting";

type Slot = {
  start: string;
  end: string;
  display: string;
  label: string;
};

type AvailabilityResponse = {
  success: boolean;
  available?: boolean;
  reason?: string;
  error?: string;

  meeting?: {
    type: MeetingType;
    label: string;
    durationMinutes: number;
    bufferMinutes: number;
  };

  slots?: Slot[];
};

type BookingResponse = {
  success: boolean;
  message?: string;
  error?: string;

  meeting?: {
    id: string;
    type: MeetingType;
    title: string;
    customerName: string;
    companyName?: string | null;
    start: string;
    end: string;
    displayTime: string;
    timeZone: string;
  };
};

const MEETING_TYPES: Array<{
  value: MeetingType;
  title: string;
  duration: string;
  description: string;
}> = [
  {
    value: "quick_consultation",
    title: "Quick Advertising Consultation",
    duration: "15 min",
    description:
      "A short discussion about billboard availability, pricing or where to start.",
  },
  {
    value: "campaign_planning",
    title: "Campaign Planning Meeting",
    duration: "30 min",
    description:
      "Plan locations, advertising periods, packages and campaign requirements.",
  },
  {
    value: "account_meeting",
    title: "Existing Client / Account Meeting",
    duration: "30 min",
    description:
      "For current clients who want to discuss an active or upcoming campaign.",
  },
];

const TIME_ZONE =
  "America/St_Lucia";

function getSaintLuciaDateKey(
  date: Date
) {
  const parts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).formatToParts(date);

  const year =
    parts.find(
      (part) =>
        part.type === "year"
    )?.value;

  const month =
    parts.find(
      (part) =>
        part.type === "month"
    )?.value;

  const day =
    parts.find(
      (part) =>
        part.type === "day"
    )?.value;

  return `${year}-${month}-${day}`;
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

function isWeekend(
  dateKey: string
) {
  if (!dateKey) {
    return false;
  }

  const date =
    new Date(
      `${dateKey}T12:00:00-04:00`
    );

  const day =
    date.getUTCDay();

  return (
    day === 0 ||
    day === 6
  );
}

export default function MeetingScheduler() {
  const [
    meetingType,
    setMeetingType,
  ] =
    useState<MeetingType>(
      "quick_consultation"
    );

  const [
    selectedDate,
    setSelectedDate,
  ] =
    useState("");

  const [
    selectedSlot,
    setSelectedSlot,
  ] =
    useState<Slot | null>(
      null
    );

  const [
    slots,
    setSlots,
  ] =
    useState<Slot[]>([]);

  const [
    loadingAvailability,
    setLoadingAvailability,
  ] =
    useState(false);

  const [
    availabilityMessage,
    setAvailabilityMessage,
  ] =
    useState("");

  const [
    booking,
    setBooking,
  ] =
    useState(false);

  const [
    bookingError,
    setBookingError,
  ] =
    useState("");

  const [
    confirmation,
    setConfirmation,
  ] =
    useState<
      BookingResponse["meeting"] |
      null
    >(null);

  const [
    minimumDateKey,
    setMinimumDateKey,
  ] =
    useState("");

  const [
    maxDateKey,
    setMaxDateKey,
  ] =
    useState("");

  const [
    customerName,
    setCustomerName,
  ] =
    useState("");

  const [
    companyName,
    setCompanyName,
  ] =
    useState("");

  const [
    customerEmail,
    setCustomerEmail,
  ] =
    useState("");

  const [
    customerPhone,
    setCustomerPhone,
  ] =
    useState("");

  const [
    notes,
    setNotes,
  ] =
    useState("");

  const [
    website,
    setWebsite,
  ] =
    useState("");

  useEffect(
    () => {
      const today =
        getSaintLuciaDateKey(
          new Date()
        );

      const tomorrow =
        addDaysToDateKey(
          today,
          1
        );

      const maximumDate =
        addDaysToDateKey(
          today,
          30
        );

      setMinimumDateKey(
        tomorrow
      );

      setMaxDateKey(
        maximumDate
      );
    },
    []
  );

  useEffect(
    () => {
      setSelectedSlot(
        null
      );

      setSlots(
        []
      );

      setAvailabilityMessage(
        ""
      );

      setBookingError(
        ""
      );

      if (
        !selectedDate
      ) {
        return;
      }

      if (
        isWeekend(
          selectedDate
        )
      ) {
        setAvailabilityMessage(
          "Meetings are available Monday through Friday only."
        );

        return;
      }

      const controller =
        new AbortController();

      async function loadAvailability() {
        setLoadingAvailability(
          true
        );

        try {
          const params =
            new URLSearchParams({
              date:
                selectedDate,

              type:
                meetingType,
            });

          const response =
            await fetch(
              `/api/meetings/availability?${params.toString()}`,
              {
                method: "GET",
                signal:
                  controller.signal,
                cache:
                  "no-store",
              }
            );

          const data =
            (await response.json()) as
              AvailabilityResponse;

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.error ||
                "Unable to retrieve meeting availability."
            );
          }

          const availableSlots =
            data.slots ?? [];

          setSlots(
            availableSlots
          );

          if (
            availableSlots.length ===
            0
          ) {
            setAvailabilityMessage(
              data.reason ||
                "There are no available meeting times for this date."
            );
          }
        } catch (
          error
        ) {
          if (
            error instanceof
              DOMException &&
            error.name ===
              "AbortError"
          ) {
            return;
          }

          setAvailabilityMessage(
            error instanceof Error
              ? error.message
              : "Unable to retrieve meeting availability."
          );
        } finally {
          setLoadingAvailability(
            false
          );
        }
      }

      loadAvailability();

      return () => {
        controller.abort();
      };
    },
    [
      selectedDate,
      meetingType,
    ]
  );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setBookingError(
      ""
    );

    if (
      !selectedSlot
    ) {
      setBookingError(
        "Please choose an available meeting time."
      );

      return;
    }

    if (
      !customerName.trim()
    ) {
      setBookingError(
        "Please enter your name."
      );

      return;
    }

    if (
      !customerEmail.trim()
    ) {
      setBookingError(
        "Please enter your email address."
      );

      return;
    }

    setBooking(
      true
    );

    try {
      const response =
        await fetch(
          "/api/meetings/book",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                type:
                  meetingType,

                start:
                  selectedSlot.start,

                customerName:
                  customerName.trim(),

                companyName:
                  companyName.trim(),

                customerEmail:
                  customerEmail
                    .trim()
                    .toLowerCase(),

                customerPhone:
                  customerPhone.trim(),

                notes:
                  notes.trim(),

                website,
              }),
          }
        );

      const data =
        (await response.json()) as
          BookingResponse;

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            "Unable to schedule your meeting."
        );
      }

      if (
        !data.meeting
      ) {
        throw new Error(
          "The meeting was created, but confirmation information was not returned."
        );
      }

      setConfirmation(
        data.meeting
      );
    } catch (
      error
    ) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to schedule your meeting.";

      setBookingError(
        message
      );

      if (
        message
          .toLowerCase()
          .includes(
            "no longer available"
          )
      ) {
        const currentDate =
          selectedDate;

        setSelectedSlot(
          null
        );

        setSelectedDate(
          ""
        );

        setTimeout(
          () => {
            setSelectedDate(
              currentDate
            );
          },
          0
        );
      }
    } finally {
      setBooking(
        false
      );
    }
  }

  function resetScheduler() {
    setConfirmation(
      null
    );

    setSelectedDate(
      ""
    );

    setSelectedSlot(
      null
    );

    setSlots(
      []
    );

    setCustomerName(
      ""
    );

    setCompanyName(
      ""
    );

    setCustomerEmail(
      ""
    );

    setCustomerPhone(
      ""
    );

    setNotes(
      ""
    );

    setBookingError(
      ""
    );

    setAvailabilityMessage(
      ""
    );
  }

  if (
    confirmation
  ) {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-emerald-200 bg-white shadow-xl shadow-slate-200/60">
        <div className="bg-emerald-50 px-6 py-10 text-center sm:px-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-3xl font-black text-white">
            ✓
          </div>

          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-600">
            Meeting Confirmed
          </p>

          <h3 className="mt-3 text-3xl font-black tracking-tight text-[#071226]">
            You&apos;re booked with Ernest Rentals.
          </h3>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
            Your meeting has been added to our calendar and a Google Calendar
            invitation has been sent to your email address.
          </p>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
              Meeting
            </p>

            <p className="mt-2 font-black text-[#071226]">
              {confirmation.title}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
              Date &amp; Time
            </p>

            <p className="mt-2 font-black text-[#071226]">
              {confirmation.displayTime}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Saint Lucia time
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 p-6 sm:p-8">
          <button
            type="button"
            onClick={
              resetScheduler
            }
            className="w-full rounded-xl bg-[#071226] px-6 py-3.5 font-extrabold text-white transition hover:bg-slate-800"
          >
            Schedule Another Meeting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
      <div className="grid lg:grid-cols-[.95fr_1.05fr]">
        <div className="border-b border-slate-200 bg-slate-50/70 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
            Step 1
          </p>

          <h3 className="mt-2 text-2xl font-black tracking-tight">
            Choose your meeting.
          </h3>

          <div className="mt-6 space-y-3">
            {MEETING_TYPES.map(
              (
                meeting
              ) => {
                const active =
                  meetingType ===
                  meeting.value;

                return (
                  <button
                    key={
                      meeting.value
                    }
                    type="button"
                    onClick={() => {
                      setMeetingType(
                        meeting.value
                      );

                      setSelectedSlot(
                        null
                      );
                    }}
                    className={`w-full rounded-2xl border p-5 text-left transition ${
                      active
                        ? "border-orange-500 bg-orange-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black text-[#071226]">
                          {
                            meeting.title
                          }
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {
                            meeting.description
                          }
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ${
                          active
                            ? "bg-orange-500 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {
                          meeting.duration
                        }
                      </span>
                    </div>
                  </button>
                );
              }
            )}
          </div>

          <div className="mt-8">
            <label
              htmlFor="meeting-date"
              className="text-sm font-extrabold text-[#071226]"
            >
              Choose a date
            </label>

            <input
              id="meeting-date"
              type="date"
              min={
                minimumDateKey ||
                undefined
              }
              max={
                maxDateKey ||
                undefined
              }
              value={
                selectedDate
              }
              onChange={(
                event
              ) =>
                setSelectedDate(
                  event.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 font-semibold outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Monday–Friday · 10:00 AM–3:00 PM · Saint Lucia time
            </p>

            <p className="mt-1 text-xs font-semibold text-orange-600">
              Appointments must be booked at least one day in advance.
            </p>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-extrabold text-[#071226]">
                Available times
              </p>

              {loadingAvailability && (
                <span className="text-xs font-bold text-orange-500">
                  Checking calendar...
                </span>
              )}
            </div>

            {!selectedDate && (
              <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm leading-6 text-slate-500">
                Select a date to see live availability.
              </div>
            )}

            {selectedDate &&
              !loadingAvailability &&
              slots.length >
                0 && (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {slots.map(
                    (
                      slot
                    ) => {
                      const active =
                        selectedSlot
                          ?.start ===
                        slot.start;

                      return (
                        <button
                          key={
                            slot.start
                          }
                          type="button"
                          onClick={() =>
                            setSelectedSlot(
                              slot
                            )
                          }
                          className={`rounded-xl border px-3 py-3 text-sm font-extrabold transition ${
                            active
                              ? "border-orange-500 bg-orange-500 text-white"
                              : "border-slate-200 bg-white text-[#071226] hover:border-orange-300 hover:bg-orange-50"
                          }`}
                        >
                          {
                            slot.display
                          }
                        </button>
                      );
                    }
                  )}
                </div>
              )}

            {selectedDate &&
              !loadingAvailability &&
              availabilityMessage && (
                <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  {
                    availabilityMessage
                  }
                </div>
              )}

            {selectedSlot && (
              <div className="mt-4 rounded-2xl bg-[#071226] p-4 text-white">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-orange-400">
                  Selected Time
                </p>

                <p className="mt-1 font-black">
                  {
                    selectedSlot.label
                  }
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Saint Lucia time
                </p>
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="p-6 sm:p-8"
        >
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
            Step 2
          </p>

          <h3 className="mt-2 text-2xl font-black tracking-tight">
            Tell us who we&apos;re meeting.
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Once confirmed, the meeting will be added to the Ernest Rentals
            calendar and an invitation will be sent to your email.
          </p>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="customer-name"
                className="text-sm font-extrabold"
              >
                Your name *
              </label>

              <input
                id="customer-name"
                type="text"
                required
                autoComplete="name"
                value={
                  customerName
                }
                onChange={(
                  event
                ) =>
                  setCustomerName(
                    event.target.value
                  )
                }
                placeholder="Full name"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="company-name"
                className="text-sm font-extrabold"
              >
                Company / Organization
              </label>

              <input
                id="company-name"
                type="text"
                autoComplete="organization"
                value={
                  companyName
                }
                onChange={(
                  event
                ) =>
                  setCompanyName(
                    event.target.value
                  )
                }
                placeholder="Optional"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="customer-email"
                className="text-sm font-extrabold"
              >
                Email *
              </label>

              <input
                id="customer-email"
                type="email"
                required
                autoComplete="email"
                value={
                  customerEmail
                }
                onChange={(
                  event
                ) =>
                  setCustomerEmail(
                    event.target.value
                  )
                }
                placeholder="you@company.com"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="customer-phone"
                className="text-sm font-extrabold"
              >
                Phone
              </label>

              <input
                id="customer-phone"
                type="tel"
                autoComplete="tel"
                value={
                  customerPhone
                }
                onChange={(
                  event
                ) =>
                  setCustomerPhone(
                    event.target.value
                  )
                }
                placeholder="758-..."
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="meeting-notes"
                className="text-sm font-extrabold"
              >
                What would you like to discuss?
              </label>

              <textarea
                id="meeting-notes"
                rows={5}
                maxLength={2000}
                value={
                  notes
                }
                onChange={(
                  event
                ) =>
                  setNotes(
                    event.target.value
                  )
                }
                placeholder="Tell us briefly about your advertising needs, preferred locations, campaign or account question."
                className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
          >
            <label htmlFor="website-field">
              Website
            </label>

            <input
              id="website-field"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={
                website
              }
              onChange={(
                event
              ) =>
                setWebsite(
                  event.target.value
                )
              }
            />
          </div>

          {bookingError && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-700">
              {
                bookingError
              }
            </div>
          )}

          <button
            type="submit"
            disabled={
              booking ||
              !selectedSlot
            }
            className="mt-7 w-full rounded-xl bg-orange-500 px-6 py-4 text-base font-extrabold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {booking
              ? "Scheduling Meeting..."
              : selectedSlot
                ? "Confirm Meeting"
                : "Choose a Time First"}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-slate-400">
            Available appointments are checked against our live calendar before
            the booking is confirmed.
          </p>
        </form>
      </div>
    </div>
  );
}