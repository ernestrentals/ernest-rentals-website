import Link from "next/link";

import {
  createClient,
} from "@supabase/supabase-js";

import AvailabilitySearch from "@/components/AvailabilitySearch";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const revalidate =
  300;

type PublicBillboard = {
  billboard_id: string;
  billboard_code: string;
  billboard_name: string;
  location: string | null;
  billboard_type: string;
  image_url: string | null;
};

type LocationCard = {
  name: string;
  subtitle: string;
  href: string;

  detailsHref:
    string;

  imageMatchTerms:
    string[];

  imageUrl?:
    string | null;

  featuredBillboard?:
    PublicBillboard | null;
};

const locationCards:
  LocationCard[] = [
  {
    name:
      "Dennery",

    subtitle:
      "Anse Canot & Dennery Valley",

    href:
      "/?location=Dennery#availability",

    detailsHref:
      "/locations/dennery",

    imageMatchTerms: [
      "dennery",
      "anse canot",
      "anse cannot",
    ],
  },

  {
    name:
      "Mamiku",

    subtitle:
      "Micoud",

    href:
      "/?location=Mamiku#availability",

    detailsHref:
      "/locations/mamiku",

    imageMatchTerms: [
      "mamiku",
    ],
  },

  {
    name:
      "Mon Repos",

    subtitle:
      "Micoud",

    href:
      "/?location=Mon%20Repos#availability",

    detailsHref:
      "/locations/mon-repos",

    imageMatchTerms: [
      "mon repos",
      "mon-repos",
    ],
  },

  {
    name:
      "Praslin",

    subtitle:
      "Micoud",

    href:
      "/?location=Praslin#availability",

    detailsHref:
      "/locations/praslin",

    imageMatchTerms: [
      "praslin",
    ],
  },

  {
    name:
      "Piaye",

    subtitle:
      "Choiseul",

    href:
      "/?location=Piaye#availability",

    detailsHref:
      "/locations/piaye",

    imageMatchTerms: [
      "piaye",
    ],
  },

  {
    name:
      "Richford",

    subtitle:
      "Dennery Valley",

    href:
      "/?location=Richford#availability",

    detailsHref:
      "/locations/richford",

    imageMatchTerms: [
      "richford",
    ],
  },
];

function normalizeText(
  value:
    | string
    | null
    | undefined
) {
  return (
    value ??
    ""
  )
    .toLowerCase()
    .replace(
      /[-_/]/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}

function billboardMatchesLocation(
  billboard:
    PublicBillboard,

  location:
    LocationCard
) {
  if (
    normalizeText(
      billboard.billboard_type
    ) !==
    "static"
  ) {
    return false;
  }

  const searchable =
    normalizeText(
      [
        billboard.location,
        billboard.billboard_name,
        billboard.billboard_code,
      ]
        .filter(
          Boolean
        )
        .join(
          " "
        )
    );

  return location.imageMatchTerms.some(
    (
      term
    ) =>
      searchable.includes(
        normalizeText(
          term
        )
      )
  );
}

function getFeaturedBillboard(
  location:
    LocationCard,

  billboards:
    PublicBillboard[]
) {
  return (
    billboards.find(
      (
        billboard
      ) =>
        billboardMatchesLocation(
          billboard,
          location
        ) &&
        Boolean(
          billboard.image_url
        )
    ) ??
    null
  );
}

async function getLocationCards() {
  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env
      .NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl ||
    !supabaseKey
  ) {
    console.error(
      "Homepage location images: Supabase public configuration is missing."
    );

    return locationCards.map(
      (
        location
      ) => ({
        ...location,

        imageUrl:
          null,

        featuredBillboard:
          null,
      })
    );
  }

  const supabase =
    createClient(
      supabaseUrl,
      supabaseKey
    );

  const {
    data,
    error,
  } =
    await supabase.rpc(
      "get_public_location_billboards"
    );

  if (
    error
  ) {
    console.error(
      "Unable to load homepage location billboard images:",
      error
    );

    return locationCards.map(
      (
        location
      ) => ({
        ...location,

        imageUrl:
          null,

        featuredBillboard:
          null,
      })
    );
  }

  const billboards =
    (
      data ??
      []
    ) as PublicBillboard[];

  return locationCards.map(
    (
      location
    ) => {
      const featuredBillboard =
        getFeaturedBillboard(
          location,
          billboards
        );

      return {
        ...location,

        imageUrl:
          featuredBillboard
            ?.image_url ??
          null,

        featuredBillboard,
      };
    }
  );
}

export default async function Home() {
  const locations =
    await getLocationCards();

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#071226]">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#071226] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-orange-500/25 blur-3xl" />

          <div className="absolute right-0 top-0 h-[28rem] w-[28rem] rounded-full bg-sky-500/20 blur-3xl" />

          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020817]/60 to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-orange-400" />

              <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-200">
                Saint Lucia Outdoor Advertising
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Billboard &amp; Outdoor Advertising

              <span className="block bg-gradient-to-r from-orange-400 via-orange-500 to-sky-400 bg-clip-text text-transparent">
                in Saint Lucia.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Get your brand seen with strategically located static and digital
              billboards across Saint Lucia. Search billboard locations, compare
              advertising options, check availability and start your campaign
              online.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#availability"
                className="rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
              >
                Search Billboards
              </Link>

              <Link
                href="/locations"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-extrabold text-white transition hover:bg-white/10"
              >
                Explore Billboard Locations
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 border-t border-white/10 pt-6">
              <Link
                href="/billboards"
                className="group"
              >
                <p className="text-xl font-black transition group-hover:text-orange-400 sm:text-2xl">
                  Static
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                  3, 6 &amp; 12-month rentals
                </p>
              </Link>

              <Link
                href="/digital-screens"
                className="group"
              >
                <p className="text-xl font-black transition group-hover:text-orange-400 sm:text-2xl">
                  Digital
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                  10s &amp; 15s ad slots
                </p>
              </Link>

              <Link
                href="/#availability"
                className="group"
              >
                <p className="text-xl font-black transition group-hover:text-orange-400 sm:text-2xl">
                  Live
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                  Availability by date
                </p>
              </Link>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-xl">
              <div className="absolute -inset-4 rounded-[2.25rem] bg-gradient-to-br from-orange-500/20 to-sky-500/20 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur">
                <div className="rounded-[1.5rem] bg-gradient-to-br from-orange-400 via-orange-500 to-sky-500 p-[2px]">
                  <div className="rounded-[1.4rem] bg-[#020817] p-7 sm:p-9">
                    <div className="flex items-center gap-4">
                      <img
                        src="/ernest-rentals-logo.png"
                        alt="Ernest Rentals billboard advertising in Saint Lucia"
                        className="h-14 w-14 object-contain"
                      />

                      <div>
                        <p className="text-xl font-black sm:text-2xl">
                          ERNEST RENTALS
                        </p>

                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                          Outdoor Advertising
                        </p>
                      </div>
                    </div>

                    <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-400">
                        Your Brand Here
                      </p>

                      <p className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                        Own the Visibility.

                        <span className="block text-sky-400">
                          Own the Location.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE SEARCH */}
      <AvailabilitySearch />

      {/* QUICK VALUE */}
      <section className="px-5 py-10 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            [
              "Live Billboard Inventory",
              "Search your preferred campaign dates and see which billboard locations are available.",
            ],

            [
              "Static & Digital Packages",
              "Compare long-term static billboard rentals and flexible digital advertising options.",
            ],

            [
              "Simple Campaign Request",
              "Choose a billboard and send your advertising campaign details online.",
            ],
          ].map(
            (
              [
                title,
                body,
              ]
            ) => (
              <div
                key={
                  title
                }
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="h-1 w-10 rounded-full bg-gradient-to-r from-orange-500 to-sky-500" />

                <p className="mt-4 text-lg font-black">
                  {
                    title
                  }
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {
                    body
                  }
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* FORMAT CHOICE */}
      <section
        id="billboards"
        className="px-5 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
                Billboard Advertising Options
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Static &amp; digital billboard advertising in Saint Lucia.
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
                Choose long-term static roadside advertising or flexible digital
                billboard campaigns. Both options help put your brand in front
                of motorists and communities across Saint Lucia.
              </p>
            </div>

            <Link
              href="/billboards"
              className="hidden rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 transition hover:border-orange-300 hover:text-orange-600 lg:inline-flex"
            >
              Explore Billboard Advertising →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* STATIC */}
            <article className="group relative overflow-hidden rounded-[2rem] bg-[#071226] p-8 text-white shadow-[0_20px_60px_rgba(7,18,38,0.18)] lg:p-10">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />

              <div className="absolute right-8 top-10 h-28 w-28 rounded-full border border-white/10" />

              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-orange-500/15 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-orange-300">
                    Static Billboards
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300">
                    3 / 6 / 12 Months
                  </span>
                </div>

                <div className="mt-10 grid items-end gap-8 sm:grid-cols-[1fr_180px]">
                  <div>
                    <h3 className="text-4xl font-black leading-[1.05] sm:text-5xl">
                      Long-term roadside

                      <span className="block text-orange-400">
                        visibility.
                      </span>
                    </h3>

                    <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
                      Static billboard advertising is ideal for brands that want
                      uninterrupted visibility in a high-exposure Saint Lucia
                      location over a longer campaign period.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-slate-300">
                      <span className="rounded-full bg-white/5 px-3 py-2">
                        Fixed location
                      </span>

                      <span className="rounded-full bg-white/5 px-3 py-2">
                        Long-term exposure
                      </span>

                      <span className="rounded-full bg-white/5 px-3 py-2">
                        Roadside impact
                      </span>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="rounded-xl bg-gradient-to-br from-orange-500 to-orange-300 p-[2px]">
                        <div className="rounded-[10px] bg-[#020817] p-4 text-center">
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-300">
                            Your Brand
                          </p>

                          <p className="mt-3 text-lg font-black">
                            HERE
                          </p>
                        </div>
                      </div>

                      <div className="mx-auto h-8 w-2 bg-slate-600" />

                      <div className="mx-auto h-2 w-20 rounded-full bg-slate-600" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/?type=static#availability"
                    className="rounded-xl bg-orange-500 px-5 py-3 font-extrabold text-white transition hover:bg-orange-600"
                  >
                    Search Static Billboards
                  </Link>

                  <Link
                    href="/billboards"
                    className="rounded-xl border border-white/15 px-5 py-3 font-extrabold text-white transition hover:bg-white/10"
                  >
                    Learn About Static Billboards
                  </Link>
                </div>
              </div>
            </article>

            {/* DIGITAL */}
            <article
              id="digital"
              className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-400 via-orange-500 to-[#ff6a00] p-8 text-[#071226] shadow-[0_20px_60px_rgba(245,130,32,0.18)] lg:p-10"
            >
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-[#071226]/10" />

              <div className="absolute right-8 top-10 h-28 w-28 rounded-full border border-[#071226]/10" />

              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-white/50 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em]">
                    Digital Billboard Advertising
                  </span>

                  <span className="rounded-full border border-[#071226]/10 bg-white/30 px-3 py-1.5 text-xs font-black">
                    10s &amp; 15s Slots
                  </span>
                </div>

                <div className="mt-10 grid items-end gap-8 sm:grid-cols-[1fr_180px]">
                  <div>
                    <h3 className="text-4xl font-black leading-[1.05] sm:text-5xl">
                      Flexible digital

                      <span className="block text-white">
                        advertising.
                      </span>
                    </h3>

                    <p className="mt-5 max-w-lg text-sm leading-7 text-[#071226]/75 sm:text-base">
                      Digital billboard advertising is ideal for brands that
                      want rotating messages, shorter campaign commitments and
                      more creative flexibility.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2 text-xs font-black text-[#071226]/75">
                      <span className="rounded-full bg-white/35 px-3 py-2">
                        Rotating ads
                      </span>

                      <span className="rounded-full bg-white/35 px-3 py-2">
                        10s &amp; 15s slots
                      </span>

                      <span className="rounded-full bg-white/35 px-3 py-2">
                        Flexible campaigns
                      </span>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <div className="rounded-2xl border border-[#071226]/10 bg-white/20 p-4">
                      <div className="rounded-xl bg-[#071226] p-4 text-center text-white shadow-lg">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-300">
                          Now Showing
                        </p>

                        <p className="mt-3 text-lg font-black">
                          YOUR AD
                        </p>

                        <div className="mx-auto mt-4 h-1.5 w-16 rounded-full bg-orange-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/?type=digital#availability"
                    className="rounded-xl bg-[#071226] px-5 py-3 font-extrabold text-white transition hover:bg-[#0b1a36]"
                  >
                    Search Digital Screens
                  </Link>

                  <Link
                    href="/digital-screens"
                    className="rounded-xl border border-[#071226]/15 bg-white/20 px-5 py-3 font-extrabold transition hover:bg-white/35"
                  >
                    Learn About Digital Billboards
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section
        id="locations"
        className="bg-white px-5 py-16 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-2xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sky-600">
                Billboard Locations Across Saint Lucia
              </p>

              <h2 className="mt-2 text-4xl font-black tracking-tight">
                Explore billboard advertising locations.
              </h2>

              <p className="mt-3 leading-7 text-slate-500">
                Browse outdoor advertising opportunities in key communities
                across Saint Lucia and search availability for your preferred
                campaign dates.
              </p>
            </div>

            <Link
              href="/locations"
              className="font-extrabold text-sky-600 transition hover:text-orange-600"
            >
              View All Billboard Locations →
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map(
              (
                item,
                index
              ) => (
                <article
                  key={
                    item.name
                  }
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-[#f8fafc] transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:bg-white hover:shadow-xl"
                >
                  {/* PHOTO */}
                  <Link
                    href={
                      item.detailsHref
                    }
                    className="relative block h-44 overflow-hidden bg-slate-200"
                  >
                    {item.imageUrl ? (
                      <>
                        <img
                          src={
                            item.imageUrl
                          }
                          alt={`${item.name} billboard advertising location in Saint Lucia`}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#071226]/75 via-[#071226]/10 to-transparent" />

                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                          <div>
                            <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-orange-300">
                              Location{" "}
                              {String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </p>

                            <p className="mt-1 text-xl font-black text-white">
                              {
                                item.name
                              }
                            </p>
                          </div>

                          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-lg text-white backdrop-blur transition group-hover:bg-orange-500">
                            ↗
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#071226,#12233f)] p-6 text-center">
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-400">
                            Ernest Rentals
                          </p>

                          <p className="mt-2 text-sm font-bold text-slate-300">
                            Billboard photo coming soon
                          </p>
                        </div>
                      </div>
                    )}
                  </Link>

                  {/* CONTENT */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={
                            item.detailsHref
                          }
                          className="text-xl font-black transition hover:text-orange-500"
                        >
                          {
                            item.name
                          }
                        </Link>

                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {
                            item.subtitle
                          }
                        </p>
                      </div>

                      <span className="rounded-full bg-white px-3 py-1 text-[9px] font-extrabold uppercase tracking-wide text-slate-500 shadow-sm">
                        Static
                      </span>
                    </div>

                    {item.featuredBillboard && (
                      <p className="mt-4 truncate text-xs font-semibold text-slate-400">
                        Featured:{" "}
                        {
                          item
                            .featuredBillboard
                            .billboard_name
                        }
                      </p>
                    )}

                    <div className="mt-5 flex gap-2">
                      <Link
                        href={
                          item.href
                        }
                        className="flex-1 rounded-xl bg-[#071226] px-4 py-2.5 text-center text-xs font-extrabold text-white transition hover:bg-orange-500"
                      >
                        Check Availability
                      </Link>

                      <Link
                        href={
                          item.detailsHref
                        }
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-700 transition hover:border-orange-200 hover:text-orange-600"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="px-5 py-16 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
              Simple Advertising Process
            </p>

            <h2 className="mt-2 text-4xl font-black tracking-tight">
              From billboard search to campaign request.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              [
                "01",
                "Search",
                "Choose a Saint Lucia location, billboard type and campaign dates.",
              ],

              [
                "02",
                "Compare",
                "Review live availability, billboard details and advertising packages.",
              ],

              [
                "03",
                "Request",
                "Send your contact and campaign information online.",
              ],

              [
                "04",
                "Confirm",
                "Ernest Rentals reviews your campaign request and coordinates the next steps.",
              ],
            ].map(
              (
                [
                  number,
                  title,
                  body,
                ]
              ) => (
                <div
                  key={
                    number
                  }
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-sm font-black text-orange-500">
                    {
                      number
                    }
                  </p>

                  <p className="mt-5 text-xl font-black">
                    {
                      title
                    }
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {
                      body
                    }
                  </p>
                </div>
              )
            )}
          </div>

          <div className="mt-6">
            <Link
              href="/how-it-works"
              className="font-extrabold text-sky-600 transition hover:text-orange-600"
            >
              See How Billboard Advertising Works →
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#071226] px-7 py-10 text-white sm:px-10 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-400">
                Ready to advertise in Saint Lucia?
              </p>

              <h2 className="mt-2 max-w-2xl text-3xl font-black sm:text-4xl">
                Find the billboard that fits your campaign.
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                Search available static and digital billboard inventory and
                choose the location, campaign dates and advertising option that
                work for your brand.
              </p>
            </div>

            <Link
              href="/#availability"
              className="rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
            >
              Search Billboard Availability
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}