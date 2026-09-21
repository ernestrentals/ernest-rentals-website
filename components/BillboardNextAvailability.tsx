"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createBrowserClient } from "@/lib/supabase/client";

type Props = {
  billboardId: string;
  billboardType: string;

  packageType: string;

  durationValue:
    | number
    | null;

  durationUnit:
    | string
    | null;

  durationLabel:
    | string
    | null;

  searchFrom?: string;

  currentlyAvailable?: boolean;
};

type NextAvailabilityResult = {
  next_start_date: string;
  next_end_date: string;
};

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

  return formatDateKey(
    new Date(
      Date.UTC(
        year,
        month - 1,
        day + days
      )
    )
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

function formatDate(
  value: string
) {
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

export default function BillboardNextAvailability({
  billboardId,
  billboardType,
  packageType,
  durationValue,
  durationUnit,
  durationLabel,
  searchFrom,
  currentlyAvailable = false,
}: Props) {
  const supabase =
    useMemo(
      () =>
        createBrowserClient(),
      []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    nextAvailability,
    setNextAvailability,
  ] =
    useState<
      NextAvailabilityResult |
      null
    >(null);

  const [
    error,
    setError,
  ] =
    useState(false);

  useEffect(() => {
    let cancelled =
      false;

    async function loadNextAvailability() {
      if (
        !durationValue ||
        !durationUnit
      ) {
        setNextAvailability(
          null
        );

        return;
      }

      setLoading(
        true
      );

      setError(
        false
      );

      const tomorrow =
        addDaysToDate(
          saintLuciaTodayString(),
          1
        );

      const effectiveSearchFrom =
        searchFrom &&
        searchFrom >
          tomorrow
          ? searchFrom
          : tomorrow;

      const {
        data,
        error:
          rpcError,
      } =
        await supabase.rpc(
          "get_next_public_billboard_availability",
          {
            p_billboard_id:
              billboardId,

            p_billboard_type:
              billboardType,

            p_package_type:
              packageType,

            p_duration_value:
              Number(
                durationValue
              ),

            p_duration_unit:
              durationUnit,

            p_search_from:
              effectiveSearchFrom,

            p_max_days:
              730,
          }
        );

      if (
        cancelled
      ) {
        return;
      }

      if (
        rpcError
      ) {
        console.error(
          "Unable to calculate next availability:",
          rpcError
        );

        setError(
          true
        );

        setLoading(
          false
        );

        return;
      }

      const result =
        (
          data ??
          []
        )[0] as
          | NextAvailabilityResult
          | undefined;

      setNextAvailability(
        result ?? null
      );

      setLoading(
        false
      );
    }

    loadNextAvailability();

    return () => {
      cancelled =
        true;
    };
  }, [
    billboardId,
    billboardType,
    durationUnit,
    durationValue,
    packageType,
    searchFrom,
    supabase,
  ]);

  if (
    !durationValue ||
    !durationUnit
  ) {
    return null;
  }

  if (
    loading
  ) {
    return (
      <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-3">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
          Next Available
        </p>

        <div className="mt-2 h-4 w-28 animate-pulse rounded bg-emerald-100" />
      </div>
    );
  }

  if (
    error ||
    !nextAvailability
  ) {
    return null;
  }

  return (
    <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
            {currentlyAvailable
              ? "Available From"
              : "Next Available"}
          </p>

          <p className="mt-1 text-sm font-black text-slate-900">
            {formatDate(
              nextAvailability.next_start_date
            )}
          </p>

          <p className="mt-1 text-[10px] font-semibold leading-4 text-slate-500">
            {durationLabel
              ? `For a ${durationLabel} campaign`
              : "Campaign opening"}
          </p>
        </div>

        <span className="rounded-full bg-white px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-emerald-700 shadow-sm">
          Live
        </span>
      </div>

      <a
        href={`/billboards/${billboardId}?start=${nextAvailability.next_start_date}&end=${nextAvailability.next_end_date}`}
        className="mt-3 inline-flex text-[11px] font-extrabold text-emerald-700 transition hover:text-orange-600"
      >
        View this opening →
      </a>
    </div>
  );
}