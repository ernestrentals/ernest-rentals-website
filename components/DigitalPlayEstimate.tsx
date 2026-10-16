import {
  DIGITAL_ROTATION_LABEL,
  DIGITAL_SCREEN_END_TIME,
  DIGITAL_SCREEN_START_TIME,
  ESTIMATED_PLAYS_PER_DAY,
  ESTIMATED_PLAYS_PER_HOUR,
  ESTIMATED_PLAYS_PER_WEEK,
} from "@/lib/digital-play-frequency";

export function DigitalPlayEstimateCard() {
  return (
    <section className="px-5 py-4 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#071226] text-white shadow-xl">
        <div className="grid gap-8 p-7 sm:p-9 lg:grid-cols-[1.1fr_1.4fr] lg:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-400">
              Estimated Ad Plays
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Your ad plays approximately {ESTIMATED_PLAYS_PER_DAY.toLocaleString("en-US")} times per day.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Each booked digital slot appears once during the current
              {" "}{DIGITAL_ROTATION_LABEL} rotation, while the screen operates
              daily from {DIGITAL_SCREEN_START_TIME} to {DIGITAL_SCREEN_END_TIME}.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <PlayMetric
              value={`~${ESTIMATED_PLAYS_PER_HOUR}`}
              label="plays per hour"
            />

            <PlayMetric
              value={`~${ESTIMATED_PLAYS_PER_DAY.toLocaleString("en-US")}`}
              label="plays per day"
              accent
            />

            <PlayMetric
              value={`~${ESTIMATED_PLAYS_PER_WEEK.toLocaleString("en-US")}`}
              label="plays per week"
            />
          </div>
        </div>

        <p className="border-t border-white/10 px-7 py-4 text-xs leading-5 text-slate-400 sm:px-9">
          Play counts are estimates based on the current scheduled rotation and
          operating hours. Actual totals may vary because of maintenance,
          interruptions or schedule changes and are not proof-of-play reports.
        </p>
      </div>
    </section>
  );
}

export function DigitalPlayEstimateInline() {
  return (
    <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-sky-700">
        Estimated Ad Plays
      </p>

      <p className="mt-2 text-xl font-black text-[#071226]">
        Approximately {ESTIMATED_PLAYS_PER_DAY.toLocaleString("en-US")} plays per day
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-600">
        About once every {DIGITAL_ROTATION_LABEL}, from {DIGITAL_SCREEN_START_TIME} to {DIGITAL_SCREEN_END_TIME} daily. Estimate only; actual totals may vary.
      </p>
    </div>
  );
}

function PlayMetric({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent
          ? "border-orange-400 bg-orange-500"
          : "border-white/10 bg-white/[0.06]"
      }`}
    >
      <p className="text-3xl font-black">
        {value}
      </p>

      <p
        className={`mt-1 text-sm font-bold ${
          accent
            ? "text-white"
            : "text-slate-300"
        }`}
      >
        {label}
      </p>
    </div>
  );
}
