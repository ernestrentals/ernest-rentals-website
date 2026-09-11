"use client";

import {
  FormEvent,
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
      <div className="mx-auto max-w-7xl">

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

                <option value="Praslin">
                  Praslin
                </option>

                <option value="Micoud">
                  Micoud
                </option>

                <option value="Mamiku">
                  Mamiku
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
                min={startDate || undefined}
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
              <div className="grid gap-5 lg:grid-cols-2">
                {results.map(
                  (result) => {
                    const isDigital =
                      result.billboard_type ===
                      "digital";

                    const available =
                      result.availability_status ===
                      "available";

                    return (
                      <article
                        key={
                          result.billboard_id
                        }
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        {/* BRAND STRIP */}
                        <div className="h-2 bg-gradient-to-r from-orange-500 via-orange-500 to-sky-500" />

                        {/* BILLBOARD IMAGE */}
                        {result.image_url ? (
                          <div className="relative h-60 overflow-hidden bg-slate-100">
                            <img
                              src={
                                result.image_url
                              }
                              alt={
                                result.billboard_name
                              }
                              className="h-full w-full object-cover transition duration-500 hover:scale-105"
                            />

                            <div className="absolute left-4 top-4">
                              <span
                                className={`rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${
                                  available
                                    ? "bg-white text-emerald-700"
                                    : "bg-white text-red-700"
                                }`}
                              >
                                {available
                                  ? "Available"
                                  : "Fully Booked"}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex h-60 items-center justify-center bg-[#071226] px-6 text-center">
                            <div>
                              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-400">
                                Ernest Rentals
                              </p>

                              <p className="mt-3 text-2xl font-black text-white">
                                {
                                  result.billboard_name
                                }
                              </p>

                              <p className="mt-2 text-sm text-slate-400">
                                Billboard photo coming soon
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="p-6">

                          {/* TITLE */}
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                                {isDigital
                                  ? "Digital Billboard"
                                  : "Static Billboard"}
                              </p>

                              <h3 className="mt-2 text-xl font-black text-[#071226]">
                                {
                                  result.billboard_name
                                }
                              </h3>

                              <p className="mt-1 text-sm text-slate-500">
                                {result.location ||
                                  "Saint Lucia"}
                              </p>
                            </div>

                            {!result.image_url && (
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${
                                  available
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-red-50 text-red-700"
                                }`}
                              >
                                {available
                                  ? "Available"
                                  : "Fully Booked"}
                              </span>
                            )}
                          </div>

                          {/* BILLBOARD SPECS */}
                          <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-sm">
                            <div>
                              <p className="text-xs text-slate-400">
                                Size
                              </p>

                              <p className="mt-1 font-semibold text-slate-800">
                                {formatSize(
                                  result.width_ft,
                                  result.height_ft
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-400">
                                Orientation
                              </p>

                              <p className="mt-1 font-semibold capitalize text-slate-800">
                                {result.orientation ||
                                  "—"}
                              </p>
                            </div>
                          </div>

                          {/* DIGITAL AVAILABILITY */}
                          {isDigital ? (
                            <div className="mt-5 grid gap-3 sm:grid-cols-3">

                              {/* STANDARD */}
                              <div className="rounded-xl border border-slate-200 p-4">
                                <p className="text-xs font-semibold text-slate-500">
                                  Standard
                                </p>

                                <p className="mt-1 text-2xl font-black text-sky-600">
                                  {
                                    result.available_standard_slots
                                  }
                                </p>

                                <p className="text-xs text-slate-400">
                                  10-second slots
                                </p>
                              </div>

                              {/* PREMIUM */}
                              <div className="rounded-xl border border-orange-200 bg-orange-50/40 p-4">
                                <p className="text-xs font-semibold text-slate-500">
                                  Premium
                                </p>

                                <p className="mt-1 text-2xl font-black text-orange-600">
                                  {
                                    result.available_premium_slots
                                  }
                                </p>

                                <p className="text-xs text-slate-400">
                                  15-second slots
                                </p>
                              </div>

                              {/* SHOUTOUT */}
                              <div className="rounded-xl border border-slate-200 p-4">
                                <p className="text-xs font-semibold text-slate-500">
                                  Shoutouts
                                </p>

                                <p className="mt-1 text-2xl font-black text-[#071226]">
                                  {
                                    result.available_shoutout_slots
                                  }
                                </p>

                                <p className="text-xs text-slate-400">
                                  available
                                </p>
                              </div>
                            </div>
                          ) : (
                            /* STATIC AVAILABILITY */
                            <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50/40 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Static Availability
                              </p>

                              <p className="mt-2 text-2xl font-black text-orange-600">
                                {
                                  result.available_static_faces
                                }{" "}
                                face
                                {result.available_static_faces ===
                                1
                                  ? ""
                                  : "s"}{" "}
                                available
                              </p>
                            </div>
                          )}

                          {/* ACTION BUTTONS */}
                          <div className="mt-6 flex flex-wrap gap-3">

                            {/* START CAMPAIGN */}
                            <button
                              type="button"
                              disabled={!available}
                              onClick={() =>
                                setSelectedBillboard(
                                  result
                                )
                              }
                              className="rounded-xl bg-[#071226] px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                              Start Campaign
                            </button>

                            {/* VIEW DETAILS */}
                            <a
                              href={`/billboards/${result.billboard_id}?start=${startDate}&end=${endDate}`}
                              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
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