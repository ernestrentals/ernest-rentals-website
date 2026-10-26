import Link from "next/link";

import {
  formatXcd,
  monthlyPackagePrice,
  packagesByType,
  type PublicDigitalPackage,
} from "@/lib/public-pricing";

type DigitalPricingCardsProps = {
  packages:
    PublicDigitalPackage[];
};

type PackageCardProps = {
  title:
    string;
  duration:
    string;
  description:
    string;
  packages:
    PublicDigitalPackage[];
  premium?:
    boolean;
};

function PackageCard({
  title,
  duration,
  description,
  packages,
  premium = false,
}: PackageCardProps) {
  const weeklyStartingPrice =
    packages.find(
      (item) =>
        item.duration_unit ===
          "week" &&
        item.duration_value ===
          1
    )?.price ?? null;

  return (
    <article
      className={
        premium
          ? "relative overflow-hidden rounded-[2rem] border-2 border-orange-400 bg-[#071226] p-6 text-white shadow-xl sm:p-8"
          : "rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      }
    >
      {premium ? (
        <span className="absolute right-5 top-5 rounded-full bg-orange-500 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white">
          More Screen Time
        </span>
      ) : null}

      <p
        className={`text-xs font-extrabold uppercase tracking-[0.18em] ${
          premium
            ? "text-orange-400"
            : "text-sky-600"
        }`}
      >
        {duration}
      </p>

      <h3 className="mt-3 text-3xl font-black">
        {title}
      </h3>

      {weeklyStartingPrice !==
      null ? (
        <p
          className={`mt-2 text-sm font-extrabold ${
            premium
              ? "text-orange-300"
              : "text-sky-700"
          }`}
        >
          Starting at {formatXcd(
            weeklyStartingPrice
          )} per week
        </p>
      ) : null}

      <p
        className={`mt-3 max-w-xl leading-7 ${
          premium
            ? "text-slate-300"
            : "text-slate-500"
        }`}
      >
        {description}
      </p>

      {packages.length >
      0 ? (
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {packages.map(
            (item) => {
              const monthlyPrice =
                monthlyPackagePrice(
                  item
                );

              return (
                <div
                  key={
                    item.package_id
                  }
                  className={
                    premium
                      ? "rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                      : "rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  }
                >
                  <p
                    className={`text-sm font-extrabold ${
                      premium
                        ? "text-slate-200"
                        : "text-slate-600"
                    }`}
                  >
                    {item.duration_label ??
                      item.package_name}
                  </p>

                  {monthlyPrice !==
                  null ? (
                    <>
                      <p className="mt-3 text-2xl font-black text-orange-500 sm:text-3xl">
                        {formatXcd(
                          monthlyPrice,
                          2
                        )}

                        <span className="ml-1 text-sm font-bold text-slate-400">
                          / month
                        </span>
                      </p>

                      <p
                        className={`mt-2 text-xs ${
                          premium
                            ? "text-slate-400"
                            : "text-slate-500"
                        }`}
                      >
                        Total commitment: {formatXcd(
                          item.price
                        )}
                      </p>
                    </>
                  ) : (
                    <p className="mt-3 text-2xl font-black text-orange-500">
                      {formatXcd(
                        item.price
                      )}
                    </p>
                  )}
                </div>
              );
            }
          )}
        </div>
      ) : (
        <p
          className={`mt-7 rounded-2xl border p-4 text-sm leading-6 ${
            premium
              ? "border-white/10 bg-white/[0.06] text-slate-300"
              : "border-slate-200 bg-slate-50 text-slate-500"
          }`}
        >
          Live pricing is temporarily unavailable. Contact Sales for the
          current package options.
        </p>
      )}

      <Link
        href="/?type=digital#availability"
        className={`mt-7 inline-flex rounded-xl px-5 py-3.5 font-extrabold transition ${
          premium
            ? "bg-orange-500 text-white hover:bg-orange-600"
            : "bg-[#071226] text-white hover:bg-orange-600"
        }`}
      >
        Choose {title}
      </Link>
    </article>
  );
}

export default function DigitalPricingCards({
  packages,
}: DigitalPricingCardsProps) {
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

  const shoutoutPackages =
    packagesByType(
      packages,
      "shoutout"
    );

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <PackageCard
          title="Standard"
          duration="10-Second Digital Slot"
          description="A strong entry-level package for clear brand awareness, promotions and recurring messages."
          packages={
            standardPackages
          }
        />

        <PackageCard
          title="Premium"
          duration="15-Second Digital Slot"
          description="More screen time for campaigns that need additional room for visuals, details or a longer message."
          packages={
            premiumPackages
          }
          premium
        />
      </div>

      <article className="mt-8 rounded-[2rem] border border-sky-200 bg-sky-50 p-6 sm:p-8">
        <div className="grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-700">
              Premium Shoutout
            </p>

            <h3 className="mt-3 text-3xl font-black">
              Special messages from {formatXcd(
                shoutoutPackages.length >
                  0
                  ? Math.min(
                      ...shoutoutPackages.map(
                        (item) =>
                          item.price
                      )
                    )
                  : 150
              )} per day.
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              A 15-second option for birthdays, congratulations,
              announcements, grand openings, special events and short
              promotional messages.
            </p>

            <Link
              href="/?type=digital#availability"
              className="mt-6 inline-flex rounded-xl bg-[#071226] px-5 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
            >
              Book a Shoutout
            </Link>
          </div>

          {shoutoutPackages.length >
          0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {shoutoutPackages.map(
                (item) => (
                  <div
                    key={
                      item.package_id
                    }
                    className="rounded-2xl border border-sky-200 bg-white p-4"
                  >
                    <p className="text-sm font-extrabold text-slate-600">
                      {item.duration_label ??
                        item.package_name}
                    </p>

                    <p className="mt-2 text-2xl font-black text-sky-700">
                      {formatXcd(
                        item.price
                      )}
                    </p>

                    {item.includes_ad_creation ? (
                      <p className="mt-2 text-xs font-bold text-orange-600">
                        Includes ad creation
                      </p>
                    ) : null}
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="rounded-2xl border border-sky-200 bg-white p-5 text-sm leading-6 text-slate-500">
              Live Shoutout pricing is temporarily unavailable. Contact Sales
              for current options.
            </p>
          )}
        </div>
      </article>
    </>
  );
}
