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
    return `${currency} ${value.toFixed(0)}`;
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
      (letter) =>
        letter.toUpperCase()
    );
}

function formatScheduleDate(
  value: string
) {
  if (!value) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: "UTC",
        year: "numeric",
        month: "short",
        day: "numeric",
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
    artworkReady,
    setArtworkReady,
  ] =
    useState("");

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
    useMemo(() => {
      if (
        !selectedPackageName
      ) {
        return "";
      }

      const parts: string[] =
        [
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
    }, [
      selectedPackageName,
      selectedPackageCode,
      selectedPackagePrice,
      selectedPackageCurrency,
      selectedPackageSlotDuration,
      selectedPackageDurationLabel,
    ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    if (
      !startDate ||
      !changeoverDate ||
      changeoverDate <=
        startDate
    ) {
      setErrorMessage(
        "The campaign schedule is invalid. Please return to the billboard page and choose the dates again."
      );

      return;
    }

    if (
      staticPackageRequired
    ) {
      setErrorMessage(
        "Static billboards require a 3, 6 or 12-month rental package. Please choose a package from the billboard details page before submitting your request."
      );

      return;
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

      return;
    }

    if (
      !contactPerson.trim()
    ) {
      setErrorMessage(
        "Please enter a contact person."
      );

      return;
    }

    if (
      !email.trim() &&
      !phone.trim() &&
      !whatsapp.trim()
    ) {
      setErrorMessage(
        "Please provide an email address, phone number or WhatsApp number."
      );

      return;
    }

    setLoading(true);

    const advertisingOption =
      hasSelectedPackage
        ? selectedPackageSummary
        : adOption.trim() ||
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
            artworkReady === ""
              ? null
              : artworkReady ===
                "yes",

          p_message:
            message.trim() ||
            null,

          p_requested_package_id:
            selectedPackageId,
        }
      );

    setLoading(false);

    if (error) {
      console.error(error);

      setErrorMessage(
        "We could not submit your request right now. Please try again."
      );

      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/75 px-4 py-8 backdrop-blur-sm">
        <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-2xl">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
            ✓
          </div>

          <h2 className="mt-5 text-2xl font-black text-[#071226]">
            Campaign request received
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Thank you. Your request has been sent to Ernest Rentals with the selected billboard, package and campaign schedule. A representative will contact you shortly to confirm the next steps.
          </p>

          <div className="mx-auto mt-5 max-w-md rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Requested Schedule
            </p>

            <div className="mt-3 grid grid-cols-2 gap-3 text-left">
              <div>
                <p className="text-xs text-slate-400">
                  Start
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {formatScheduleDate(
                    startDate
                  )}{" "}
                  · 9:00 AM
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Changeover
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {formatScheduleDate(
                    changeoverDate
                  )}{" "}
                  · 9:00 AM
                </p>
              </div>
            </div>
          </div>

          {selectedPackageName && (
            <div className="mx-auto mt-4 max-w-md rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Requested Package
              </p>

              <p className="mt-1 font-black text-slate-900">
                {
                  selectedPackageName
                }
              </p>

              {selectedPackagePrice !==
                null &&
                selectedPackageCurrency && (
                <p className="mt-1 font-bold text-orange-500">
                  {formatMoney(
                    selectedPackagePrice,
                    selectedPackageCurrency
                  )}
                </p>
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
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#020817]/75 px-4 py-8 backdrop-blur-sm">

      <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white shadow-2xl">

        <div className="flex items-start justify-between gap-5 border-b border-slate-200 p-6">

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
              Start Campaign
            </p>

            <h2 className="mt-1 text-2xl font-black text-[#071226]">
              {
                billboardName
              }
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

        <form
          onSubmit={
            handleSubmit
          }
          className="p-6"
        >

          {/* SCHEDULE */}
          <div className="rounded-2xl bg-slate-50 p-5">

            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                {isStatic &&
                hasSelectedPackage
                  ? "Package Schedule"
                  : "Requested Schedule"}
              </p>

              {isStatic &&
                hasSelectedPackage &&
                selectedPackageDurationLabel && (
                  <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-orange-700">
                    {
                      selectedPackageDurationLabel
                    } rental
                  </span>
                )}
            </div>

            <div className="mt-3 grid gap-4 sm:grid-cols-2">

              <div>
                <p className="text-xs text-slate-400">
                  Start
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  {formatScheduleDate(
                    startDate
                  )}{" "}
                  • 9:00 AM
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Changeover
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  {formatScheduleDate(
                    changeoverDate
                  )}{" "}
                  • 9:00 AM
                </p>
              </div>
            </div>

            {isStatic &&
              hasSelectedPackage && (
                <p className="mt-3 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-500">
                  The changeover date shown above is based on the selected static billboard rental package, not the shorter date range originally used to search.
                </p>
              )}
          </div>

          {/* STATIC PACKAGE REQUIRED */}
          {staticPackageRequired && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-amber-700">
                Rental Package Required
              </p>

              <p className="mt-2 font-black text-[#071226]">
                Static billboards require a 3, 6 or 12-month rental package.
              </p>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                Close this form, open the billboard details page and choose the rental package you want. The correct changeover date will then be calculated automatically.
              </p>
            </div>
          )}

          {/* SELECTED PACKAGE */}
          {hasSelectedPackage && (
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
                <p className="mt-3 border-t border-orange-100 pt-3 text-xs font-bold text-sky-700">
                  ✓ Ad creation included
                </p>
              )}
            </div>
          )}

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
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400"
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
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400"
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
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400"
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
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400"
              />
            </label>

            <label>
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
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400"
              />
            </label>

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
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400"
              />
            </label>

            {!hasSelectedPackage && (
              <label className="md:col-span-2">
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
            )}

            <label className="md:col-span-2">
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
                placeholder="e.g. Brand awareness, product launch, event promotion"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-700">
                Is your artwork ready?
              </span>

              <select
                value={
                  artworkReady
                }
                onChange={(
                  event
                ) =>
                  setArtworkReady(
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-400"
              >
                <option value="">
                  Not sure yet
                </option>

                <option value="yes">
                  Yes
                </option>

                <option value="no">
                  No
                </option>
              </select>
            </label>

            <label className="md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">
                Additional Information
              </span>

              <textarea
                rows={4}
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
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400"
              />
            </label>
          </div>

          {errorMessage && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {
                errorMessage
              }
            </div>
          )}

          <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5">

            <button
              type="button"
              onClick={
                onClose
              }
              className="rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                staticPackageRequired
              }
              className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:opacity-100"
            >
              {loading
                ? "Submitting..."
                : staticPackageRequired
                  ? "Choose Rental Package First"
                  : "Submit Campaign Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}