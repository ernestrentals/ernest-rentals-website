"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import StartCampaignForm from "@/components/StartCampaignForm";
import { createBrowserClient } from "@/lib/supabase/client";

type BillboardCampaignCTAProps = {
  billboardId: string;
  billboardName: string;
  billboardType: string;
  location: string | null;
  startDate: string;
  changeoverDate: string;
  available: boolean;
};

type PublicAdPackage = {
  package_id: string;
  package_code: string;
  package_name: string;
  package_type: string;
  slot_duration_seconds: number | null;
  duration_value: number | null;
  duration_unit: string | null;
  duration_label: string | null;
  price: number;
  currency_code: string;
  includes_ad_creation: boolean;
};

type StaticBillboardPackage = {
  package_id: string;
  billboard_id: string;
  package_code: string;
  package_name: string;
  duration_value: number | null;
  duration_unit: string | null;
  duration_label: string | null;
  price: number;
  currency_code: string;
};

type AvailabilityResult = {
  billboard_id: string;
  available_static_faces: number;
  available_standard_slots: number;
  available_premium_slots: number;
  available_shoutout_slots: number;
  availability_status: string;
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

function packageTypeLabel(
  packageType: string
) {
  switch (packageType.toLowerCase()) {
    case "standard":
      return "Standard";

    case "premium":
      return "Premium";

    case "shoutout":
      return "Shoutout";

    case "static":
      return "Static Billboard";

    default:
      return packageType
        .replaceAll("_", " ")
        .replace(
          /\b\w/g,
          (letter) =>
            letter.toUpperCase()
        );
  }
}

function packageDescription(
  adPackage: PublicAdPackage
) {
  const parts: string[] = [];

  if (
    adPackage.slot_duration_seconds
  ) {
    parts.push(
      `${adPackage.slot_duration_seconds}-second ad`
    );
  }

  if (
    adPackage.duration_label
  ) {
    parts.push(
      adPackage.duration_label
    );
  } else if (
    adPackage.duration_value &&
    adPackage.duration_unit
  ) {
    parts.push(
      `${adPackage.duration_value} ${adPackage.duration_unit}${
        adPackage.duration_value === 1
          ? ""
          : "s"
      }`
    );
  }

  return (
    parts.join(" · ") ||
    "Campaign package"
  );
}


function padDatePart(
  value: number
) {
  return String(
    value
  ).padStart(
    2,
    "0"
  );
}

function formatDateKey(
  date: Date
) {
  return `${date.getUTCFullYear()}-${padDatePart(
    date.getUTCMonth() + 1
  )}-${padDatePart(
    date.getUTCDate()
  )}`;
}

function addDaysToDate(
  dateString: string,
  days: number
) {
  const [
    year,
    month,
    day,
  ] =
    dateString
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

  return formatDateKey(
    date
  );
}

function addMonthsToDate(
  dateString: string,
  months: number
) {
  const [
    year,
    month,
    day,
  ] =
    dateString
      .split("-")
      .map(Number);

  const targetMonthIndex =
    month - 1 + months;

  const targetYear =
    year +
    Math.floor(
      targetMonthIndex /
        12
    );

  const normalizedMonth =
    (
      (
        targetMonthIndex %
        12
      ) +
      12
    ) %
    12;

  const lastDay =
    new Date(
      Date.UTC(
        targetYear,
        normalizedMonth +
          1,
        0
      )
    ).getUTCDate();

  const date =
    new Date(
      Date.UTC(
        targetYear,
        normalizedMonth,
        Math.min(
          day,
          lastDay
        )
      )
    );

  return formatDateKey(
    date
  );
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

function weekdayForDate(
  dateString: string
) {
  const [
    year,
    month,
    day,
  ] =
    dateString
      .split("-")
      .map(Number);

  return new Date(
    Date.UTC(
      year,
      month - 1,
      day
    )
  ).getUTCDay();
}

function mondayOnOrAfter(
  dateString: string
) {
  const weekday =
    weekdayForDate(
      dateString
    );

  const daysUntilMonday =
    (
      8 -
      weekday
    ) %
    7;

  return addDaysToDate(
    dateString,
    daysUntilMonday
  );
}

function digitalPackageStartDate(
  requestedStartDate: string,
  adPackage:
    | PublicAdPackage
    | null
) {
  if (
    !requestedStartDate ||
    !adPackage
  ) {
    return requestedStartDate;
  }

  const packageType =
    adPackage.package_type
      .toLowerCase()
      .trim();

  const today =
    saintLuciaTodayString();

  const tomorrow =
    addDaysToDate(
      today,
      1
    );

  const earliestCandidate =
    requestedStartDate >
    tomorrow
      ? requestedStartDate
      : tomorrow;

  if (
    packageType ===
    "shoutout"
  ) {
    return earliestCandidate;
  }

  if (
    packageType ===
      "standard" ||
    packageType ===
      "premium"
  ) {
    return mondayOnOrAfter(
      earliestCandidate
    );
  }

  return requestedStartDate;
}

function packageChangeoverDate(
  startDate: string,
  adPackage:
    | PublicAdPackage
    | null,
  fallbackChangeoverDate: string
) {
  if (
    !startDate ||
    !adPackage?.duration_value ||
    !adPackage.duration_unit
  ) {
    return fallbackChangeoverDate;
  }

  const value =
    Number(
      adPackage.duration_value
    );

  const unit =
    adPackage.duration_unit
      .toLowerCase()
      .trim();

  if (
    unit === "day" ||
    unit === "days"
  ) {
    return addDaysToDate(
      startDate,
      value
    );
  }

  if (
    unit === "week" ||
    unit === "weeks"
  ) {
    return addDaysToDate(
      startDate,
      value * 7
    );
  }

  if (
    unit === "month" ||
    unit === "months"
  ) {
    return addMonthsToDate(
      startDate,
      value
    );
  }

  if (
    unit === "year" ||
    unit === "years"
  ) {
    return addMonthsToDate(
      startDate,
      value * 12
    );
  }

  return fallbackChangeoverDate;
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

export default function BillboardCampaignCTA({
  billboardId,
  billboardName,
  billboardType,
  location,
  startDate,
  changeoverDate,
  available,
}: BillboardCampaignCTAProps) {
  const supabase =
    useMemo(
      () =>
        createBrowserClient(),
      []
    );

  const [
    open,
    setOpen,
  ] =
    useState(false);

  const [
    packages,
    setPackages,
  ] =
    useState<
      PublicAdPackage[]
    >([]);

  const [
    loadingPackages,
    setLoadingPackages,
  ] =
    useState(true);

  const [
    packageError,
    setPackageError,
  ] =
    useState("");

  const [
    selectedPackageId,
    setSelectedPackageId,
  ] =
    useState("");

  const [
    selectedDigitalType,
    setSelectedDigitalType,
  ] =
    useState<
      "standard" |
      "premium" |
      "shoutout"
    >(
      "standard"
    );

  const [
    checkingPackageAvailability,
    setCheckingPackageAvailability,
  ] =
    useState(false);

  const [
    packageAvailable,
    setPackageAvailable,
  ] =
    useState<boolean | null>(
      null
    );

  useEffect(() => {
    let cancelled = false;

    async function loadPackages() {
      setLoadingPackages(
        true
      );

      setPackageError(
        ""
      );

      setSelectedPackageId(
        ""
      );

      /*
        STATIC BILLBOARDS

        Static package prices are tied to a specific billboard,
        so only packages belonging to the billboard currently
        being viewed should appear in the dropdown.
      */

      if (
        billboardType ===
        "static"
      ) {
        const {
          data,
          error,
        } =
          await supabase.rpc(
            "get_public_static_billboard_packages"
          );

        if (
          cancelled
        ) {
          return;
        }

        if (
          error
        ) {
          console.error(
            error
          );

          setPackageError(
            "Pricing is available on request."
          );

          setPackages(
            []
          );

          setLoadingPackages(
            false
          );

          return;
        }

        const staticPackages =
          (
            data ??
            []
          ) as StaticBillboardPackage[];

        const matchingPackages =
          staticPackages
            .filter(
              (
                item
              ) =>
                item.billboard_id ===
                billboardId
            )
            .map(
              (
                item
              ): PublicAdPackage => ({
                package_id:
                  item.package_id,

                package_code:
                  item.package_code,

                package_name:
                  item.package_name,

                package_type:
                  "static",

                slot_duration_seconds:
                  null,

                duration_value:
                  item.duration_value,

                duration_unit:
                  item.duration_unit,

                duration_label:
                  item.duration_label,

                price:
                  Number(
                    item.price
                  ),

                currency_code:
                  item.currency_code,

                includes_ad_creation:
                  false,
              })
            );

        setPackages(
          matchingPackages
        );

        if (
          matchingPackages.length >
          0
        ) {
          setSelectedPackageId(
            matchingPackages[0]
              .package_id
          );
        }

        setLoadingPackages(
          false
        );

        return;
      }

      /*
        DIGITAL BILLBOARDS

        Digital packages are shared by billboard type/category,
        so the existing public package RPC remains appropriate.
      */

      const {
        data,
        error,
      } =
        await supabase.rpc(
          "get_public_ad_packages",
          {
            p_billboard_type:
              billboardType,
          }
        );

      if (
        cancelled
      ) {
        return;
      }

      if (
        error
      ) {
        console.error(
          error
        );

        setPackageError(
          "Pricing is available on request."
        );

        setPackages(
          []
        );

        setLoadingPackages(
          false
        );

        return;
      }

      const loadedPackages =
        (
          data ??
          []
        ) as PublicAdPackage[];

      setPackages(
        loadedPackages
      );

      if (
        loadedPackages.length >
        0
      ) {
        const preferredPackage =
          loadedPackages.find(
            (
              item
            ) =>
              item.package_type
                .toLowerCase()
                .trim() ===
              "standard"
          ) ??
          loadedPackages[0];

        const preferredType =
          preferredPackage.package_type
            .toLowerCase()
            .trim();

        if (
          preferredType ===
            "standard" ||
          preferredType ===
            "premium" ||
          preferredType ===
            "shoutout"
        ) {
          setSelectedDigitalType(
            preferredType
          );
        }

        setSelectedPackageId(
          preferredPackage.package_id
        );
      }

      setLoadingPackages(
        false
      );
    }

    loadPackages();

    return () => {
      cancelled =
        true;
    };
  }, [
    billboardId,
    billboardType,
    supabase,
  ]);

  const digitalPackages =
    billboardType ===
      "digital"
      ? packages.filter(
          (
            item
          ) =>
            item.package_type
              .toLowerCase()
              .trim() ===
            selectedDigitalType
        )
      : [];

  useEffect(() => {
    if (
      billboardType !==
        "digital" ||
      packages.length ===
        0
    ) {
      return;
    }

    const current =
      packages.find(
        (
          item
        ) =>
          item.package_id ===
          selectedPackageId
      );

    if (
      current &&
      current.package_type
        .toLowerCase()
        .trim() ===
        selectedDigitalType
    ) {
      return;
    }

    const firstForType =
      packages.find(
        (
          item
        ) =>
          item.package_type
            .toLowerCase()
            .trim() ===
          selectedDigitalType
      );

    if (
      firstForType
    ) {
      setSelectedPackageId(
        firstForType.package_id
      );
    }
  }, [
    billboardType,
    packages,
    selectedDigitalType,
    selectedPackageId,
  ]);

  const selectedPackage =
    packages.find(
      (item) =>
        item.package_id ===
        selectedPackageId
    ) ?? null;

  const effectiveStartDate =
    billboardType ===
      "digital"
      ? digitalPackageStartDate(
          startDate,
          selectedPackage
        )
      : startDate;

  const effectiveChangeoverDate =
    packageChangeoverDate(
      effectiveStartDate,
      selectedPackage,
      changeoverDate
    );

  const startChangedByPackageRule =
    Boolean(
      selectedPackage &&
      effectiveStartDate &&
      effectiveStartDate !==
        startDate
    );

  const scheduleChangedByPackage =
    Boolean(
      selectedPackage &&
      effectiveChangeoverDate &&
      effectiveChangeoverDate !==
        changeoverDate
    );

  useEffect(() => {
    let cancelled =
      false;

    async function checkPackageAvailability() {
      if (
        !selectedPackage ||
        !effectiveStartDate ||
        !effectiveChangeoverDate ||
        effectiveChangeoverDate <=
          effectiveStartDate
      ) {
        setPackageAvailable(
          null
        );

        return;
      }

      setCheckingPackageAvailability(
        true
      );

      const {
        data,
        error,
      } =
        await supabase.rpc(
          "search_public_billboard_availability",
          {
            p_start_date:
              effectiveStartDate,

            p_end_date:
              effectiveChangeoverDate,

            p_location:
              null,

            p_billboard_type:
              billboardType,
          }
        );

      if (
        cancelled
      ) {
        return;
      }

      if (
        error
      ) {
        console.error(
          error
        );

        setPackageAvailable(
          false
        );

        setCheckingPackageAvailability(
          false
        );

        return;
      }

      const match =
        (
          data ??
          []
        ).find(
          (
            item: AvailabilityResult
          ) =>
            item.billboard_id ===
            billboardId
        ) as
          | AvailabilityResult
          | undefined;

      if (
        !match
      ) {
        setPackageAvailable(
          false
        );

        setCheckingPackageAvailability(
          false
        );

        return;
      }

      let inventoryAvailable =
        false;

      if (
        billboardType ===
        "static"
      ) {
        inventoryAvailable =
          Number(
            match.available_static_faces ??
              0
          ) >
          0;
      } else {
        switch (
          selectedPackage.package_type
            .toLowerCase()
            .trim()
        ) {
          case "premium":
            inventoryAvailable =
              Number(
                match.available_premium_slots ??
                  0
              ) >
              0;
            break;

          case "shoutout":
            inventoryAvailable =
              Number(
                match.available_shoutout_slots ??
                  0
              ) >
              0;
            break;

          case "standard":
          default:
            inventoryAvailable =
              Number(
                match.available_standard_slots ??
                  0
              ) >
              0;
            break;
        }
      }

      setPackageAvailable(
        match.availability_status ===
          "available" &&
          inventoryAvailable
      );

      setCheckingPackageAvailability(
        false
      );
    }

    checkPackageAvailability();

    return () => {
      cancelled =
        true;
    };
  }, [
    billboardId,
    billboardType,
    effectiveChangeoverDate,
    effectiveStartDate,
    selectedPackage,
    supabase,
  ]);

  const canStartCampaign =
    Boolean(
      selectedPackage &&
      effectiveStartDate &&
      effectiveChangeoverDate &&
      effectiveChangeoverDate >
        effectiveStartDate &&
      packageAvailable ===
        true &&
      !checkingPackageAvailability
    );

  return (
    <>
      {/* PACKAGE SELECTOR */}
      <div className="mt-5 border-t border-slate-100 pt-5">

        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
          Advertising Package
        </p>

        <h3 className="mt-1 text-base font-black text-[#071226]">
          Choose your package
        </h3>

        <p className="mt-1 text-[11px] leading-4 text-slate-500">
          {billboardType ===
          "static"
            ? `Showing packages for ${billboardName} only.`
            : "Select the advertising package that best suits your campaign."}
        </p>

        {loadingPackages ? (
          <div className="mt-4 space-y-3">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="h-[108px] animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
                />
              )
            )}
          </div>
        ) : packages.length > 0 ? (
          <>
            {billboardType ===
            "digital" ? (
              <>
                {/* DIGITAL PACKAGE TYPE */}
                <div className="mt-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                        Step 1
                      </p>

                      <p className="mt-0.5 text-sm font-black text-slate-900">
                        Choose ad type
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                      Digital
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {(
                      [
                        {
                          key:
                            "standard",
                          label:
                            "Standard",
                          duration:
                            "10 sec",
                          helper:
                            "Best value",
                          badgeClass:
                            "bg-sky-50 text-sky-700",
                          iconClass:
                            "bg-sky-100 text-sky-700",
                        },
                        {
                          key:
                            "premium",
                          label:
                            "Premium",
                          duration:
                            "15 sec",
                          helper:
                            "More exposure",
                          badgeClass:
                            "bg-orange-50 text-orange-700",
                          iconClass:
                            "bg-orange-100 text-orange-700",
                        },
                        {
                          key:
                            "shoutout",
                          label:
                            "Shoutout",
                          duration:
                            "15 sec",
                          helper:
                            "1-day feature",
                          badgeClass:
                            "bg-violet-50 text-violet-700",
                          iconClass:
                            "bg-violet-100 text-violet-700",
                        },
                      ] as const
                    ).map(
                      (
                        option
                      ) => {
                        const hasPackages =
                          packages.some(
                            (
                              item
                            ) =>
                              item.package_type
                                .toLowerCase()
                                .trim() ===
                              option.key
                          );

                        const selected =
                          selectedDigitalType ===
                          option.key;

                        return (
                          <button
                            key={
                              option.key
                            }
                            type="button"
                            disabled={
                              !hasPackages
                            }
                            onClick={() =>
                              setSelectedDigitalType(
                                option.key
                              )
                            }
                            className={`relative overflow-hidden rounded-2xl border px-2.5 py-3.5 text-center transition-all ${
                              selected
                                ? "border-orange-400 bg-white shadow-md ring-2 ring-orange-100"
                                : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                            } disabled:cursor-not-allowed disabled:opacity-40`}
                          >
                            {selected && (
                              <span className="absolute inset-x-0 top-0 h-1 bg-orange-500" />
                            )}

                            <div
                              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-xl text-[10px] font-black ${option.iconClass}`}
                            >
                              {option.duration.replace(
                                " sec",
                                "s"
                              )}
                            </div>

                            <p className="mt-2 text-[11px] font-black text-slate-900">
                              {
                                option.label
                              }
                            </p>

                            <p className="mt-0.5 text-[9px] font-semibold leading-4 text-slate-400">
                              {
                                option.helper
                              }
                            </p>

                            <div className="mt-2 flex justify-center">
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide ${option.badgeClass}`}
                              >
                                {
                                  option.duration
                                }
                              </span>
                            </div>

                            {selected && (
                              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm">
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  className="h-3 w-3"
                                  aria-hidden="true"
                                >
                                  <path d="m5 12 4 4L19 6" />
                                </svg>
                              </span>
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* DIGITAL DURATION */}
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                        Step 2
                      </p>

                      <p className="mt-0.5 text-sm font-black text-slate-900">
                        Choose duration
                      </p>
                    </div>

                    <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-bold text-orange-700">
                      {digitalPackages.length} option
                      {digitalPackages.length ===
                      1
                        ? ""
                        : "s"}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2">
                    {digitalPackages.map(
                      (
                        adPackage
                      ) => {
                        const selected =
                          adPackage.package_id ===
                          selectedPackageId;

                        const durationText =
                          adPackage.duration_label ||
                          (
                            adPackage.duration_value &&
                            adPackage.duration_unit
                              ? `${adPackage.duration_value} ${adPackage.duration_unit}${
                                  adPackage.duration_value ===
                                  1
                                    ? ""
                                    : "s"
                                }`
                              : "Campaign"
                          );

                        return (
                          <button
                            key={
                              adPackage.package_id
                            }
                            type="button"
                            onClick={() =>
                              setSelectedPackageId(
                                adPackage.package_id
                              )
                            }
                            className={`group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all ${
                              selected
                                ? "border-orange-400 bg-orange-50/50 shadow-sm ring-2 ring-orange-100"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                            }`}
                          >
                            {selected && (
                              <span className="absolute inset-y-0 left-0 w-1 bg-orange-500" />
                            )}

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-black text-slate-900">
                                  {
                                    durationText
                                  }
                                </p>

                                {adPackage.includes_ad_creation && (
                                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-violet-700">
                                    Ad Creation
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 text-[10px] font-medium text-slate-400">
                                {selected
                                  ? "Selected package"
                                  : "Tap to select"}
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-3">
                              <p className="text-base font-black text-orange-500">
                                {formatMoney(
                                  Number(
                                    adPackage.price
                                  ),
                                  adPackage.currency_code
                                )}
                              </p>

                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
                                  selected
                                    ? "border-orange-500 bg-orange-500 text-white"
                                    : "border-slate-300 bg-white text-transparent group-hover:border-orange-300"
                                }`}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  className="h-3.5 w-3.5"
                                  aria-hidden="true"
                                >
                                  <path d="m5 12 4 4L19 6" />
                                </svg>
                              </div>
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-4 space-y-2">
                {packages.map(
                  (
                    adPackage
                  ) => {
                    const selected =
                      adPackage.package_id ===
                      selectedPackageId;

                    const durationText =
                      adPackage.duration_label ||
                      (
                        adPackage.duration_value &&
                        adPackage.duration_unit
                          ? `${adPackage.duration_value} ${adPackage.duration_unit}${
                              adPackage.duration_value ===
                              1
                                ? ""
                                : "s"
                            }`
                          : null
                      );

                    const cleanName =
                      adPackage.package_name
                        .toLowerCase()
                        .startsWith(
                          billboardName.toLowerCase()
                        )
                        ? adPackage.package_name
                            .slice(
                              billboardName.length
                            )
                            .replace(
                              /^\s*[-–—]\s*/,
                              ""
                            )
                        : adPackage.package_name;

                    return (
                      <button
                        key={
                          adPackage.package_id
                        }
                        type="button"
                        onClick={() =>
                          setSelectedPackageId(
                            adPackage.package_id
                          )
                        }
                        aria-pressed={
                          selected
                        }
                        className={`group w-full rounded-xl border px-3.5 py-3 text-left transition ${
                          selected
                            ? "border-orange-400 bg-orange-50/60 shadow-sm ring-2 ring-orange-100"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-extrabold leading-5 text-slate-900">
                              {cleanName}
                            </p>

                            {durationText && (
                              <p className="mt-1 text-xs font-semibold text-slate-500">
                                {
                                  durationText
                                }
                              </p>
                            )}
                          </div>

                          <div className="shrink-0 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <p className="text-base font-black text-orange-500">
                                {formatMoney(
                                  Number(
                                    adPackage.price
                                  ),
                                  adPackage.currency_code
                                )}
                              </p>

                              <div
                                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                  selected
                                    ? "border-orange-500 bg-orange-500 text-white"
                                    : "border-slate-300 bg-white text-transparent"
                                }`}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  className="h-3 w-3"
                                  aria-hidden="true"
                                >
                                  <path d="m5 12 4 4L19 6" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            )}

            {selectedPackage && (
              <div className="mt-3 rounded-xl bg-[#071226] px-3.5 py-3 text-white shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-orange-400">
                      Your Selection
                    </p>

                    <p className="mt-1 font-black leading-5">
                      {
                        selectedPackage.package_name
                      }
                    </p>

                    <p className="mt-2 text-xs text-slate-300">
                      {packageDescription(
                        selectedPackage
                      )}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Price
                    </p>

                    <p className="mt-1 text-lg font-black text-orange-400">
                      {formatMoney(
                        Number(
                          selectedPackage.price
                        ),
                        selectedPackage.currency_code
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedPackage &&
              effectiveStartDate &&
              effectiveChangeoverDate && (
              <div className="mt-2.5 rounded-xl border border-sky-200 bg-sky-50/70 px-3.5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-sky-700">
                    Package Schedule
                  </p>

                  {checkingPackageAvailability ? (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Checking availability...
                    </span>
                  ) : packageAvailable ===
                    true ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                      Available
                    </span>
                  ) : packageAvailable ===
                    false ? (
                    <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-red-700">
                      Unavailable
                    </span>
                  ) : null}
                </div>

                <div className="mt-2.5 grid grid-cols-[1fr_auto_1fr] items-center gap-2.5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Start
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-900">
                      {formatScheduleDate(
                        effectiveStartDate
                      )}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-500">
                      9:00 AM
                    </p>
                  </div>

                  <div className="text-sky-400">
                    →
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Changeover
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-900">
                      {formatScheduleDate(
                        effectiveChangeoverDate
                      )}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-500">
                      9:00 AM
                    </p>
                  </div>
                </div>

                {billboardType ===
                  "digital" && (
                  <p className="mt-2.5 border-t border-sky-100 pt-2.5 text-[11px] leading-4 text-sky-800">
                    {selectedPackage.package_type
                      .toLowerCase()
                      .trim() ===
                    "shoutout"
                      ? "Shoutout campaigns can begin from the next day at 9:00 AM."
                      : "Standard and Premium campaigns start on Mondays at 9:00 AM."}
                  </p>
                )}

                {startChangedByPackageRule && (
                  <p className="mt-2 text-[11px] leading-4 text-sky-800">
                    Your start date was adjusted automatically to{" "}
                    <strong>
                      {formatScheduleDate(
                        effectiveStartDate
                      )}
                    </strong>
                    .
                  </p>
                )}

                {scheduleChangedByPackage && (
                  <p className="mt-2 text-[11px] leading-4 text-sky-800">
                    The changeover date was updated automatically to match the selected{" "}
                    <strong>
                      {selectedPackage.duration_label ||
                        packageDescription(
                          selectedPackage
                        )}
                    </strong>{" "}
                    package.
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">
              Pricing available on request
            </p>

            <p className="mt-1 text-[11px] leading-4 text-slate-500">
              Submit a campaign request and Ernest Rentals will provide pricing for this billboard.
            </p>
          </div>
        )}

        {packageError && (
          <p className="mt-3 text-xs text-slate-400">
            {packageError}
          </p>
        )}
      </div>

      {/* CTA */}
      <button
        type="button"
        disabled={
          !canStartCampaign
        }
        onClick={() =>
          setOpen(true)
        }
        className="mt-4 w-full rounded-xl bg-orange-500 px-5 py-3.5 font-extrabold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {checkingPackageAvailability
          ? "Checking Package Availability..."
          : packageAvailable ===
              false
            ? "Package Unavailable for These Dates"
            : "Start Campaign"}
      </button>

      {!startDate ||
      !changeoverDate ? (
        <p className="mt-3 text-center text-xs text-slate-400">
          Choose campaign dates from the homepage first.
        </p>
      ) : null}

      {open && (
        <StartCampaignForm
          billboardId={
            billboardId
          }
          billboardName={
            billboardName
          }
          billboardType={
            billboardType
          }
          location={
            location
          }
          startDate={
            effectiveStartDate
          }
          changeoverDate={
            effectiveChangeoverDate
          }

          selectedPackageId={
            selectedPackage?.package_id ??
            null
          }

          selectedPackageName={
            selectedPackage?.package_name ??
            null
          }

          selectedPackageCode={
            selectedPackage?.package_code ??
            null
          }

          selectedPackageType={
            selectedPackage?.package_type ??
            null
          }

          selectedPackagePrice={
            selectedPackage
              ? Number(
                  selectedPackage.price
                )
              : null
          }

          selectedPackageCurrency={
            selectedPackage?.currency_code ??
            null
          }

          selectedPackageDurationLabel={
            selectedPackage?.duration_label ??
            null
          }

          selectedPackageSlotDuration={
            selectedPackage?.slot_duration_seconds ??
            null
          }

          selectedPackageIncludesAdCreation={
            selectedPackage?.includes_ad_creation ??
            false
          }

          onClose={() =>
            setOpen(false)
          }
        />
      )}
    </>
  );
}
