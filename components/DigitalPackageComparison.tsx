import Link from "next/link";

import {
  DIGITAL_COMMERCIAL_ROTATION_SECONDS,
  DIGITAL_PREMIUM_SLOT_CAPACITY,
  DIGITAL_STANDARD_SLOT_CAPACITY,
  ESTIMATED_PLAYS_PER_DAY,
} from "@/lib/digital-play-frequency";
import {
  packagesByType,
  type PublicDigitalPackage,
} from "@/lib/public-pricing";

type DigitalPackageComparisonProps = {
  packages:
    PublicDigitalPackage[];
};

function packageTerms(
  packages:
    PublicDigitalPackage[]
) {
  return packages
    .map(
      (item) =>
        item.duration_label
    )
    .filter(
      (
        label
      ): label is string =>
        Boolean(label)
    )
    .join(
      ", "
    );
}

export default function DigitalPackageComparison({
  packages,
}: DigitalPackageComparisonProps) {
  const standardPackages =
    packagesByType(
      packages,
      "standard"
    );

  const premiumPackages =
    packagesByType(
      packages,
      "premium"
    );

  const standardDuration =
    standardPackages[0]
      ?.slot_duration_seconds ??
    10;

  const premiumDuration =
    premiumPackages[0]
      ?.slot_duration_seconds ??
    15;

  const rows = [
    {
      feature:
        "Ad duration",
      standard:
        `${standardDuration} seconds`,
      premium:
        `${premiumDuration} seconds`,
    },
    {
      feature:
        "Estimated plays",
      standard:
        `Approximately ${ESTIMATED_PLAYS_PER_DAY.toLocaleString("en-US")} per day`,
      premium:
        `Approximately ${ESTIMATED_PLAYS_PER_DAY.toLocaleString("en-US")} per day`,
    },
    {
      feature:
        "Available terms",
      standard:
        packageTerms(
          standardPackages
        ) ||
        "View live packages",
      premium:
        packageTerms(
          premiumPackages
        ) ||
        "View live packages",
    },
    {
      feature:
        "Campaign availability",
      standard:
        "Checked online by date",
      premium:
        "Checked online by date",
    },
    {
      feature:
        "Maximum advertiser inventory",
      standard:
        `${DIGITAL_STANDARD_SLOT_CAPACITY} independent Standard slots`,
      premium:
        `${DIGITAL_PREMIUM_SLOT_CAPACITY} independent Premium slots`,
    },
    {
      feature:
        "Campaign start",
      standard:
        "Monday at 9:00 AM",
      premium:
        "Monday at 9:00 AM",
    },
    {
      feature:
        "Best for",
      standard:
        "Cost-conscious visibility and concise messages",
      premium:
        "Higher-impact campaigns needing more message time",
    },
  ];

  return (
    <section className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
            Standard vs Premium
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Choose the amount of screen time your message needs.
          </h2>

          <p className="mt-4 leading-7 text-slate-500">
            Standard is a strong entry point for clear, concise advertising.
            Premium gives your campaign five additional seconds for more
            visuals, information or storytelling.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="hidden grid-cols-[.8fr_1fr_1fr] bg-[#071226] text-white md:grid">
            <div className="p-5 text-sm font-extrabold uppercase tracking-[0.12em] text-slate-400">
              Feature
            </div>

            <div className="border-l border-white/10 p-5 text-xl font-black">
              Standard

              <span className="ml-2 text-sm font-bold text-sky-400">
                10 seconds
              </span>
            </div>

            <div className="border-l border-white/10 p-5 text-xl font-black">
              Premium

              <span className="ml-2 text-sm font-bold text-orange-400">
                15 seconds
              </span>
            </div>
          </div>

          <div>
            {rows.map(
              (
                row,
                index
              ) => (
                <div
                  key={
                    row.feature
                  }
                  className={`grid gap-4 p-5 md:grid-cols-[.8fr_1fr_1fr] md:gap-0 ${
                    index >
                    0
                      ? "border-t border-slate-200"
                      : ""
                  }`}
                >
                  <p className="font-black text-slate-800">
                    {row.feature}
                  </p>

                  <div className="rounded-2xl bg-sky-50 p-4 md:rounded-none md:border-l md:border-slate-200 md:bg-transparent md:px-5 md:py-0">
                    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-sky-700 md:hidden">
                      Standard
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600 md:mt-0">
                      {row.standard}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-orange-50 p-4 md:rounded-none md:border-l md:border-slate-200 md:bg-transparent md:px-5 md:py-0">
                    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-orange-700 md:hidden">
                      Premium
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600 md:mt-0">
                      {row.premium}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sm leading-6 text-slate-600">
          Standard and Premium are separate inventory categories. At full
          advertiser capacity, their combined commercial portion is {" "}
          <strong className="text-[#071226]">
            {DIGITAL_COMMERCIAL_ROTATION_SECONDS} seconds
          </strong>
          . Dedicated Shoutout, promotional and internal content remains
          reserved separately and is not sold as extra Standard or Premium
          inventory.
        </div>

        <div className="mt-8 grid gap-5 rounded-[2rem] bg-[#071226] p-6 text-white sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-400">
              Digital + Static Combos
            </p>

            <h3 className="mt-2 text-2xl font-black">
              Build an exact combo using live package prices.
            </h3>

            <p className="mt-3 max-w-3xl leading-7 text-slate-300">
              Choose an actual static billboard below to compare a Premium
              Digital campaign with eligible 3, 6 or 12-month static-rental
              savings.
            </p>
          </div>

          <Link
            href="#combo-packages"
            className="inline-flex w-fit rounded-xl bg-orange-500 px-5 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
          >
            Build a Combo ↓
          </Link>
        </div>
      </div>
    </section>
  );
}
