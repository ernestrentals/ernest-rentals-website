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
      Number(
        value
      )
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
  if (!width || !height) {
    return "Size available on request";
  }

  return `${width} × ${height} ft`;
}

export default function AvailabilitySearch() {
  const supabase = useMemo(
    () => createBrowserClient(),
    []
  );

  const [location, setLocation] =
    useState("");

  const [
    billboardType,
    setBillboardType,
  ] = useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [results, setResults] =
    useState<AvailabilityResult[]>([]);

  const [
    staticPackages,
    setStaticPackages,
  ] =
    useState<StaticPackage[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [searched, setSearched] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    selectedBillboard,
    setSelectedBillboard,
  ] =
    useState<AvailabilityResult | null>(
      null
    );

  useEffect(() => {
    async function loadStaticPackages() {
      const {
        data,
        error,
      } =
        await supabase.rpc(
          "get_public_static_billboard_packages"
        );

      if (error) {
        console.error(
          "Unable to load static billboard packages:",
          error
        );

        return;
      }

      setStaticPackages(
        (data ??
          []) as StaticPackage[]
      );
    }

    loadStaticPackages();
  }, [
    supabase,
  ]);

  useEffect(() => {
    let cancelled = false;

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

      const urlStart =
        params.get(
          "start"
        ) ??
        "";

      const urlEnd =
        params.get(
          "end"
        ) ??
        "";

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
        !urlEnd ||
        urlEnd <=
          urlStart
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
        (data ??
          []) as AvailabilityResult[]
      );

      window.requestAnimationFrame(
        () => {
          document
            .getElementById(
              "availability"
            )
            ?.scrollIntoView({
              behavior:
                "smooth",
              block:
                "start",
            });
        }
      );
    }

    runSearchFromUrl();

    return () => {
      cancelled =
        true;
    };
  }, [
    supabase,
  ]);

  async function handleSearch(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setResults([]);
    setSearched(false);
    setSelectedBillboard(null);

    if (!startDate || !endDate) {
      setErrorMessage(
        "Please select a start date and changeover date."
      );

      return;
    }

    if (endDate <= startDate) {
      setErrorMessage(
        "The changeover date must be after the start date."
      );

      return;
    }

    setLoading(true);

    const { data, error } =
      await supabase.rpc(
        "search_public_billboard_availability",
        {
          p_start_date:
            startDate,

          p_end_date:
            endDate,

          p_location:
            location || null,

          p_billboard_type:
            billboardType || null,
        }
      );

    setLoading(false);
    setSearched(true);

    if (error) {
      console.error(error);

      setErrorMessage(
        "We could not check availability right now. Please try again."
      );

      return;
    }

    setResults(
      (data ?? []) as AvailabilityResult[]
    );
  }

  return (
    <section
      id="availability"
      className="relative z-20 -mt-8 px-5 lg:px-8"
    >
      <div className="mx-auto max-w-[1500px]">

        {/* SEARCH FORM */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
          <form
            onSubmit={handleSearch}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
          >
            {/* LOCATION */}
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Location
              </span>

              <select
                value={location}
                onChange={(event) =>
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

            {/* BILLBOARD TYPE */}
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Billboard Type
              </span>

              <select
                value={billboardType}
                onChange={(event) =>
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

            {/* START DATE */}
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Start Date
              </span>

              <input
                type="date"
                value={startDate}
                onChange={(event) =>
                  setStartDate(
                    event.target.value
                  )
                }
                required
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
            </label>

            {/* CHANGEOVER DATE */}
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Changeover Date
              </span>

              <input
                type="date"
                value={endDate}
                min={
                  startDate
                    ? new Date(
                        `${startDate}T00:00:00Z`
                      )
                        .toISOString()
                        .slice(
                          0,
                          10
                        ) ===
                      startDate
                      ? new Date(
                          new Date(
                            `${startDate}T00:00:00Z`
                          ).getTime() +
                            86400000
                        )
                          .toISOString()
                          .slice(
                            0,
                            10
                          )
                      : undefined
                    : undefined
                }
                onChange={(event) =>
                  setEndDate(
                    event.target.value
                  )
                }
                required
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
            </label>

            {/* SEARCH BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-auto rounded-xl bg-orange-500 px-5 py-3.5 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Checking..."
                : "Search Availability"}
            </button>
          </form>

          {/* SEARCH ERROR */}
          {errorMessage && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          )}
        </div>

        {/* RESULTS */}
        {searched && (
          <div className="mt-8">

            {/* RESULTS HEADER */}
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
                  Availability Results
                </p>

                <h2 className="mt-1 text-2xl font-black text-[#071226]">
                  Advertising opportunities
                </h2>
              </div>

              <p className="text-sm text-slate-500">
                {results.length} option
                {results.length === 1
                  ? ""
                  : "s"}{" "}
                found
              </p>
            </div>

            {/* NO RESULTS */}
            {results.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-bold text-slate-900">
                  No matching availability found.
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Try another location,
                  billboard type or date
                  range.
                </p>
              </div>
            ) : (
              /* RESULTS GRID */
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[...results]
                  .sort(
                    (a, b) => {
                      const aAvailable =
                        resultIsAvailable(
                          a
                        );

                      const bAvailable =
                        resultIsAvailable(
                          b
                        );

                      if (
                        aAvailable ===
                        bAvailable
                      ) {
                        return 0;
                      }

                      return aAvailable
                        ? -1
                        : 1;
                    }
                  )
                  .map(
                  (result) => {
                    const isDigital =
                      result.billboard_type ===
                      "digital";

                    const resultStaticPackages =
                      staticPackages
                        .filter(
                          (item) =>
                            item.billboard_id ===
                            result.billboard_id
                        )
                        .sort(
                          (a, b) =>
                            Number(
                              a.duration_value ??
                                0
                            ) -
                            Number(
                              b.duration_value ??
                                0
                            )
                        );

                    const available =
                      resultIsAvailable(
                        result
                      );

                    return (
                      <article
                        key={
                          result.billboard_id
                        }
                        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
                      >
                        {/* IMAGE / VISUAL HEADER */}
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
                              <div className="absolute -right-2 top-2 h-16 w-16 rounded-full border border-white/10" />

                              <div className="relative">
                                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-400">
                                  Ernest Rentals
                                </p>

                                <h3 className="mt-1 max-w-[95%] text-lg font-black leading-tight text-white">
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

                          {/* TYPE */}
                          <span className="absolute left-3 top-3 z-20 rounded-full border border-white/20 bg-white/95 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#071226] shadow-sm backdrop-blur">
                            {isDigital
                              ? "Digital"
                              : "Static"}
                          </span>

                          {/* STATUS */}
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

                        {/* CARD BODY */}
                        <div className="flex flex-1 flex-col p-4">

                          {/* LOCATION */}
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

                          {/* SPECS */}
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

                          {/* AVAILABILITY */}
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

                              <div className="shrink-0 text-right">
                                <p className="text-[10px] font-bold text-slate-400">
                                  9:00 AM
                                </p>

                                <p className="text-[10px] text-slate-400">
                                  changeover
                                </p>
                              </div>
                            </div>
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
                                disabled={!available}
                                onClick={() =>
                                  setSelectedBillboard(
                                    result
                                  )
                                }
                                className="rounded-xl bg-[#071226] px-3 py-2.5 text-xs font-extrabold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                              >
                                Start Campaign
                              </button>
                            ) : available ? (
                              <a
                                href={`/billboards/${result.billboard_id}?start=${startDate}&end=${endDate}`}
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
                              href={`/billboards/${result.billboard_id}?start=${startDate}&end=${endDate}`}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center text-xs font-extrabold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                            >
                              View Details
                            </a>
                          </div>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* START CAMPAIGN MODAL */}
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
          startDate={
            startDate
          }
          changeoverDate={
            endDate
          }
          onClose={() =>
            setSelectedBillboard(null)
          }
        />
      )}
    </section>
  );
}