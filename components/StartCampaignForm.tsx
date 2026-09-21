"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import {
  createBrowserClient,
} from "@/lib/supabase/client";

type StartCampaignFormProps = {
  billboardId: string;
  billboardName: string;
  billboardType: string;
  location: string | null;
  startDate: string;
  changeoverDate: string;

  selectedPackageId?: string | null;
  selectedPackageName?: string | null;
  selectedPackageCode?: string | null;
  selectedPackageType?: string | null;
  selectedPackagePrice?: number | null;
  selectedPackageCurrency?: string | null;
  selectedPackageDurationLabel?: string | null;
  selectedPackageSlotDuration?: number | null;
  selectedPackageIncludesAdCreation?: boolean;

  onClose: () => void;
};

type Step =
  | 1
  | 2
  | 3
  | 4;

type ArtworkChoice =
  | ""
  | "ready"
  | "need_creation"
  | "later";

function formatMoney(
  value: number,
  currency: string
) {
  try {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }
    ).format(value);
  } catch {
    return `${currency} ${value.toFixed(
      0
    )}`;
  }
}

function titleCase(
  value: string
) {
  return value
    .replaceAll(
      "_",
      " "
    )
    .replace(
      /\b\w/g,
      (
        letter
      ) =>
        letter.toUpperCase()
    );
}

function formatScheduleDate(
  value: string
) {
  if (
    !value
  ) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          "UTC",
        year:
          "numeric",
        month:
          "short",
        day:
          "numeric",
      }
    ).format(
      new Date(
        `${value}T00:00:00Z`
      )
    );
  } catch {
    return value;
  }
}

function saintLuciaTodayString() {
  const parts =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "America/St_Lucia",
        year:
          "numeric",
        month:
          "2-digit",
        day:
          "2-digit",
      }
    ).formatToParts(
      new Date()
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

function getFriendlySubmissionError(
  message:
    | string
    | undefined
) {
  const value =
    (
      message ??
      ""
    ).toLowerCase();

  if (
    value.includes(
      "campaign start date cannot be before today"
    )
  ) {
    return "The selected campaign start date has passed. Please return to the billboard page and choose a current or future date.";
  }

  if (
    value.includes(
      "changeover date must be after the start date"
    )
  ) {
    return "The campaign changeover date must be after the start date.";
  }

  if (
    value.includes(
      "selected billboard is not available"
    )
  ) {
    return "This billboard is no longer available for public campaign requests.";
  }

  if (
    value.includes(
      "billboard type does not match"
    )
  ) {
    return "The selected billboard information has changed. Please reopen the billboard and try again.";
  }

  if (
    value.includes(
      "unsupported billboard type"
    )
  ) {
    return "This billboard type cannot currently accept online campaign requests.";
  }

  if (
    value.includes(
      "rental package is required"
    )
  ) {
    return "Please select a 3, 6 or 12-month rental package before submitting your campaign.";
  }

  if (
    value.includes(
      "package does not belong to this billboard"
    )
  ) {
    return "The selected package is not available for this billboard. Please choose another package.";
  }

  if (
    value.includes(
      "selected digital advertising package is not available"
    ) ||
    value.includes(
      "selected advertising package is not available"
    )
  ) {
    return "The selected advertising package is no longer available. Please choose another package.";
  }

  if (
    value.includes(
      "please select a digital advertising option"
    )
  ) {
    return "Please select a digital advertising option before submitting your campaign.";
  }

  if (
    value.includes(
      "campaign dates do not match the selected package duration"
    )
  ) {
    return "The selected dates do not match the duration of this package. Please return to the billboard page and use the package schedule provided.";
  }

  if (
    value.includes(
      "digital campaigns must begin"
    )
  ) {
    return "Digital campaigns must begin on a future available date.";
  }

  if (
    value.includes(
      "standard and premium digital campaigns must begin on a monday"
    )
  ) {
    return "Standard and Premium digital campaigns begin on Mondays. Please use one of the available Monday start dates.";
  }

  if (
    value.includes(
      "already booked"
    ) ||
    value.includes(
      "not available for the requested campaign period"
    )
  ) {
    return "This billboard was booked for part or all of your selected campaign period. Please return to the billboard page and use the next available dates.";
  }

  if (
    value.includes(
      "no static billboard face is available"
    )
  ) {
    return "This billboard is fully booked for the selected campaign period. Please choose its next available dates.";
  }

  if (
    value.includes(
      "no standard digital advertising slot"
    )
  ) {
    return "Standard advertising slots are fully booked for the selected period. Please choose another available period.";
  }

  if (
    value.includes(
      "no premium digital advertising slot"
    )
  ) {
    return "Premium advertising slots are fully booked for the selected period. Please choose another available period.";
  }

  if (
    value.includes(
      "no shoutout advertising slot"
    )
  ) {
    return "Shoutout advertising is fully booked for the selected period. Please choose another available date.";
  }

  if (
    value.includes(
      "contact person is required"
    )
  ) {
    return "Please enter the name of the person Ernest Rentals should contact.";
  }

  if (
    value.includes(
      "email, phone or whatsapp is required"
    )
  ) {
    return "Please provide at least one contact method: email, phone or WhatsApp.";
  }

  return "We could not submit your campaign request right now. Please review your campaign details and try again.";
}

function StepBadge({
  number,
  label,
  currentStep,
}: {
  number: Step;
  label: string;
  currentStep: Step;
}) {
  const completed =
    currentStep >
    number;

  const active =
    currentStep ===
    number;

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black transition ${
          completed
            ? "bg-emerald-500 text-white"
            : active
              ? "bg-orange-500 text-white shadow-sm"
              : "bg-slate-100 text-slate-400"
        }`}
      >
        {completed
          ? "✓"
          : number}
      </div>

      <div className="hidden min-w-0 sm:block">
        <p
          className={`truncate text-[10px] font-extrabold uppercase tracking-wide ${
            active
              ? "text-orange-600"
              : completed
                ? "text-emerald-600"
                : "text-slate-400"
          }`}
        >
          Step {number}
        </p>

        <p
          className={`truncate text-xs font-bold ${
            active
              ? "text-slate-900"
              : "text-slate-500"
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-black ${
          accent
            ? "text-orange-500"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default function StartCampaignForm({
  billboardId,
  billboardName,
  billboardType,
  location,
  startDate,
  changeoverDate,

  selectedPackageId = null,
  selectedPackageName = null,
  selectedPackageCode = null,
  selectedPackageType = null,
  selectedPackagePrice = null,
  selectedPackageCurrency = null,
  selectedPackageDurationLabel = null,
  selectedPackageSlotDuration = null,
  selectedPackageIncludesAdCreation = false,

  onClose,
}: StartCampaignFormProps) {
  const supabase =
    useMemo(
      () =>
        createBrowserClient(),
      []
    );

  const today =
    saintLuciaTodayString();

  const [
    step,
    setStep,
  ] =
    useState<Step>(
      1
    );

  const [
    companyName,
    setCompanyName,
  ] =
    useState("");

  const [
    contactPerson,
    setContactPerson,
  ] =
    useState("");

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    phone,
    setPhone,
  ] =
    useState("");

  const [
    whatsapp,
    setWhatsapp,
  ] =
    useState("");

  const [
    adOption,
    setAdOption,
  ] =
    useState("");

  const [
    campaignName,
    setCampaignName,
  ] =
    useState("");

  const [
    campaignObjective,
    setCampaignObjective,
  ] =
    useState("");

  const [
    artworkChoice,
    setArtworkChoice,
  ] =
    useState<ArtworkChoice>(
      ""
    );

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState(false);

  const hasSelectedPackage =
    Boolean(
      selectedPackageId &&
      selectedPackageName
    );

  const isStatic =
    billboardType ===
    "static";

  const staticPackageRequired =
    isStatic &&
    !hasSelectedPackage;

  const selectedPackageSummary =
    useMemo(
      () => {
        if (
          !selectedPackageName
        ) {
          return "";
        }

        const parts:
          string[] = [
            selectedPackageName,
          ];

        if (
          selectedPackageCode
        ) {
          parts.push(
            `Code: ${selectedPackageCode}`
          );
        }

        if (
          selectedPackagePrice !==
            null &&
          selectedPackageCurrency
        ) {
          parts.push(
            `Price: ${formatMoney(
              selectedPackagePrice,
              selectedPackageCurrency
            )}`
          );
        }

        if (
          selectedPackageSlotDuration
        ) {
          parts.push(
            `${selectedPackageSlotDuration}-second ad`
          );
        }

        if (
          selectedPackageDurationLabel
        ) {
          parts.push(
            selectedPackageDurationLabel
          );
        }

        return parts.join(
          " | "
        );
      },
      [
        selectedPackageName,
        selectedPackageCode,
        selectedPackagePrice,
        selectedPackageCurrency,
        selectedPackageSlotDuration,
        selectedPackageDurationLabel,
      ]
    );

  const artworkLabel =
    artworkChoice ===
      "ready"
      ? "Artwork ready"
      : artworkChoice ===
          "need_creation"
        ? selectedPackageIncludesAdCreation
          ? "Use included ad creation"
          : "Need Ernest Rentals to create my ad"
        : artworkChoice ===
            "later"
          ? "Artwork will be provided later"
          : "Not selected";

  function validateSchedule() {
    if (
      !startDate ||
      !changeoverDate ||
      changeoverDate <=
        startDate
    ) {
      setErrorMessage(
        "The campaign schedule is invalid. Please return to the billboard page and choose the dates again."
      );

      return false;
    }

    if (
      startDate <
      today
    ) {
      setErrorMessage(
        "The advertising start date cannot be before today. Please return to the billboard page and choose today or a future start date."
      );

      return false;
    }

    if (
      staticPackageRequired
    ) {
      setErrorMessage(
        "Static billboards require a 3, 6 or 12-month rental package. Please choose a package from the billboard details page before continuing."
      );

      return false;
    }

    if (
      isStatic &&
      selectedPackageType &&
      selectedPackageType !==
        "static"
    ) {
      setErrorMessage(
        "The selected package does not match this static billboard."
      );

      return false;
    }

    return true;
  }

  function validateCustomerDetails() {
    if (
      !contactPerson.trim()
    ) {
      setErrorMessage(
        "Please enter a contact person."
      );

      return false;
    }

    if (
      !email.trim() &&
      !phone.trim() &&
      !whatsapp.trim()
    ) {
      setErrorMessage(
        "Please provide an email address, phone number or WhatsApp number."
      );

      return false;
    }

    return true;
  }

  function goNext() {
    setErrorMessage(
      ""
    );

    if (
      step ===
      1
    ) {
      if (
        !validateSchedule()
      ) {
        return;
      }

      setStep(
        2
      );

      return;
    }

    if (
      step ===
      2
    ) {
      if (
        !validateCustomerDetails()
      ) {
        return;
      }

      setStep(
        3
      );

      return;
    }

    if (
      step ===
      3
    ) {
      setStep(
        4
      );
    }
  }

  function goBack() {
    setErrorMessage(
      ""
    );

    setStep(
      (
        current
      ) =>
        Math.max(
          1,
          current - 1
        ) as Step
    );
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage(
      ""
    );

    if (
      !validateSchedule()
    ) {
      setStep(
        1
      );

      return;
    }

    if (
      !validateCustomerDetails()
    ) {
      setStep(
        2
      );

      return;
    }

    setLoading(
      true
    );

    const advertisingOption =
      hasSelectedPackage
        ? selectedPackageSummary
        : adOption.trim() ||
          null;

    const artworkReady =
      artworkChoice ===
      "ready";

    const artworkNote =
      artworkChoice ===
      "need_creation"
        ? selectedPackageIncludesAdCreation
          ? "Artwork request: Customer selected the package's included ad creation service."
          : "Artwork request: Customer would like Ernest Rentals to create the advertisement."
        : artworkChoice ===
            "later"
          ? "Artwork request: Customer will provide artwork later."
          : null;

    const combinedMessage = [
      artworkNote,
      message.trim() ||
        null,
    ]
      .filter(
        Boolean
      )
      .join(
        "\n\n"
      ) ||
      null;

    const {
      error,
    } =
      await supabase.rpc(
        "submit_public_campaign_inquiry",
        {
          p_company_name:
            companyName.trim() ||
            null,

          p_contact_person:
            contactPerson.trim(),

          p_email:
            email.trim() ||
            null,

          p_phone:
            phone.trim() ||
            null,

          p_whatsapp:
            whatsapp.trim() ||
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
            advertisingOption,

          p_campaign_name:
            campaignName.trim() ||
            null,

          p_campaign_objective:
            campaignObjective.trim() ||
            null,

          p_artwork_ready:
            artworkChoice ===
              ""
              ? null
              : artworkReady,

          p_message:
            combinedMessage,

          p_requested_package_id:
            selectedPackageId,
        }
      );

    setLoading(
      false
    );

    if (
      error
    ) {
      console.error(
        error
      );

      const friendlyMessage =
        getFriendlySubmissionError(
          error.message
        );

      setErrorMessage(
        friendlyMessage
      );

      /*
        Most server-side booking errors are
        related to the billboard, schedule
        or package, so return the customer
        to Step 1 to review the campaign.
      */
      setStep(
        1
      );

      return;
    }

    setSuccess(
      true
    );
  }

  if (
    success
  ) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-[#020817]/75 px-4 pb-8 pt-24 backdrop-blur-sm md:pt-28">
        <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
            ✓
          </div>

          <h2 className="mt-5 text-2xl font-black text-[#071226]">
            Campaign request received
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Thank you. Your request has been sent to Ernest Rentals with the
            selected billboard, package and campaign schedule. A representative
            will contact you shortly to confirm the next steps.
          </p>

          <div className="mx-auto mt-5 max-w-md rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Requested Schedule
            </p>

            <div className="mt-3 grid grid-cols-2 gap-3 text-left">
              <SummaryItem
                label="Start"
                value={`${formatScheduleDate(
                  startDate
                )} · 9:00 AM`}
              />

              <SummaryItem
                label="Changeover"
                value={`${formatScheduleDate(
                  changeoverDate
                )} · 9:00 AM`}
              />
            </div>
          </div>

          {selectedPackageName && (
            <div className="mx-auto mt-4 max-w-md rounded-2xl bg-slate-50 p-4 text-left">
              <SummaryItem
                label="Requested Package"
                value={
                  selectedPackageName
                }
              />

              {selectedPackagePrice !==
                null &&
                selectedPackageCurrency && (
                <div className="mt-3">
                  <SummaryItem
                    label="Package Price"
                    value={formatMoney(
                      selectedPackagePrice,
                      selectedPackageCurrency
                    )}
                    accent
                  />
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={
              onClose
            }
            className="mt-6 rounded-xl bg-[#071226] px-6 py-3 font-bold text-white transition hover:bg-orange-600"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-hidden bg-[#020817]/75 px-4 pb-6 pt-20 backdrop-blur-sm md:pt-24">
      <div className="mx-auto flex max-h-[calc(100dvh-6rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="shrink-0 border-b border-slate-200 bg-white">
          <div className="flex items-start justify-between gap-5 px-6 py-5">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
                Start Campaign
              </p>

              <h2 className="mt-1 text-xl font-black text-[#071226] sm:text-2xl">
                {billboardName}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {location ||
                  "Saint Lucia"}{" "}
                •{" "}
                {billboardType ===
                "digital"
                  ? "Digital Billboard"
                  : "Static Billboard"}
              </p>
            </div>

            <button
              type="button"
              onClick={
                onClose
              }
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          {/* STEPS */}
          <div className="border-t border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <StepBadge
                number={
                  1
                }
                label="Campaign"
                currentStep={
                  step
                }
              />

              <div className="h-px flex-1 bg-slate-200" />

              <StepBadge
                number={
                  2
                }
                label="Your Details"
                currentStep={
                  step
                }
              />

              <div className="h-px flex-1 bg-slate-200" />

              <StepBadge
                number={
                  3
                }
                label="Artwork"
                currentStep={
                  step
                }
              />

              <div className="h-px flex-1 bg-slate-200" />

              <StepBadge
                number={
                  4
                }
                label="Review"
                currentStep={
                  step
                }
              />
            </div>
          </div>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="p-6">

            {/* STEP 1 */}
            {step ===
              1 && (
              <div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-orange-500">
                    Step 1 of 4
                  </p>

                  <h3 className="mt-1 text-xl font-black text-slate-900">
                    Review your campaign
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Confirm the billboard, package and campaign schedule before
                    continuing.
                  </p>
                </div>

                <div className="mt-5 rounded-2xl bg-[#071226] p-5 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-orange-400">
                    Selected Billboard
                  </p>

                  <p className="mt-1 text-lg font-black">
                    {billboardName}
                  </p>

                  <p className="mt-1 text-xs text-slate-300">
                    {location ||
                      "Saint Lucia"}{" "}
                    •{" "}
                    {billboardType ===
                    "digital"
                      ? "Digital Billboard"
                      : "Static Billboard"}
                  </p>
                </div>

                <div className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2">
                  <SummaryItem
                    label="Start"
                    value={`${formatScheduleDate(
                      startDate
                    )} · 9:00 AM`}
                  />

                  <SummaryItem
                    label="Changeover"
                    value={`${formatScheduleDate(
                      changeoverDate
                    )} · 9:00 AM`}
                  />
                </div>

                {hasSelectedPackage ? (
                  <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50/60 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-orange-500">
                          Selected Package
                        </p>

                        <p className="mt-1 text-lg font-black text-[#071226]">
                          {
                            selectedPackageName
                          }
                        </p>

                        {selectedPackageType && (
                          <p className="mt-1 text-xs font-semibold text-slate-500">
                            {titleCase(
                              selectedPackageType
                            )}

                            {selectedPackageSlotDuration
                              ? ` · ${selectedPackageSlotDuration}-second ad`
                              : ""}

                            {selectedPackageDurationLabel
                              ? ` · ${selectedPackageDurationLabel}`
                              : ""}
                          </p>
                        )}
                      </div>

                      {selectedPackagePrice !==
                        null &&
                        selectedPackageCurrency && (
                        <div className="text-right">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Package Price
                          </p>

                          <p className="mt-1 text-2xl font-black text-orange-500">
                            {formatMoney(
                              selectedPackagePrice,
                              selectedPackageCurrency
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedPackageIncludesAdCreation && (
                      <p className="mt-3 border-t border-orange-100 pt-3 text-xs font-bold text-violet-700">
                        ✓ Ad creation included with this package
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-4">
                    <label>
                      <span className="text-sm font-semibold text-slate-700">
                        Advertising Option
                      </span>

                      <select
                        value={
                          adOption
                        }
                        onChange={(
                          event
                        ) =>
                          setAdOption(
                            event.target.value
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-400"
                      >
                        <option value="">
                          Select an option
                        </option>

                        {billboardType ===
                        "digital" ? (
                          <>
                            <option value="Standard 10-Second Advertising">
                              Standard 10-Second Advertising
                            </option>

                            <option value="Premium 15-Second Advertising">
                              Premium 15-Second Advertising
                            </option>

                            <option value="Shoutout Advertising">
                              Shoutout Advertising
                            </option>
                          </>
                        ) : (
                          <option value="Static Billboard Advertising">
                            Static Billboard Advertising
                          </option>
                        )}
                      </select>
                    </label>
                  </div>
                )}

                {staticPackageRequired && (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-bold text-amber-800">
                      Choose a rental package first
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-700">
                      Static billboards require a 3, 6 or 12-month package before
                      a campaign request can be submitted.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2 */}
            {step ===
              2 && (
              <div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-orange-500">
                    Step 2 of 4
                  </p>

                  <h3 className="mt-1 text-xl font-black text-slate-900">
                    Tell us about you
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    We only need enough information to contact you and confirm
                    the campaign.
                  </p>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <label>
                    <span className="text-sm font-semibold text-slate-700">
                      Company Name
                    </span>

                    <input
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
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </label>

                  <label>
                    <span className="text-sm font-semibold text-slate-700">
                      Contact Person *
                    </span>

                    <input
                      value={
                        contactPerson
                      }
                      onChange={(
                        event
                      ) =>
                        setContactPerson(
                          event.target.value
                        )
                      }
                      required
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </label>

                  <label>
                    <span className="text-sm font-semibold text-slate-700">
                      Email
                    </span>

                    <input
                      type="email"
                      value={
                        email
                      }
                      onChange={(
                        event
                      ) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </label>

                  <label>
                    <span className="text-sm font-semibold text-slate-700">
                      Phone
                    </span>

                    <input
                      value={
                        phone
                      }
                      onChange={(
                        event
                      ) =>
                        setPhone(
                          event.target.value
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </label>

                  <label className="md:col-span-2">
                    <span className="text-sm font-semibold text-slate-700">
                      WhatsApp
                    </span>

                    <input
                      value={
                        whatsapp
                      }
                      onChange={(
                        event
                      ) =>
                        setWhatsapp(
                          event.target.value
                        )
                      }
                      placeholder="Recommended"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </label>
                </div>

                <div className="mt-5 rounded-xl bg-sky-50 p-4 text-xs leading-5 text-sky-800">
                  Please provide at least one contact method: email, phone or
                  WhatsApp.
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step ===
              3 && (
              <div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-orange-500">
                    Step 3 of 4
                  </p>

                  <h3 className="mt-1 text-xl font-black text-slate-900">
                    Campaign & artwork
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Tell us what you are advertising and how you want to handle
                    the artwork.
                  </p>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <label>
                    <span className="text-sm font-semibold text-slate-700">
                      Campaign Name
                    </span>

                    <input
                      value={
                        campaignName
                      }
                      onChange={(
                        event
                      ) =>
                        setCampaignName(
                          event.target.value
                        )
                      }
                      placeholder="Optional"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </label>

                  <label>
                    <span className="text-sm font-semibold text-slate-700">
                      Campaign Objective
                    </span>

                    <input
                      value={
                        campaignObjective
                      }
                      onChange={(
                        event
                      ) =>
                        setCampaignObjective(
                          event.target.value
                        )
                      }
                      placeholder="Brand awareness, launch, event..."
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </label>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-slate-700">
                    What about your artwork?
                  </p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() =>
                        setArtworkChoice(
                          "ready"
                        )
                      }
                      className={`rounded-2xl border p-4 text-left transition ${
                        artworkChoice ===
                        "ready"
                          ? "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-100"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="text-lg">
                        ✓
                      </div>

                      <p className="mt-2 text-sm font-black text-slate-900">
                        Artwork Ready
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        I already have the artwork and can provide it.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setArtworkChoice(
                          "need_creation"
                        )
                      }
                      className={`rounded-2xl border p-4 text-left transition ${
                        artworkChoice ===
                        "need_creation"
                          ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="text-lg">
                        ✦
                      </div>

                      <p className="mt-2 text-sm font-black text-slate-900">
                        Need Ad Creation
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {selectedPackageIncludesAdCreation
                          ? "Use the ad creation included with this package."
                          : "I would like Ernest Rentals to create my ad."}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setArtworkChoice(
                          "later"
                        )
                      }
                      className={`rounded-2xl border p-4 text-left transition ${
                        artworkChoice ===
                        "later"
                          ? "border-sky-400 bg-sky-50 ring-2 ring-sky-100"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="text-lg">
                        ▷
                      </div>

                      <p className="mt-2 text-sm font-black text-slate-900">
                        Provide Later
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        I will send the artwork after my request is confirmed.
                      </p>
                    </button>
                  </div>
                </div>

                <label className="mt-6 block">
                  <span className="text-sm font-semibold text-slate-700">
                    Additional Information
                  </span>

                  <textarea
                    rows={
                      4
                    }
                    value={
                      message
                    }
                    onChange={(
                      event
                    ) =>
                      setMessage(
                        event.target.value
                      )
                    }
                    placeholder="Anything else Ernest Rentals should know?"
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </label>
              </div>
            )}

            {/* STEP 4 */}
            {step ===
              4 && (
              <div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-orange-500">
                    Step 4 of 4
                  </p>

                  <h3 className="mt-1 text-xl font-black text-slate-900">
                    Review & submit
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Check the details below before sending your campaign
                    request.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl bg-[#071226] p-5 text-white">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <SummaryItem
                      label="Billboard"
                      value={
                        billboardName
                      }
                    />

                    <SummaryItem
                      label="Location"
                      value={
                        location ||
                        "Saint Lucia"
                      }
                    />

                    <SummaryItem
                      label="Start"
                      value={`${formatScheduleDate(
                        startDate
                      )} · 9:00 AM`}
                    />

                    <SummaryItem
                      label="Changeover"
                      value={`${formatScheduleDate(
                        changeoverDate
                      )} · 9:00 AM`}
                    />
                  </div>
                </div>

                {hasSelectedPackage && (
                  <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50/60 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <SummaryItem
                        label="Package"
                        value={
                          selectedPackageName ||
                          "Selected Package"
                        }
                      />

                      {selectedPackagePrice !==
                        null &&
                        selectedPackageCurrency && (
                        <SummaryItem
                          label="Price"
                          value={formatMoney(
                            selectedPackagePrice,
                            selectedPackageCurrency
                          )}
                          accent
                        />
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
                  <SummaryItem
                    label="Contact"
                    value={
                      contactPerson
                    }
                  />

                  <SummaryItem
                    label="Company"
                    value={
                      companyName ||
                      "—"
                    }
                  />

                  <SummaryItem
                    label="Email"
                    value={
                      email ||
                      "—"
                    }
                  />

                  <SummaryItem
                    label="Phone / WhatsApp"
                    value={
                      whatsapp ||
                      phone ||
                      "—"
                    }
                  />

                  <SummaryItem
                    label="Campaign"
                    value={
                      campaignName ||
                      "—"
                    }
                  />

                  <SummaryItem
                    label="Artwork"
                    value={
                      artworkLabel
                    }
                  />
                </div>

                {(campaignObjective ||
                  message) && (
                  <div className="mt-4 rounded-2xl bg-slate-50 p-5">
                    {campaignObjective && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Campaign Objective
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {
                            campaignObjective
                          }
                        </p>
                      </div>
                    )}

                    {message && (
                      <div
                        className={
                          campaignObjective
                            ? "mt-4 border-t border-slate-200 pt-4"
                            : ""
                        }
                      >
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Additional Information
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {
                            message
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4 text-xs leading-5 text-sky-800">
                  Submitting this form sends a campaign request to Ernest
                  Rentals. The billboard is not reserved until the request is
                  confirmed.
                </div>
              </div>
            )}

            {/* ERROR */}
            {errorMessage && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-black text-red-700">
                    !
                  </div>

                  <div>
                    <p className="text-sm font-extrabold text-red-800">
                      We need you to review something
                    </p>

                    <p className="mt-1 text-sm leading-6 text-red-700">
                      {
                        errorMessage
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
            <div>
              {step >
              1 ? (
                <button
                  type="button"
                  onClick={
                    goBack
                  }
                  disabled={
                    loading
                  }
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  ← Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={
                    onClose
                  }
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>

            {step <
            4 ? (
              <button
                type="button"
                onClick={
                  goNext
                }
                disabled={
                  staticPackageRequired
                }
                className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {staticPackageRequired
                  ? "Choose Package First"
                  : "Continue →"}
              </button>
            ) : (
              <button
                type="submit"
                disabled={
                  loading
                }
                className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading
                  ? "Submitting..."
                  : "Submit Campaign Request"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}