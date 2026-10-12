"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  calculateCombo,
  COMBO_DISCOUNT_BY_TERM,
  formatDiscount,
  type ComboTerm,
} from "@/lib/combo-packages";
import {
  formatXcd,
  packagesByType,
  type PublicBillboard,
  type PublicDigitalPackage,
  type PublicStaticPackage,
} from "@/lib/public-pricing";

type ComboPackageBuilderProps = {
  digitalPackages:
    PublicDigitalPackage[];
  staticPackages:
    PublicStaticPackage[];
  billboards:
    PublicBillboard[];
};

const comboTerms:
  ComboTerm[] = [
  3,
  6,
  12,
];

function packageForTerm<
  T extends {
    duration_unit:
      string | null;
    duration_value:
      number | null;
  },
>(
  packages: T[],
  term: ComboTerm
) {
  return packages.find(
    (item) =>
      item.duration_unit ===
        "month" &&
      item.duration_value ===
        term
  ) ?? null;
}

export default function ComboPackageBuilder({
  digitalPackages,
  staticPackages,
  billboards,
}: ComboPackageBuilderProps) {
  const [
    selectedBillboardId,
    setSelectedBillboardId,
  ] = useState("");

  const premiumPackages =
    useMemo(
      () =>
        packagesByType(
          digitalPackages,
          "premium"
        ),
      [
        digitalPackages,
      ]
    );

  const staticBillboards =
    useMemo(
      () =>
        billboards
          .filter(
            (item) =>
              item.billboard_type
                .trim()
                .toLowerCase() ===
              "static"
          )
          .filter(
            (item) =>
              staticPackages.some(
                (adPackage) =>
                  adPackage.billboard_id ===
                  item.billboard_id
              )
          )
          .sort(
            (a, b) =>
              a.billboard_name.localeCompare(
                b.billboard_name
              )
          ),
      [
        billboards,
        staticPackages,
      ]
    );

  const selectedBillboard =
    staticBillboards.find(
      (item) =>
        item.billboard_id ===
        selectedBillboardId
    ) ?? null;

  return (
    <section
      id="combo-packages"
      className="bg-white px-5 py-16 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
              Digital + Static Combo Packages
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Combine Digital + Static.
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Extend your reach with the flexibility of Premium Digital
              advertising and the continuous visibility of a static
              billboard. Choose an eligible static location to calculate an
              exact estimate from the live package catalogue.
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-extrabold">
              <span className="rounded-full bg-orange-50 px-3 py-2 text-orange-700">
                15-second Premium Digital ad
              </span>
              <span className="rounded-full bg-sky-50 px-3 py-2 text-sky-700">
                Continuous static visibility
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">
                Live package pricing
              </span>
            </div>
          </div>

          <div
            id="combo-location"
            className="rounded-3xl border border-sky-200 bg-sky-50 p-5"
          >
            <label
              htmlFor="combo-billboard"
              className="text-sm font-black text-[#071226]"
            >
              Choose a static billboard
            </label>

            <select
              id="combo-billboard"
              value={
                selectedBillboardId
              }
              onChange={
                (event) =>
                  setSelectedBillboardId(
                    event.target.value
                  )
              }
              className="mt-2 w-full rounded-xl border border-sky-200 bg-white px-4 py-3 font-semibold text-slate-700 outline-none focus:border-sky-500"
            >
              <option value="">
                Select a location for exact pricing
              </option>

              {staticBillboards.map(
                (billboard) => (
                  <option
                    key={
                      billboard.billboard_id
                    }
                    value={
                      billboard.billboard_id
                    }
                  >
                    {billboard.billboard_name}
                    {billboard.location
                      ? ` — ${billboard.location}`
                      : ""}
                  </option>
                )
              )}
            </select>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Static billboard prices vary by location. Availability is
              confirmed before your campaign is booked.
            </p>
          </div>
        </div>

        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {comboTerms.map(
            (term) => {
              const premiumPackage =
                packageForTerm(
                  premiumPackages,
                  term
                );

              const staticPackage =
                selectedBillboard
                  ? packageForTerm(
                      staticPackages.filter(
                        (item) =>
                          item.billboard_id ===
                          selectedBillboard.billboard_id
                      ),
                      term
                    )
                  : null;

              const calculation =
                premiumPackage &&
                staticPackage
                  ? calculateCombo({
                      term,
                      premiumDigitalTotal:
                        Number(
                          premiumPackage.price
                        ),
                      staticRentalTotal:
                        Number(
                          staticPackage.price
                        ),
                    })
                  : null;

              const discount =
                COMBO_DISCOUNT_BY_TERM[
                  term
                ];

              const comboUrl =
                calculation &&
                premiumPackage &&
                staticPackage &&
                selectedBillboard
                  ? `/billboards/${selectedBillboard.billboard_id}?comboTerm=${term}&comboDigitalPackageId=${encodeURIComponent(
                      premiumPackage.package_id
                    )}&comboStaticPackageId=${encodeURIComponent(
                      staticPackage.package_id
                    )}`
                  : null;

              return (
                <article
                  key={
                    term
                  }
                  className={
                    term === 12
                      ? "relative overflow-hidden rounded-[2rem] border-2 border-orange-400 bg-[#071226] p-6 text-white shadow-xl"
                      : "rounded-[2rem] border border-slate-200 bg-[#f8fafc] p-6 shadow-sm"
                  }
                >
                  {term ===
                  12 ? (
                    <span className="absolute right-5 top-5 rounded-full bg-orange-500 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white">
                      Highest Static Savings
                    </span>
                  ) : null}

                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-orange-500">
                    {term}-Month Combo
                  </p>

                  <h3 className="mt-3 text-2xl font-black">
                    Premium Digital + Static
                  </h3>

                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Premium Digital
                      </p>

                      {premiumPackage ? (
                        <>
                          <p className="mt-1 text-xl font-black text-sky-500">
                            {formatXcd(
                              Number(
                                premiumPackage.price
                              ) /
                                term,
                              2
                            )}
                            <span className="ml-1 text-xs font-bold text-slate-400">
                              / month
                            </span>
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {formatXcd(
                              Number(
                                premiumPackage.price
                              )
                            )} contract total
                          </p>
                        </>
                      ) : (
                        <p className="mt-1 text-sm text-slate-500">
                          Contact Sales for current Premium pricing.
                        </p>
                      )}
                    </div>

                    <div className="border-t border-slate-200/20 pt-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Static billboard
                      </p>

                      {calculation ? (
                        <>
                          <p className="mt-1 font-black">
                            {formatXcd(
                              calculation.staticRentalTotal
                            )} before discount
                          </p>

                          <p className="mt-1 text-sm font-extrabold text-emerald-500">
                            Save {formatDiscount(
                              discount
                            )} · {formatXcd(
                              calculation.staticSavings,
                              2
                            )}
                          </p>

                          <p className="mt-1 text-sm text-slate-400">
                            Discounted static rental: {formatXcd(
                              calculation.discountedStaticRental,
                              2
                            )}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="mt-1 font-black">
                            Price varies by location
                          </p>

                          <p className="mt-1 text-sm font-extrabold text-emerald-500">
                            Save {formatDiscount(
                              discount
                            )} on eligible static rental
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {calculation ? (
                    <div className="mt-6 rounded-2xl bg-orange-500 p-4 text-[#071226]">
                      <p className="text-xs font-extrabold uppercase tracking-wide">
                        Estimated Combo Total
                      </p>

                      <p className="mt-1 text-3xl font-black">
                        {formatXcd(
                          calculation.comboTotal,
                          2
                        )}
                      </p>

                      <p className="mt-1 text-xs font-bold text-[#071226]/70">
                        {formatXcd(
                          calculation.effectiveMonthlyValue,
                          2
                        )} effective monthly value
                      </p>
                    </div>
                  ) : null}

                  {comboUrl ? (
                    <Link
                      href={
                        comboUrl
                      }
                      className="mt-6 inline-flex w-full justify-center rounded-xl bg-orange-500 px-5 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
                    >
                      Build My Combo
                    </Link>
                  ) : (
                    <a
                      href="#combo-location"
                      className="mt-6 inline-flex w-full justify-center rounded-xl border border-slate-300 px-5 py-3.5 font-extrabold text-slate-600 transition hover:border-orange-400 hover:text-orange-600"
                    >
                      Choose a Static Billboard
                    </a>
                  )}
                </article>
              );
            }
          )}
        </div>

        <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="text-lg font-black text-[#071226]">
            Combo eligibility
          </h3>

          <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600 md:grid-cols-2">
            <li>• Premium Digital must be included for the same 3, 6 or 12-month commitment.</li>
            <li>• The discount applies only to eligible static billboard rental.</li>
            <li>• Printing, installation, artwork, production, electricity and third-party costs are not discounted.</li>
            <li>• Both advertising placements remain subject to availability and final campaign confirmation.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
