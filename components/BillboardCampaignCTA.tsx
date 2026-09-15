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

type DigitalAvailabilityResult = {
  billboard_id: string;
  available_standard_slots: number;
  available_premium_slots: number;
  available_shoutout_slots: number;
};

type DigitalPackageType =
  | "shoutout"
  | "standard"
  | "premium";

const DIGITAL_PACKAGE_TYPES: {
  value: DigitalPackageType;
  label: string;
  duration: string;
}[] = [
  {
    value: "shoutout",
    label: "Shoutout",
    duration: "15 sec",
  },
  {
    value: "standard",
    label: "Standard",
    duration: "10 sec",
  },
  {
    value: "premium",
    label: "Premium",
    duration: "15 sec",
  },
];

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
  switch (
    packageType.toLowerCase()
  ) {
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

function normalizedPackageType(
  adPackage: PublicAdPackage
) {
  return adPackage.package_type
    .toLowerCase()
    .trim();
}

function isAllowedDigitalPackage(
  adPackage: PublicAdPackage
) {
  const packageType =
    normalizedPackageType(
      adPackage
    );

  const unit =
    adPackage.duration_unit
      ?.toLowerCase()
      .trim() ?? "";

  const value =
    Number(
      adPackage.duration_value ??
        0
    );

  if (
    packageType ===
    "shoutout"
  ) {
    return (
      unit === "day" &&
      value === 1
    );
  }

  if (
    packageType ===
      "standard" ||
    packageType ===
      "premium"
  ) {
    return (
      (
        unit === "week" &&
        (
          value === 1 ||
          value === 4
        )
      ) ||
      (
        unit === "month" &&
        (
          value === 3 ||
          value === 6 ||
          value === 12
        )
      )
    );
  }

  return false;
}

function digitalPackageSortOrder(
  adPackage: PublicAdPackage
) {
  const packageType =
    normalizedPackageType(
      adPackage
    );

  if (
    packageType ===
    "shoutout"
  ) {
    return adPackage.includes_ad_creation
      ? 2
      : 1;
  }

  const unit =
    adPackage.duration_unit
      ?.toLowerCase()
      .trim() ?? "";

  const value =
    Number(
      adPackage.duration_value ??
        0
    );

  if (
    unit === "week" &&
    value === 1
  ) {
    return 1;
  }

  if (
    unit === "week" &&
    value === 4
  ) {
    return 2;
  }

  if (
    unit === "month" &&
    value === 3
  ) {
    return 3;
  }

  if (
    unit === "month" &&
    value === 6
  ) {
    return 4;
  }

  if (
    unit === "month" &&
    value === 12
  ) {
    return 5;
  }

  return 99;
}

function durationChoiceLabel(
  adPackage: PublicAdPackage
) {
  const packageType =
    normalizedPackageType(
      adPackage
    );

  if (
    packageType ===
    "shoutout"
  ) {
    return adPackage.includes_ad_creation
      ? "1 Day + Ad Creation"
      : "1 Day";
  }

  if (
    adPackage.duration_label
  ) {
    return adPackage.duration_label;
  }

  if (
    adPackage.duration_value &&
    adPackage.duration_unit
  ) {
    const value =
      Number(
        adPackage.duration_value
      );

    const unit =
      adPackage.duration_unit;

    return `${value} ${unit}${
      value === 1
        ? ""
        : "s"
    }`;
  }

  return adPackage.package_name;
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
      (part) =>
        part.type ===
        "year"
    )?.value;

  const month =
    parts.find(
      (part) =>
        part.type ===
        "month"
    )?.value;

  const day =
    parts.find(
      (part) =>
        part.type ===
        "day"
    )?.value;

  return `${year}-${month}-${day}`;
}

function addDays(
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

  if (
    !year ||
    !month ||
    !day
  ) {
    return "";
  }

  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day + days
      )
    );

  return [
    date.getUTCFullYear(),
    String(
      date.getUTCMonth() +
        1
    ).padStart(
      2,
      "0"
    ),
    String(
      date.getUTCDate()
    ).padStart(
      2,
      "0"
    ),
  ].join("-");
}

function nextMondayOnOrAfter(
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

  if (
    !year ||
    !month ||
    !day
  ) {
    return "";
  }

  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day
      )
    );

  const weekday =
    date.getUTCDay();

  const daysUntilMonday =
    (
      8 -
      weekday
    ) %
    7;

  return addDays(
    dateString,
    daysUntilMonday
  );
}

function digitalDurationWeeks(
  adPackage: PublicAdPackage
) {
  const unit =
    adPackage.duration_unit
      ?.toLowerCase()
      .trim() ?? "";

  const value =
    Number(
      adPackage.duration_value ??
        0
    );

  if (
    unit === "week" &&
    (
      value === 1 ||
      value === 4
    )
  ) {
    return value;
  }

  if (
    unit === "month" &&
    value === 3
  ) {
    return 13;
  }

  if (
    unit === "month" &&
    value === 6
  ) {
    return 26;
  }

  if (
    unit === "month" &&
    value === 12
  ) {
    return 52;
  }

  return 0;
}

function calculateDigitalSchedule(
  preferredStartDate: string,
  adPackage: PublicAdPackage
) {
  if (
    !preferredStartDate
  ) {
    return {
      startDate:
        "",
      changeoverDate:
        "",
    };
  }

  const packageType =
    normalizedPackageType(
      adPackage
    );

  if (
    packageType ===
    "shoutout"
  ) {
    const tomorrow =
      addDays(
        saintLuciaTodayString(),
        1
      );

    const actualStart =
      preferredStartDate <
      tomorrow
        ? tomorrow
        : preferredStartDate;

    return {
      startDate:
        actualStart,
      changeoverDate:
        addDays(
          actualStart,
          1
        ),
    };
  }

  if (
    packageType ===
      "standard" ||
    packageType ===
      "premium"
  ) {
    const actualStart =
      nextMondayOnOrAfter(
        preferredStartDate
      );

    const weeks =
      digitalDurationWeeks(
        adPackage
      );

    return {
      startDate:
        actualStart,
      changeoverDate:
        weeks > 0
          ? addDays(
              actualStart,
              weeks * 7
            )
          : "",
    };
  }

  return {
    startDate:
      preferredStartDate,
    changeoverDate:
      "",
  };
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
        timeZone:
          "UTC",
        month:
          "short",
        day:
          "numeric",
        year:
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

function typeButtonClasses(
  type: DigitalPackageType,
  selected: boolean,
  disabled: boolean
) {
  if (disabled) {
    return "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300";
  }

  if (selected) {
    switch (type) {
      case "shoutout":
        return "border-violet-400 bg-violet-50 text-violet-800 ring-2 ring-violet-100";

      case "standard":
        return "border-sky-400 bg-sky-50 text-sky-800 ring-2 ring-sky-100";

      case "premium":
        return "border-orange-400 bg-orange-50 text-orange-800 ring-2 ring-orange-100";
    }
  }

  return "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50";
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

  const isDigital =
    billboardType ===
    "digital";

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
    useState<DigitalPackageType>(
      "standard"
    );

  const [
    checkingPackageAvailability,
    setCheckingPackageAvailability,
  ] =
    useState(false);

  const [
    selectedPackageAvailable,
    setSelectedPackageAvailable,
  ] =
    useState<boolean | null>(
      null
    );

  useEffect(() => {
    let cancelled = false;

    async function loadPackages() {
      setLoadingPackages(true);
      setPackageError("");

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

      if (cancelled) {
        return;
      }

      if (error) {
        console.error(error);

        setPackageError(
          "Pricing is available on request."
        );

        setPackages([]);
        setSelectedPackageId("");
        setLoadingPackages(false);

        return;
      }

      const loadedPackages =
        (data ??
          []) as PublicAdPackage[];

      setPackages(
        loadedPackages
      );

      if (
        billboardType ===
        "digital"
      ) {
        const allowedPackages =
          loadedPackages
            .filter(
              isAllowedDigitalPackage
            )
            .sort(
              (
                a,
                b
              ) =>
                digitalPackageSortOrder(
                  a
                ) -
                digitalPackageSortOrder(
                  b
                )
            );

        const preferredType:
          DigitalPackageType =
          allowedPackages.some(
            (item) =>
              normalizedPackageType(
                item
              ) ===
              "standard"
          )
            ? "standard"
            : allowedPackages.some(
                  (item) =>
                    normalizedPackageType(
                      item
                    ) ===
                    "premium"
                )
              ? "premium"
              : "shoutout";

        setSelectedDigitalType(
          preferredType
        );

        const firstPackage =
          allowedPackages.find(
            (item) =>
              normalizedPackageType(
                item
              ) ===
              preferredType
          );

        setSelectedPackageId(
          firstPackage?.package_id ??
            ""
        );
      } else {
        setSelectedPackageId(
          loadedPackages[0]
            ?.package_id ??
            ""
        );
      }

      setLoadingPackages(false);
    }

    loadPackages();

    return () => {
      cancelled = true;
    };
  }, [
    billboardType,
    supabase,
  ]);

  const digitalPackages =
    useMemo(
      () =>
        packages.filter(
          isAllowedDigitalPackage
        ),
      [
        packages,
      ]
    );

  const selectedTypePackages =
    useMemo(
      () =>
        digitalPackages
          .filter(
            (item) =>
              normalizedPackageType(
                item
              ) ===
              selectedDigitalType
          )
          .sort(
            (
              a,
              b
            ) =>
              digitalPackageSortOrder(
                a
              ) -
              digitalPackageSortOrder(
                b
              )
          ),
      [
        digitalPackages,
        selectedDigitalType,
      ]
    );

  const selectedPackage =
    packages.find(
      (item) =>
        item.package_id ===
        selectedPackageId
    ) ?? null;

  const digitalSchedule =
    useMemo(
      () => {
        if (
          !isDigital ||
          !selectedPackage
        ) {
          return {
            startDate,
            changeoverDate,
          };
        }

        return calculateDigitalSchedule(
          startDate,
          selectedPackage
        );
      },
      [
        isDigital,
        selectedPackage,
        startDate,
        changeoverDate,
      ]
    );

  const effectiveStartDate =
    isDigital
      ? digitalSchedule.startDate
      : startDate;

  const effectiveChangeoverDate =
    isDigital
      ? digitalSchedule.changeoverDate
      : changeoverDate;

  useEffect(() => {
    let cancelled = false;

    async function checkDigitalPackageAvailability() {
      if (
        !isDigital ||
        !selectedPackage ||
        !effectiveStartDate ||
        !effectiveChangeoverDate
      ) {
        setSelectedPackageAvailable(
          null
        );
        return;
      }

      setCheckingPackageAvailability(
        true
      );

      setSelectedPackageAvailable(
        null
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
              "digital",
          }
        );

      if (
        cancelled
      ) {
        return;
      }

      setCheckingPackageAvailability(
        false
      );

      if (error) {
        console.error(
          error
        );

        setSelectedPackageAvailable(
          false
        );

        return;
      }

      const match =
        (
          (data ??
            []) as DigitalAvailabilityResult[]
        ).find(
          (item) =>
            item.billboard_id ===
            billboardId
        );

      if (!match) {
        setSelectedPackageAvailable(
          false
        );

        return;
      }

      const packageType =
        normalizedPackageType(
          selectedPackage
        );

      if (
        packageType ===
        "standard"
      ) {
        setSelectedPackageAvailable(
          match.available_standard_slots >
            0
        );
      } else if (
        packageType ===
        "premium"
      ) {
        setSelectedPackageAvailable(
          match.available_premium_slots >
            0
        );
      } else if (
        packageType ===
        "shoutout"
      ) {
        setSelectedPackageAvailable(
          match.available_shoutout_slots >
            0
        );
      } else {
        setSelectedPackageAvailable(
          false
        );
      }
    }

    checkDigitalPackageAvailability();

    return () => {
      cancelled = true;
    };
  }, [
    isDigital,
    selectedPackage,
    effectiveStartDate,
    effectiveChangeoverDate,
    billboardId,
    supabase,
  ]);

  function chooseDigitalType(
    type: DigitalPackageType
  ) {
    const typePackages =
      digitalPackages
        .filter(
          (item) =>
            normalizedPackageType(
              item
            ) ===
            type
        )
        .sort(
          (
            a,
            b
          ) =>
            digitalPackageSortOrder(
              a
            ) -
            digitalPackageSortOrder(
              b
            )
        );

    if (
      typePackages.length ===
      0
    ) {
      return;
    }

    setSelectedDigitalType(
      type
    );

    setSelectedPackageId(
      typePackages[0]
        .package_id
    );
  }

  const packagesAvailableForDisplay =
    isDigital
      ? digitalPackages.length >
        0
      : packages.length >
        0;

  return (
    <>
      <div className="mt-6 border-t border-slate-100 pt-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
          Advertising Package
        </p>

        <h3 className="mt-1 text-lg font-black text-[#071226]">
          Choose your package
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {isDigital
            ? "Choose an advertising type, then select how long you want the campaign to run."
            : "Select the advertising package that best suits your campaign."}
        </p>

        {loadingPackages ? (
          <div className="mt-4 rounded-xl bg-slate-50 px-4 py-5 text-center text-sm text-slate-400">
            Loading packages...
          </div>
        ) : packagesAvailableForDisplay ? (
          <>
            {isDigital ? (
              <>
                <div className="mt-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Advertising Type
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {DIGITAL_PACKAGE_TYPES.map(
                      (
                        item
                      ) => {
                        const hasPackages =
                          digitalPackages.some(
                            (
                              adPackage
                            ) =>
                              normalizedPackageType(
                                adPackage
                              ) ===
                              item.value
                          );

                        const selected =
                          selectedDigitalType ===
                          item.value;

                        return (
                          <button
                            key={
                              item.value
                            }
                            type="button"
                            disabled={
                              !hasPackages
                            }
                            onClick={() =>
                              chooseDigitalType(
                                item.value
                              )
                            }
                            className={`rounded-xl border px-2 py-3 text-center transition ${typeButtonClasses(
                              item.value,
                              selected,
                              !hasPackages
                            )}`}
                          >
                            <span className="block text-xs font-black sm:text-sm">
                              {
                                item.label
                              }
                            </span>

                            <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide opacity-70">
                              {
                                item.duration
                              }
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                    {selectedDigitalType ===
                    "shoutout"
                      ? "Shoutout Option"
                      : "Campaign Duration"}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {selectedTypePackages.map(
                      (
                        adPackage
                      ) => {
                        const selected =
                          adPackage.package_id ===
                          selectedPackageId;

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
                            className={`rounded-xl border px-3 py-3 text-left transition ${
                              selected
                                ? "border-orange-400 bg-orange-50 ring-2 ring-orange-100"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <span className="block text-xs font-black text-slate-900">
                              {durationChoiceLabel(
                                adPackage
                              )}
                            </span>

                            <span
                              className={`mt-1 block text-sm font-black ${
                                selected
                                  ? "text-orange-600"
                                  : "text-slate-600"
                              }`}
                            >
                              {formatMoney(
                                Number(
                                  adPackage.price
                                ),
                                adPackage.currency_code
                              )}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Package
                  </span>

                  <select
                    value={
                      selectedPackageId
                    }
                    onChange={(
                      event
                    ) =>
                      setSelectedPackageId(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  >
                    {packages.map(
                      (
                        adPackage
                      ) => (
                        <option
                          key={
                            adPackage.package_id
                          }
                          value={
                            adPackage.package_id
                          }
                        >
                          {
                            adPackage.package_name
                          }{" "}
                          —{" "}
                          {formatMoney(
                            Number(
                              adPackage.price
                            ),
                            adPackage.currency_code
                          )}
                        </option>
                      )
                    )}
                  </select>
                </label>
              </div>
            )}

            {selectedPackage && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Selected Package
                    </p>

                    <p className="mt-1 font-black text-slate-900">
                      {
                        selectedPackage.package_name
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {packageTypeLabel(
                        selectedPackage.package_type
                      )}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Price
                    </p>

                    <p className="mt-1 text-xl font-black text-orange-500">
                      {formatMoney(
                        Number(
                          selectedPackage.price
                        ),
                        selectedPackage.currency_code
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-200 pt-4">
                  <p className="text-sm font-semibold text-slate-700">
                    {packageDescription(
                      selectedPackage
                    )}
                  </p>

                  {selectedPackage.includes_ad_creation && (
                    <p className="mt-2 text-xs font-semibold text-sky-700">
                      ✓ Ad creation included
                    </p>
                  )}
                </div>
              </div>
            )}

            {isDigital &&
              selectedPackage &&
              effectiveStartDate &&
              effectiveChangeoverDate && (
                <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-sky-600">
                        Package Schedule
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {normalizedPackageType(
                          selectedPackage
                        ) ===
                        "shoutout"
                          ? "Shoutouts require at least one day of lead time."
                          : "Standard and Premium campaigns start and change over on Mondays at 9:00 AM."}
                      </p>
                    </div>

                    {checkingPackageAvailability ? (
                      <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-500">
                        CHECKING
                      </span>
                    ) : selectedPackageAvailable ===
                      true ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                        AVAILABLE
                      </span>
                    ) : selectedPackageAvailable ===
                      false ? (
                      <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold text-red-700">
                        UNAVAILABLE
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Starts
                      </p>

                      <p className="mt-1 text-sm font-black text-slate-900">
                        {formatScheduleDate(
                          effectiveStartDate
                        )}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-sky-700">
                        9:00 AM
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Changeover
                      </p>

                      <p className="mt-1 text-sm font-black text-slate-900">
                        {formatScheduleDate(
                          effectiveChangeoverDate
                        )}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-sky-700">
                        9:00 AM
                      </p>
                    </div>
                  </div>

                  {effectiveStartDate !==
                    startDate && (
                    <p className="mt-3 border-t border-sky-200 pt-3 text-xs leading-5 text-sky-800">
                      Your preferred search date was{" "}
                      <strong>
                        {formatScheduleDate(
                          startDate
                        )}
                      </strong>
                      . This package&apos;s scheduling rules move the campaign start to{" "}
                      <strong>
                        {formatScheduleDate(
                          effectiveStartDate
                        )}
                      </strong>
                      .
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

            <p className="mt-1 text-xs leading-5 text-slate-500">
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

      <button
        type="button"
        disabled={
          !effectiveStartDate ||
          !effectiveChangeoverDate ||
          (
            packagesAvailableForDisplay &&
            !selectedPackage
          ) ||
          (
            isDigital
              ? checkingPackageAvailability ||
                selectedPackageAvailable !==
                  true
              : !available
          )
        }
        onClick={() =>
          setOpen(true)
        }
        className="mt-5 w-full rounded-xl bg-orange-500 px-5 py-4 font-extrabold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isDigital &&
        checkingPackageAvailability
          ? "Checking Package Availability..."
          : isDigital &&
              selectedPackageAvailable ===
                false
            ? "Selected Package Unavailable"
            : available ||
                selectedPackageAvailable ===
                  true
              ? "Start Campaign"
              : "Currently Unavailable"}
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
