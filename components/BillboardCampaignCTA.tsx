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
  billboard_id: string | null;
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

type StaticPackageRpcRow = {
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
  billboard_type: string;
  available_static_faces: number;
  availability_status: string;
};

type AvailabilityState =
  | "idle"
  | "checking"
  | "available"
  | "unavailable"
  | "error";

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

function calculatePackageChangeoverDate(
  startDate: string,
  adPackage: PublicAdPackage | null
) {
  if (
    !startDate ||
    !adPackage?.duration_value ||
    !adPackage.duration_unit
  ) {
    return "";
  }

  const [
    year,
    month,
    day,
  ] =
    startDate
      .split("-")
      .map(Number);

  if (
    !year ||
    !month ||
    !day
  ) {
    return "";
  }

  const duration =
    adPackage.duration_value;

  let result: Date;

  if (
    adPackage.duration_unit ===
    "day"
  ) {
    result =
      new Date(
        Date.UTC(
          year,
          month - 1,
          day + duration
        )
      );
  } else if (
    adPackage.duration_unit ===
    "week"
  ) {
    result =
      new Date(
        Date.UTC(
          year,
          month - 1,
          day +
            duration *
              7
        )
      );
  } else if (
    adPackage.duration_unit ===
    "month"
  ) {
    const targetMonthIndex =
      month -
      1 +
      duration;

    const targetYear =
      year +
      Math.floor(
        targetMonthIndex /
          12
      );

    const normalizedMonth =
      ((targetMonthIndex %
        12) +
        12) %
      12;

    const daysInTargetMonth =
      new Date(
        Date.UTC(
          targetYear,
          normalizedMonth +
            1,
          0
        )
      ).getUTCDate();

    const targetDay =
      Math.min(
        day,
        daysInTargetMonth
      );

    result =
      new Date(
        Date.UTC(
          targetYear,
          normalizedMonth,
          targetDay
        )
      );
  } else {
    return "";
  }

  return [
    result.getUTCFullYear(),

    String(
      result.getUTCMonth() +
        1
    ).padStart(
      2,
      "0"
    ),

    String(
      result.getUTCDate()
    ).padStart(
      2,
      "0"
    ),
  ].join("-");
}

function getMinimumRentalLabel(
  packages: PublicAdPackage[]
) {
  const packageWithShortestDuration =
    [...packages]
      .filter(
        (item) =>
          Boolean(
            item.duration_value
          ) &&
          Boolean(
            item.duration_unit
          )
      )
      .sort(
        (
          a,
          b
        ) => {
          const unitWeight = (
            item: PublicAdPackage
          ) => {
            if (
              item.duration_unit ===
              "day"
            ) {
              return Number(
                item.duration_value
              );
            }

            if (
              item.duration_unit ===
              "week"
            ) {
              return (
                Number(
                  item.duration_value
                ) *
                7
              );
            }

            return (
              Number(
                item.duration_value
              ) *
              30
            );
          };

          return (
            unitWeight(
              a
            ) -
            unitWeight(
              b
            )
          );
        }
      )[0];

  if (
    !packageWithShortestDuration
  ) {
    return "";
  }

  return (
    packageWithShortestDuration.duration_label ||
    `${packageWithShortestDuration.duration_value} ${packageWithShortestDuration.duration_unit}${
      packageWithShortestDuration.duration_value ===
      1
        ? ""
        : "s"
    }`
  );
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

  const isStatic =
    billboardType ===
    "static";

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
    staticAvailabilityState,
    setStaticAvailabilityState,
  ] =
    useState<AvailabilityState>(
      "idle"
    );

  useEffect(() => {
    let cancelled = false;

    async function loadPackages() {
      setLoadingPackages(true);
      setPackageError("");
      setSelectedPackageId("");

      if (
        isStatic
      ) {
        const {
          data,
          error,
        } =
          await supabase.rpc(
            "get_public_static_billboard_packages"
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
          setLoadingPackages(false);

          return;
        }

        const rows =
          (data ??
            []) as StaticPackageRpcRow[];

        /*
          IMPORTANT:
          Static packages are billboard-specific.

          This prevents a Mamiku billboard from
          accidentally showing Dennery or Praslin
          pricing.
        */

        const loadedPackages:
          PublicAdPackage[] =
          rows
            .filter(
              (row) =>
                row.billboard_id ===
                billboardId
            )
            .map(
              (row) => ({
                package_id:
                  row.package_id,

                billboard_id:
                  row.billboard_id,

                package_code:
                  row.package_code,

                package_name:
                  row.package_name,

                package_type:
                  "static",

                slot_duration_seconds:
                  null,

                duration_value:
                  row.duration_value,

                duration_unit:
                  row.duration_unit,

                duration_label:
                  row.duration_label,

                price:
                  Number(
                    row.price
                  ),

                currency_code:
                  row.currency_code,

                includes_ad_creation:
                  false,
              })
            )
            .sort(
              (
                a,
                b
              ) =>
                Number(
                  a.duration_value ??
                    0
                ) -
                Number(
                  b.duration_value ??
                    0
                )
            );

        setPackages(
          loadedPackages
        );

        if (
          loadedPackages.length >
          0
        ) {
          setSelectedPackageId(
            loadedPackages[0]
              .package_id
          );
        }

        setLoadingPackages(false);

        return;
      }

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
        setLoadingPackages(false);

        return;
      }

      const loadedPackages =
        (
          (data ??
            []) as Omit<
            PublicAdPackage,
            "billboard_id"
          >[]
        ).map(
          (item) => ({
            ...item,
            billboard_id:
              null,
          })
        );

      setPackages(
        loadedPackages
      );

      if (
        loadedPackages.length >
        0
      ) {
        setSelectedPackageId(
          loadedPackages[0]
            .package_id
        );
      }

      setLoadingPackages(false);
    }

    loadPackages();

    return () => {
      cancelled = true;
    };
  }, [
    billboardId,
    billboardType,
    isStatic,
    supabase,
  ]);

  const selectedPackage =
    packages.find(
      (item) =>
        item.package_id ===
        selectedPackageId
    ) ?? null;

  const packageChangeoverDate =
    useMemo(
      () =>
        isStatic
          ? calculatePackageChangeoverDate(
              startDate,
              selectedPackage
            )
          : changeoverDate,
      [
        changeoverDate,
        isStatic,
        selectedPackage,
        startDate,
      ]
    );

  const minimumRentalLabel =
    useMemo(
      () =>
        getMinimumRentalLabel(
          packages
        ),
      [
        packages,
      ]
    );

  /*
    For static billboards, the selected package
    determines the real booking period.

    We therefore re-check availability against the
    package-adjusted changeover date instead of the
    shorter date range the customer originally used
    to search the website.
  */

  useEffect(() => {
    let cancelled = false;

    async function checkStaticPackageAvailability() {
      if (
        !isStatic
      ) {
        setStaticAvailabilityState(
          "idle"
        );
        return;
      }

      if (
        !startDate ||
        !packageChangeoverDate ||
        !selectedPackage
      ) {
        setStaticAvailabilityState(
          "idle"
        );
        return;
      }

      setStaticAvailabilityState(
        "checking"
      );

      const {
        data,
        error,
      } =
        await supabase.rpc(
          "search_public_billboard_availability",
          {
            p_start_date:
              startDate,

            p_end_date:
              packageChangeoverDate,

            p_location:
              null,

            p_billboard_type:
              "static",
          }
        );

      if (cancelled) {
        return;
      }

      if (error) {
        console.error(
          "Unable to verify static package availability:",
          error
        );

        setStaticAvailabilityState(
          "error"
        );

        return;
      }

      const matchingBillboard =
        (
          (data ??
            []) as AvailabilityResult[]
        ).find(
          (item) =>
            item.billboard_id ===
            billboardId
        );

      if (
        matchingBillboard &&
        matchingBillboard.available_static_faces >
          0 &&
        matchingBillboard.availability_status ===
          "available"
      ) {
        setStaticAvailabilityState(
          "available"
        );
      } else {
        setStaticAvailabilityState(
          "unavailable"
        );
      }
    }

    checkStaticPackageAvailability();

    return () => {
      cancelled = true;
    };
  }, [
    billboardId,
    isStatic,
    packageChangeoverDate,
    selectedPackage,
    startDate,
    supabase,
  ]);

  const effectiveAvailable =
    isStatic
      ? staticAvailabilityState ===
        "available"
      : available;

  const availabilityChecking =
    isStatic &&
    staticAvailabilityState ===
      "checking";

  const packagePeriodDiffersFromSearch =
    isStatic &&
    Boolean(
      changeoverDate
    ) &&
    Boolean(
      packageChangeoverDate
    ) &&
    changeoverDate !==
      packageChangeoverDate;

  return (
    <>
      {/* STATIC RENTAL REQUIREMENT */}
      {isStatic &&
        packages.length >
          0 && (
          <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-orange-500">
              Static Billboard Rental
            </p>

            <p className="mt-2 font-black text-[#071226]">
              Minimum rental:{" "}
              {minimumRentalLabel ||
                "Package period"}
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-600">
              Static billboards are rented in fixed package periods. Choose a package below and the changeover date will be calculated automatically from your requested start date.
            </p>
          </div>
        )}

      {/* PACKAGE SELECTOR */}
      <div className="mt-6 border-t border-slate-100 pt-6">

        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
          Advertising Package
        </p>

        <h3 className="mt-1 text-lg font-black text-[#071226]">
          Choose your package
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {isStatic
            ? "Select the rental period that best suits your campaign."
            : "Select the advertising package that best suits your campaign."}
        </p>

        {loadingPackages ? (
          <div className="mt-4 rounded-xl bg-slate-50 px-4 py-5 text-center text-sm text-slate-400">
            Loading packages...
          </div>
        ) : packages.length > 0 ? (
          <>
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

            {/* STATIC PACKAGE SCHEDULE */}
            {isStatic &&
              selectedPackage &&
              startDate &&
              packageChangeoverDate && (
                <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4">

                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">
                    Package Schedule
                  </p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-[11px] font-bold uppercase text-slate-400">
                        Starts
                      </p>

                      <p className="mt-1 font-black text-[#071226]">
                        {formatScheduleDate(
                          startDate
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        9:00 AM
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-[11px] font-bold uppercase text-slate-400">
                        Changeover
                      </p>

                      <p className="mt-1 font-black text-[#071226]">
                        {formatScheduleDate(
                          packageChangeoverDate
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        9:00 AM
                      </p>
                    </div>
                  </div>

                  {packagePeriodDiffersFromSearch && (
                    <p className="mt-3 text-xs leading-5 text-blue-700">
                      Your original search ended on{" "}
                      <strong>
                        {formatScheduleDate(
                          changeoverDate
                        )}
                      </strong>
                      . Static billboard rentals use the selected package period, so this package runs until{" "}
                      <strong>
                        {formatScheduleDate(
                          packageChangeoverDate
                        )}
                      </strong>
                      .
                    </p>
                  )}
                </div>
              )}

            {/* STATIC PACKAGE AVAILABILITY */}
            {isStatic &&
              selectedPackage &&
              startDate &&
              packageChangeoverDate && (
                <div
                  className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                    availabilityChecking
                      ? "border-slate-200 bg-slate-50 text-slate-600"
                      : staticAvailabilityState ===
                          "available"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : staticAvailabilityState ===
                            "unavailable"
                          ? "border-amber-200 bg-amber-50 text-amber-800"
                          : staticAvailabilityState ===
                              "error"
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {availabilityChecking && (
                    <span className="font-semibold">
                      Checking availability for the full{" "}
                      {selectedPackage.duration_label ||
                        "package"}{" "}
                      rental period...
                    </span>
                  )}

                  {staticAvailabilityState ===
                    "available" && (
                    <span className="font-semibold">
                      ✓ Available for the full{" "}
                      {selectedPackage.duration_label ||
                        "package"}{" "}
                      rental period.
                    </span>
                  )}

                  {staticAvailabilityState ===
                    "unavailable" && (
                    <span className="font-semibold">
                      This billboard is not available for the full{" "}
                      {selectedPackage.duration_label ||
                        "selected"}{" "}
                      rental period. Try another start date or package.
                    </span>
                  )}

                  {staticAvailabilityState ===
                    "error" && (
                    <span className="font-semibold">
                      We could not verify the full package period right now. Please try again.
                    </span>
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

      {/* CTA */}
      <button
        type="button"
        disabled={
          availabilityChecking ||
          !effectiveAvailable ||
          !startDate ||
          !packageChangeoverDate ||
          (
            packages.length > 0 &&
            !selectedPackage
          )
        }
        onClick={() =>
          setOpen(true)
        }
        className="mt-5 w-full rounded-xl bg-orange-500 px-5 py-4 font-extrabold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {availabilityChecking
          ? "Checking Package Availability..."
          : effectiveAvailable
            ? "Start Campaign"
            : isStatic
              ? "Unavailable for Selected Package"
              : "Currently Unavailable"}
      </button>

      {!startDate ||
      !packageChangeoverDate ? (
        <p className="mt-3 text-center text-xs text-slate-400">
          Choose a campaign start date from the homepage first.
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
            startDate
          }
          changeoverDate={
            packageChangeoverDate
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
