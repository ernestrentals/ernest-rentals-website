"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createBrowserClient,
} from "@/lib/supabase/client";

import BillboardNextAvailability from "@/components/BillboardNextAvailability";
import StartCampaignForm from "@/components/StartCampaignForm";

type AvailabilityResult = {
  billboard_id: string;
  billboard_code: string;
  billboard_name: string;
  location: string | null;
  billboard_type: string;
  orientation: string | null;
  width_ft: number | null;
  height_ft: number | null;
  total_faces: number;
  available_static_faces: number;
  available_standard_slots: number;
  available_premium_slots: number;
  available_shoutout_slots: number;
  availability_status: string;
  image_url: string | null;
};

type StaticPackage = {
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

type DigitalPackage = {
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
        maximumFractionDigits: 0,
      }
    ).format(
      Number(value)
    );
  } catch {
    return `${currency} ${Number(
      value
    ).toFixed(0)}`;
  }
}

function resultIsAvailable(
  result: AvailabilityResult
) {
  if (
    result.billboard_type ===
    "digital"
  ) {
    return (
      result.available_standard_slots >
        0 ||
      result.available_premium_slots >
        0 ||
      result.available_shoutout_slots >
        0
    );
  }

  return (
    result.available_static_faces >
    0
  );
}

function formatSize(
  width: number | null,
  height: number | null
) {
  if (
    !width ||
    !height
  ) {
    return "Size available on request";
  }

  return `${width} × ${height} ft`;
}

function durationSortValue(
  value: number | null,
  unit: string | null
) {
  if (
    !value ||
    !unit
  ) {
    return Number.MAX_SAFE_INTEGER;
  }

  const normalizedUnit =
    unit
      .toLowerCase()
      .trim();

  if (
    normalizedUnit === "day" ||
    normalizedUnit === "days"
  ) {
    return value;
  }

  if (
    normalizedUnit === "week" ||
    normalizedUnit === "weeks"
  ) {
    return value * 7;
  }

  if (
    normalizedUnit === "month" ||
    normalizedUnit === "months"
  ) {
    return value * 30;
  }

  if (
    normalizedUnit === "year" ||
    normalizedUnit === "years"
  ) {
    return value * 365;
  }

  return Number.MAX_SAFE_INTEGER;
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

  return date
    .toISOString()
    .slice(
      0,
      10
    );
}

export default function AvailabilitySearch() {
  const supabase =
    useMemo(
      () =>
        createBrowserClient(),
      []
    );

  const today =
    saintLuciaTodayString();

  const [
    location,
    setLocation,
  ] =
    useState("");

  const [
    billboardType,
    setBillboardType,
  ] =
    useState("");

  const [
    startDate,
    setStartDate,
  ] =
    useState("");

  const [
    endDate,
    setEndDate,
  ] =
    useState("");

  /*
    These are the dates that actually produced
    the results currently on screen.

    This prevents someone from changing the search
    fields after searching and then using a different
    date against the old result cards.
  */
  const [
    activeSearchStartDate,
    setActiveSearchStartDate,
  ] =
    useState("");

  const [
    activeSearchEndDate,
    setActiveSearchEndDate,
  ] =
    useState("");

  const [
    results,
    setResults,
  ] =
    useState<
      AvailabilityResult[]
    >([]);

  const [
    staticPackages,
    setStaticPackages,
  ] =
    useState<
      StaticPackage[]
    >([]);

  const [
    digitalPackages,
    setDigitalPackages,
  ] =
    useState<
      DigitalPackage[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    searched,
    setSearched,
  ] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");

  const [
    selectedBillboard,
    setSelectedBillboard,
  ] =
    useState<
      AvailabilityResult |
      null
    >(null);

  /*
    LOAD PACKAGES
  */
  useEffect(() => {
    let cancelled =
      false;

    async function loadPackages() {
      const {
        data:
          staticData,
        error:
          staticError,
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
        staticError
      ) {
        console.error(
          "Unable to load static billboard packages:",
          staticError
        );
      } else {
        setStaticPackages(
          (
            staticData ??
            []
          ) as StaticPackage[]
        );
      }

      const {
        data:
          digitalData,
        error:
          digitalError,
      } =
        await supabase.rpc(
          "get_public_ad_packages",
          {
            p_billboard_type:
              "digital",
          }
        );

      if (
        cancelled
      ) {
        return;
      }

      if (
        digitalError
      ) {
        console.error(
          "Unable to load digital billboard packages:",
          digitalError
        );
      } else {
        setDigitalPackages(
          (
            digitalData ??
            []
          ) as DigitalPackage[]
        );
      }
    }

    loadPackages();

    return () => {
      cancelled =
        true;
    };
  }, [
    supabase,
  ]);

  /*
    AUTOMATIC SEARCH FROM URL
  */
  useEffect(() => {
    let cancelled =
      false;

    async function runSearchFromUrl() {
      if (
        typeof window ===
        "undefined"
      ) {
        return;
      }

      const params =
        new URLSearchParams(
          window.location.search
        );

      const urlLocation =
        params.get(
          "location"
        ) ??
        "";

      const urlType =
        params.get(
          "type"
        ) ??
        "";

      const rawUrlStart =
        params.get(
          "start"
        ) ??
        "";

      const rawUrlEnd =
        params.get(
          "end"
        ) ??
        "";

      /*
        Never allow an old URL to search
        for a campaign beginning before today.
      */
      const urlStart =
        rawUrlStart &&
        rawUrlStart >=
          today
          ? rawUrlStart
          : rawUrlStart
            ? today
            : "";

      const urlEnd =
        rawUrlEnd &&
        urlStart &&
        rawUrlEnd >
          urlStart
          ? rawUrlEnd
          : "";

      if (
        urlLocation
      ) {
        setLocation(
          urlLocation
        );
      }

      if (
        urlType ===
          "static" ||
        urlType ===
          "digital"
      ) {
        setBillboardType(
          urlType
        );
      }

      if (
        urlStart
      ) {
        setStartDate(
          urlStart
        );
      }

      if (
        urlEnd
      ) {
        setEndDate(
          urlEnd
        );
      }

      if (
        !urlStart ||
        !urlEnd
      ) {
        return;
      }

      setErrorMessage(
        ""
      );

      setResults(
        []
      );

      setSelectedBillboard(
        null
      );

      setActiveSearchStartDate(
        urlStart
      );

      setActiveSearchEndDate(
        urlEnd
      );

      setLoading(
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
              urlStart,

            p_end_date:
              urlEnd,

            p_location:
              urlLocation ||
              null,

            p_billboard_type:
              (
                urlType ===
                  "static" ||
                urlType ===
                  "digital"
              )
                ? urlType
                : null,
          }
        );

      if (
        cancelled
      ) {
        return;
      }

      setLoading(
        false
      );

      setSearched(
        true
      );

      if (
        error
      ) {
        console.error(
          error
        );

        setErrorMessage(
          "We could not check availability right now. Please try again."
        );

        return;
      }

      setResults(
        (
          data ??
          []
        ) as AvailabilityResult[]
      );
    }

    runSearchFromUrl();

    return () => {
      cancelled =
        true;
    };
  }, [
    supabase,
    today,
  ]);

  async function handleSearch(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage(
      ""
    );

    setResults(
      []
    );

    setSearched(
      false
    );

    setSelectedBillboard(
      null
    );

    if (
      !startDate ||
      !endDate
    ) {
      setErrorMessage(
        "Please select a start date and changeover date."
      );

      return;
    }

    /*
      HARD RULE:
      no search or campaign can begin before today.
    */
    if (
      startDate <
      today
    ) {
      setErrorMessage(
        "The campaign start date cannot be before today."
      );

      return;
    }

    if (
      endDate <=
      startDate
    ) {
      setErrorMessage(
        "The changeover date must be after the start date."
      );

      return;
    }

    /*
      Lock the dates that produced these results.
    */
    setActiveSearchStartDate(
      startDate
    );

    setActiveSearchEndDate(
      endDate
    );

    setLoading(
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
            startDate,

          p_end_date:
            endDate,

          p_location:
            location ||
            null,

          p_billboard_type:
            billboardType ||
            null,
        }
      );

    setLoading(
      false
    );

    setSearched(
      true
    );

    if (
      error
    ) {
      console.error(
        error
      );

      setErrorMessage(
        "We could not check availability right now. Please try again."
      );

      return;
    }

    setResults(
      (
        data ??
        []
      ) as AvailabilityResult[]
    );
  }

  const availableResults =
    results.filter(
      (
        result
      ) =>
        resultIsAvailable(
          result
        )
    );

  const bookedResults =
    results.filter(
      (
        result
      ) =>
        !resultIsAvailable(
          result
        )
    );

  function renderResultCard(
    result:
      AvailabilityResult
  ) {
    const isDigital =
      result.billboard_type ===
      "digital";

    const available =
      resultIsAvailable(
        result
      );

    const resultStaticPackages =
      staticPackages
        .filter(
          (
            item
          ) =>
            item.billboard_id ===
            result.billboard_id
        )
        .sort(
          (
            a,
            b
          ) =>
            durationSortValue(
              a.duration_value,
              a.duration_unit
            ) -
            durationSortValue(
              b.duration_value,
              b.duration_unit
            )
        );

    const resultDigitalStandardPackages =
      digitalPackages
        .filter(
          (
            item
          ) =>
            item.package_type
              .toLowerCase()
              .trim() ===
            "standard"
        )
        .sort(
          (
            a,
            b
          ) =>
            durationSortValue(
              a.duration_value,
              a.duration_unit
            ) -
            durationSortValue(
              b.duration_value,
              b.duration_unit
            )
        );

    const shortestStaticPackage =
      resultStaticPackages[
        0
      ] ??
      null;

    const defaultDigitalPackage =
      resultDigitalStandardPackages[
        0
      ] ??
      null;

    const detailParams =
      new URLSearchParams();

    if (
      activeSearchStartDate
    ) {
      detailParams.set(
        "start",
        activeSearchStartDate
      );
    }

    if (
      activeSearchEndDate
    ) {
      detailParams.set(
        "end",
        activeSearchEndDate
      );
    }

    const billboardDetailHref =
      `/billboards/${result.billboard_id}?${detailParams.toString()}`;

    return (
      <article
        key={
          result.billboard_id
        }
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
      >

        {/* IMAGE */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 z-20 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-sky-500" />

          {result.image_url ? (
            <div className="relative h-36 overflow-hidden bg-slate-100">
              <img
                src={
                  result.image_url
                }
                alt={
                  result.billboard_name
                }
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#071226]/70 via-transparent to-black/5" />

              <div className="absolute inset-x-4 bottom-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-300">
                  Ernest Rentals
                </p>

                <h3 className="mt-1 text-lg font-black leading-tight text-white">
                  {
                    result.billboard_name
                  }
                </h3>
              </div>
            </div>
          ) : (
            <div className="relative flex h-36 items-end overflow-hidden bg-[radial-gradient(circle_at_top_right,_#17325f_0%,_#071226_48%,_#030917_100%)] p-4">
              <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full border border-white/10" />

              <div className="relative">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-400">
                  Ernest Rentals
                </p>

                <h3 className="mt-1 text-lg font-black leading-tight text-white">
                  {
                    result.billboard_name
                  }
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Photo coming soon
                </p>
              </div>
            </div>
          )}

          <span className="absolute left-3 top-3 z-20 rounded-full border border-white/20 bg-white/95 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#071226] shadow-sm">
            {isDigital
              ? "Digital"
              : "Static"}
          </span>

          <span
            className={`absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold shadow-sm ${
              available
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                available
                  ? "bg-emerald-500"
                  : "bg-red-500"
              }`}
            />

            {available
              ? "Available"
              : "Booked"}
          </span>
        </div>

        {/* BODY */}
        <div className="flex flex-1 flex-col p-4">

          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm font-semibold text-slate-500">
              {result.location ||
                "Saint Lucia"}
            </p>

            <p className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-slate-300">
              {
                result.billboard_code
              }
            </p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-slate-50 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Size
              </p>

              <p className="mt-0.5 text-sm font-extrabold text-[#071226]">
                {formatSize(
                  result.width_ft,
                  result.height_ft
                )}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Orientation
              </p>

              <p className="mt-0.5 truncate text-sm font-extrabold capitalize text-[#071226]">
                {result.orientation ||
                  "—"}
              </p>
            </div>
          </div>

          {/* CURRENT AVAILABILITY */}
          {isDigital ? (
            <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="px-2 py-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Standard
                </p>

                <p className="mt-1 text-xl font-black text-sky-600">
                  {
                    result.available_standard_slots
                  }
                </p>

                <p className="text-[10px] text-slate-400">
                  10 sec
                </p>
              </div>

              <div className="border-x border-slate-200 px-2 py-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Premium
                </p>

                <p className="mt-1 text-xl font-black text-orange-600">
                  {
                    result.available_premium_slots
                  }
                </p>

                <p className="text-[10px] text-slate-400">
                  15 sec
                </p>
              </div>

              <div className="px-2 py-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Shoutout
                </p>

                <p className="mt-1 text-xl font-black text-violet-700">
                  {
                    result.available_shoutout_slots
                  }
                </p>

                <p className="text-[10px] text-slate-400">
                  slots
                </p>
              </div>
            </div>
          ) : (
            <div
              className={`mt-3 flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-3 ${
                available
                  ? "border-emerald-100 bg-emerald-50/60"
                  : "border-red-100 bg-red-50/70"
              }`}
            >
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                  Availability
                </p>

                <p
                  className={`mt-0.5 text-sm font-black ${
                    available
                      ? "text-emerald-700"
                      : "text-red-700"
                  }`}
                >
                  {available
                    ? `${result.available_static_faces} face${
                        result.available_static_faces ===
                        1
                          ? ""
                          : "s"
                      } available`
                    : "Booked for selected dates"}
                </p>
              </div>
            </div>
          )}

          {/* NEXT AVAILABLE - STATIC */}
          {!available &&
            !isDigital &&
            shortestStaticPackage &&
            shortestStaticPackage.duration_value &&
            shortestStaticPackage.duration_unit && (
              <BillboardNextAvailability
                billboardId={
                  result.billboard_id
                }
                billboardType="static"
                packageType="static"
                durationValue={
                  shortestStaticPackage.duration_value
                }
                durationUnit={
                  shortestStaticPackage.duration_unit
                }
                durationLabel={
                  shortestStaticPackage.duration_label
                }

                /*
                  IMPORTANT:
                  Never search earlier than the
                  start date that generated these results.
                */
                searchFrom={
                  activeSearchStartDate
                }
              />
            )}

          {/* NEXT AVAILABLE - DIGITAL */}
          {!available &&
            isDigital &&
            defaultDigitalPackage &&
            defaultDigitalPackage.duration_value &&
            defaultDigitalPackage.duration_unit && (
              <BillboardNextAvailability
                billboardId={
                  result.billboard_id
                }
                billboardType="digital"
                packageType={
                  defaultDigitalPackage.package_type
                }
                durationValue={
                  defaultDigitalPackage.duration_value
                }
                durationUnit={
                  defaultDigitalPackage.duration_unit
                }
                durationLabel={
                  defaultDigitalPackage.duration_label
                }
                searchFrom={
                  activeSearchStartDate
                }
              />
            )}

          {/* STATIC RATES */}
          {!isDigital && (
            <div className="mt-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Rental Rates
                </p>

                <span className="text-[10px] text-slate-400">
                  Per face
                </span>
              </div>

              {resultStaticPackages.length >
              0 ? (
                <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
                  {resultStaticPackages.map(
                    (
                      staticPackage,
                      index
                    ) => (
                      <div
                        key={
                          staticPackage.package_id
                        }
                        className={`px-2 py-3 ${
                          index >
                          0
                            ? "border-l border-slate-200"
                            : ""
                        }`}
                      >
                        <p className="truncate text-[10px] font-bold text-slate-500">
                          {staticPackage.duration_label ||
                            staticPackage.package_name}
                        </p>

                        <p className="mt-1 whitespace-nowrap text-sm font-black tracking-tight text-[#071226]">
                          {formatMoney(
                            staticPackage.price,
                            staticPackage.currency_code ||
                              "XCD"
                          )}
                        </p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-medium text-slate-500">
                  Pricing available on request.
                </div>
              )}
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
            {isDigital ? (
              <button
                type="button"
                disabled={
                  !available
                }
                onClick={() =>
                  setSelectedBillboard(
                    result
                  )
                }
                className="rounded-xl bg-[#071226] px-3 py-2.5 text-xs font-extrabold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                {available
                  ? "Start Campaign"
                  : "Unavailable"}
              </button>
            ) : available ? (
              <a
                href={
                  billboardDetailHref
                }
                className="rounded-xl bg-[#071226] px-3 py-2.5 text-center text-xs font-extrabold text-white transition hover:bg-orange-600"
              >
                Choose Package
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="rounded-xl bg-slate-200 px-3 py-2.5 text-xs font-extrabold text-slate-400"
              >
                Unavailable
              </button>
            )}

            <a
              href={
                billboardDetailHref
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center text-xs font-extrabold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
            >
              View Details
            </a>
          </div>
        </div>
      </article>
    );
  }

  return (
    <section
      id="availability"
      className="relative z-20 -mt-8 scroll-mt-28 px-5 lg:px-8"
    >
      <div className="mx-auto max-w-[1500px]">

        {/* SEARCH */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
          <form
            onSubmit={
              handleSearch
            }
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
          >

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Location
              </span>

              <select
                value={
                  location
                }
                onChange={(
                  event
                ) =>
                  setLocation(
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-orange-400"
              >
                <option value="">
                  All locations
                </option>

                <option value="Castries">
                  Castries
                </option>

                <option value="Dennery">
                  Dennery
                </option>

                <option value="Mamiku">
                  Mamiku
                </option>

                <option value="Micoud">
                  Micoud
                </option>

                <option value="Mon Repos">
                  Mon Repos
                </option>

                <option value="Piaye">
                  Piaye
                </option>

                <option value="Praslin">
                  Praslin
                </option>

                <option value="Richford">
                  Richford
                </option>

                <option value="Rodney Bay">
                  Rodney Bay
                </option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Billboard Type
              </span>

              <select
                value={
                  billboardType
                }
                onChange={(
                  event
                ) =>
                  setBillboardType(
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-orange-400"
              >
                <option value="">
                  Static or Digital
                </option>

                <option value="static">
                  Static Billboard
                </option>

                <option value="digital">
                  Digital Billboard
                </option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Start Date
              </span>

              <input
                type="date"
                value={
                  startDate
                }
                min={
                  today
                }
                onChange={(
                  event
                ) => {
                  const value =
                    event.target.value;

                  setStartDate(
                    value
                  );

                  if (
                    endDate &&
                    endDate <=
                      value
                  ) {
                    setEndDate(
                      ""
                    );
                  }
                }}
                required
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Changeover Date
              </span>

              <input
                type="date"
                value={
                  endDate
                }
                min={
                  startDate
                    ? addDaysToDate(
                        startDate,
                        1
                      )
                    : addDaysToDate(
                        today,
                        1
                      )
                }
                onChange={(
                  event
                ) =>
                  setEndDate(
                    event.target.value
                  )
                }
                required
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
            </label>

            <button
              type="submit"
              disabled={
                loading
              }
              className="mt-auto rounded-xl bg-orange-500 px-5 py-3.5 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Checking..."
                : "Search Availability"}
            </button>
          </form>

          {errorMessage && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {
                errorMessage
              }
            </div>
          )}
        </div>

        {/* RESULTS */}
        {searched && (
          <div className="mt-8">

            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
                  Availability Results
                </p>

                <h2 className="mt-1 text-2xl font-black text-[#071226]">
                  Advertising opportunities
                </h2>

                {activeSearchStartDate &&
                  activeSearchEndDate && (
                  <p className="mt-2 text-sm text-slate-500">
                    Results are locked to the dates you searched.
                  </p>
                )}
              </div>

              <p className="text-sm text-slate-500">
                {
                  results.length
                }{" "}
                option
                {results.length ===
                1
                  ? ""
                  : "s"}{" "}
                found
              </p>
            </div>

            {results.length ===
            0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-bold text-slate-900">
                  No matching availability found.
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Try another location, billboard type or date range.
                </p>
              </div>
            ) : (
              <>
                {/* AVAILABLE */}
                {availableResults.length >
                  0 && (
                  <section>
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-600">
                          Available Now
                        </p>

                        <h3 className="mt-1 text-xl font-black text-[#071226]">
                          Available for your selected dates
                        </h3>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
                        {
                          availableResults.length
                        }{" "}
                        Available
                      </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {availableResults.map(
                        renderResultCard
                      )}
                    </div>
                  </section>
                )}

                {/* BOOKED - ALWAYS STARTS ON ITS OWN LINE */}
                {bookedResults.length >
                  0 && (
                  <section
                    className={`${
                      availableResults.length >
                      0
                        ? "mt-12 border-t border-slate-200 pt-10"
                        : ""
                    }`}
                  >
                    <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-red-600">
                          Booked
                        </p>

                        <h3 className="mt-1 text-xl font-black text-[#071226]">
                          Booked for your selected dates
                        </h3>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                          These billboards are unavailable for your searched
                          period. Their next available campaign opening is
                          shown where available.
                        </p>
                      </div>

                      <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700">
                        {
                          bookedResults.length
                        }{" "}
                        Booked
                      </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {bookedResults.map(
                        renderResultCard
                      )}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* DIGITAL CAMPAIGN MODAL */}
      {selectedBillboard && (
        <StartCampaignForm
          billboardId={
            selectedBillboard.billboard_id
          }

          billboardName={
            selectedBillboard.billboard_name
          }

          billboardType={
            selectedBillboard.billboard_type
          }

          location={
            selectedBillboard.location
          }

          /*
            Use only the dates that generated
            the displayed availability result.
          */
          startDate={
            activeSearchStartDate
          }

          changeoverDate={
            activeSearchEndDate
          }

          onClose={() =>
            setSelectedBillboard(
              null
            )
          }
        />
      )}
    </section>
  );
}