"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

type CompactAvailabilitySearchProps = {
  initialLocation?: string | null;
  initialBillboardType?: string;
  initialStartDate?: string;
  initialChangeoverDate?: string;
};

function addDays(
  value: string,
  amount: number
) {
  if (!value) {
    return "";
  }

  const [
    year,
    month,
    day,
  ] =
    value
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
        day + amount
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

export default function CompactAvailabilitySearch({
  initialLocation = "",
  initialBillboardType = "",
  initialStartDate = "",
  initialChangeoverDate = "",
}: CompactAvailabilitySearchProps) {
  const normalizedInitialLocation =
    useMemo(
      () =>
        initialLocation
          ?.split(",")[0]
          ?.trim() ??
        "",
      [
        initialLocation,
      ]
    );

  const [
    location,
    setLocation,
  ] =
    useState(
      normalizedInitialLocation
    );

  const [
    billboardType,
    setBillboardType,
  ] =
    useState(
      initialBillboardType
    );

  const [
    startDate,
    setStartDate,
  ] =
    useState(
      initialStartDate
    );

  const [
    changeoverDate,
    setChangeoverDate,
  ] =
    useState(
      initialChangeoverDate
    );

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");

  const minimumChangeoverDate =
    startDate
      ? addDays(
          startDate,
          1
        )
      : "";

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage(
      ""
    );

    if (
      !startDate ||
      !changeoverDate
    ) {
      setErrorMessage(
        "Choose a start date and changeover date."
      );

      return;
    }

    if (
      changeoverDate <=
      startDate
    ) {
      setErrorMessage(
        "The changeover date must be after the start date."
      );

      return;
    }

    const params =
      new URLSearchParams();

    if (
      location
    ) {
      params.set(
        "location",
        location
      );
    }

    if (
      billboardType
    ) {
      params.set(
        "type",
        billboardType
      );
    }

    params.set(
      "start",
      startDate
    );

    params.set(
      "end",
      changeoverDate
    );

    window.location.href =
      `/?${params.toString()}#availability`;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-orange-500">
            Update Search
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Change location, billboard type or dates.
          </p>
        </div>

        <a
          href="/#availability"
          className="text-xs font-bold text-sky-600 hover:text-sky-700"
        >
          Clear search
        </a>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.1fr_1.05fr_1fr_1fr_auto]"
      >
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
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
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-orange-400"
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
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
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
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-orange-400"
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
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Start
          </span>

          <input
            type="date"
            value={
              startDate
            }
            onChange={(
              event
            ) =>
              setStartDate(
                event.target.value
              )
            }
            required
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
          />
        </label>

        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Changeover
          </span>

          <input
            type="date"
            value={
              changeoverDate
            }
            min={
              minimumChangeoverDate ||
              undefined
            }
            onChange={(
              event
            ) =>
              setChangeoverDate(
                event.target.value
              )
            }
            required
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
          />
        </label>

        <button
          type="submit"
          className="mt-auto rounded-xl bg-[#071226] px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-orange-600"
        >
          Search
        </button>
      </form>

      {errorMessage && (
        <p className="mt-3 text-xs font-semibold text-red-600">
          {
            errorMessage
          }
        </p>
      )}
    </div>
  );
}
