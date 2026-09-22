import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  createClient,
} from "@supabase/supabase-js";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const dynamic =
  "force-dynamic";

const siteUrl =
  process.env
    .NEXT_PUBLIC_SITE_URL ??
  "https://www.ernestrentals.com";

export const metadata:
  Metadata = {
  title:
    "Billboard Locations in Saint Lucia",

  description:
    "Explore Ernest Rentals billboard advertising locations across Saint Lucia, including Dennery, Mamiku, Mon Repos, Piaye, Praslin, Richford and Rodney Bay.",

  alternates: {
    canonical:
      "/locations",
  },

  openGraph: {
    title:
      "Billboard Locations in Saint Lucia | Ernest Rentals",

    description:
      "Explore static and digital billboard advertising locations across Saint Lucia and search live campaign availability.",

    url:
      "/locations",

    siteName:
      "Ernest Rentals",

    locale:
      "en_LC",

    type:
      "website",

    images: [
      {
        url:
          "/ernest-rentals-logo.png",

        width:
          256,

        height:
          256,

        alt:
          "Ernest Rentals billboard locations across Saint Lucia",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Billboard Locations in Saint Lucia | Ernest Rentals",

    description:
      "Explore static and digital billboard advertising locations across Saint Lucia.",

    images: [
      "/ernest-rentals-logo.png",
    ],
  },
};

type PublicBillboard = {
  billboard_id: string;
  billboard_code: string;
  billboard_name: string;
  location: string | null;
  billboard_type: string;
  image_url: string | null;
};

type LocationDefinition = {
  name: string;
  slug: string;
  area: string;
  description: string;
  search: string;
  type: string;

  billboardType:
    | "static"
    | "digital";

  imageMatchTerms:
    string[];
};

type LocationWithImage =
  LocationDefinition & {
    imageUrl:
      | string
      | null;

    featuredBillboard:
      | PublicBillboard
      | null;
  };

const locations:
  LocationDefinition[] = [
  {
    name:
      "Dennery",

    slug:
      "dennery",

    area:
      "Anse Canot, Dennery",

    description:
      "Static billboard advertising opportunities including V-Shape advertising faces.",

    search:
      "Dennery",

    type:
      "Static Billboard",

    billboardType:
      "static",

    imageMatchTerms: [
      "dennery",
      "anse canot",
      "anse cannot",
    ],
  },

  {
    name:
      "Mamiku",

    slug:
      "mamiku",

    area:
      "Mamiku, Micoud",

    description:
      "Static roadside billboard advertising along the east coast corridor.",

    search:
      "Mamiku",

    type:
      "Static Billboard",

    billboardType:
      "static",

    imageMatchTerms: [
      "mamiku",
    ],
  },

  {
    name:
      "Mon Repos",

    slug:
      "mon-repos",

    area:
      "Mon Repos, Micoud",

    description:
      "Static billboard advertising opportunities serving traffic through the Micoud area.",

    search:
      "Mon Repos",

    type:
      "Static Billboard",

    billboardType:
      "static",

    imageMatchTerms: [
      "mon repos",
      "mon-repos",
    ],
  },

  {
    name:
      "Piaye",

    slug:
      "piaye",

    area:
      "Piaye, Choiseul",

    description:
      "Large-format static billboard advertising in Saint Lucia's south-west corridor.",

    search:
      "Piaye",

    type:
      "Static Billboard",

    billboardType:
      "static",

    imageMatchTerms: [
      "piaye",
    ],
  },

  {
    name:
      "Praslin",

    slug:
      "praslin",

    area:
      "Praslin, Micoud",

    description:
      "V-Shape static billboard advertising with directional face options.",

    search:
      "Praslin",

    type:
      "Static Billboard",

    billboardType:
      "static",

    imageMatchTerms: [
      "praslin",
    ],
  },

  {
    name:
      "Richford",

    slug:
      "richford",

    area:
      "Richford, Dennery Valley",

    description:
      "Large-format static billboard advertising in the Dennery Valley area.",

    search:
      "Richford",

    type:
      "Static Billboard",

    billboardType:
      "static",

    imageMatchTerms: [
      "richford",
    ],
  },

  {
    name:
      "Rodney Bay",

    slug:
      "rodney-bay",

    area:
      "Rodney Bay, Gros Islet",

    description:
      "Digital billboard advertising inventory in one of Saint Lucia's busiest commercial areas.",

    search:
      "Rodney Bay",

    type:
      "Digital Billboard",

    billboardType:
      "digital",

    imageMatchTerms: [
      "rodney bay",
      "rodney",
    ],
  },
];

function createPublicServerClient() {
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
    return null;
  }

  return createClient(
    supabaseUrl,
    supabaseKey
  );
}

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
    LocationDefinition
) {
  if (
    normalizeText(
      billboard.billboard_type
    ) !==
    normalizeText(
      location.billboardType
    )
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
    LocationDefinition,

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

export default async function LocationsPage() {
  const supabase =
    createPublicServerClient();

  let publicBillboards:
    PublicBillboard[] = [];

  if (
    supabase
  ) {
    const {
      data:
        billboardRows,

      error:
        billboardError,
    } =
      await supabase.rpc(
        "get_public_location_billboards"
      );

    if (
      billboardError
    ) {
      console.error(
        "Unable to load location billboard images:",
        billboardError
      );
    } else {
      publicBillboards =
        (
          billboardRows ??
          []
        ) as PublicBillboard[];
    }
  } else {
    console.error(
      "Locations page: Supabase public configuration is missing."
    );
  }

  const locationsWithImages:
    LocationWithImage[] =
    locations.map(
      (
        location
      ) => {
        const featuredBillboard =
          getFeaturedBillboard(
            location,
            publicBillboards
          );

        return {
          ...location,

          featuredBillboard,

          imageUrl:
            featuredBillboard
              ?.image_url ??
            null,
        };
      }
    );

  const structuredData = {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "CollectionPage",

        "@id":
          `${siteUrl}/locations#webpage`,

        url:
          `${siteUrl}/locations`,

        name:
          "Billboard Locations in Saint Lucia",

        description:
          "Explore static and digital billboard advertising locations available through Ernest Rentals across Saint Lucia.",

        isPartOf: {
          "@id":
            `${siteUrl}/#website`,
        },

        about: {
          "@id":
            `${siteUrl}/#organization`,
        },

        mainEntity: {
          "@id":
            `${siteUrl}/locations#billboard-locations`,
        },

        breadcrumb: {
          "@id":
            `${siteUrl}/locations#breadcrumb`,
        },

        inLanguage:
          "en-LC",
      },

      {
        "@type":
          "ItemList",

        "@id":
          `${siteUrl}/locations#billboard-locations`,

        name:
          "Ernest Rentals Billboard Locations in Saint Lucia",

        description:
          "Static and digital billboard advertising locations available through Ernest Rentals across Saint Lucia.",

        numberOfItems:
          locationsWithImages.length,

        itemListElement:
          locationsWithImages.map(
            (
              location,
              index
            ) => ({
              "@type":
                "ListItem",

              position:
                index +
                1,

              url:
                `${siteUrl}/locations/${location.slug}`,

              item: {
                "@type":
                  "Place",

                name:
                  `${location.name} Billboard Advertising`,

                url:
                  `${siteUrl}/locations/${location.slug}`,

                description:
                  location.description,

                ...(location.imageUrl
                  ? {
                      image:
                        location.imageUrl,
                    }
                  : {}),

                address: {
                  "@type":
                    "PostalAddress",

                  addressLocality:
                    location.area,

                  addressCountry:
                    "LC",
                },
              },
            })
          ),
      },

      {
        "@type":
          "BreadcrumbList",

        "@id":
          `${siteUrl}/locations#breadcrumb`,

        itemListElement: [
          {
            "@type":
              "ListItem",

            position:
              1,

            name:
              "Home",

            item:
              siteUrl,
          },

          {
            "@type":
              "ListItem",

            position:
              2,

            name:
              "Locations",

            item:
              `${siteUrl}/locations`,
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#071226]">

      {/* STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              structuredData
            ),
        }}
      />

      <SiteHeader />

      {/* HERO */}
      <section className="bg-white px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-500">
            Saint Lucia Outdoor Advertising
          </p>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-4xl">
              <h1 className="text-5xl font-black tracking-tight">
                Billboard Locations in Saint Lucia.
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
                Explore static and digital billboard advertising locations
                across Saint Lucia, then search your preferred campaign dates
                to see which billboards and advertising slots are available.
              </p>
            </div>

            <Link
              href="/#availability"
              className="rounded-xl bg-[#071226] px-5 py-3 font-extrabold text-white transition hover:bg-orange-600"
            >
              Search All Billboard Locations
            </Link>
          </div>
        </div>
      </section>

      {/* LOCATION INTRO */}
      <section className="px-5 pt-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sky-600">
              Advertising Across Saint Lucia
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Find the right location for your advertising campaign.
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Ernest Rentals offers outdoor advertising opportunities across
              multiple communities in Saint Lucia. Browse the locations below,
              compare static and digital options and search availability based
              on your campaign dates.
            </p>
          </div>
        </div>
      </section>

      {/* LOCATION CARDS */}
      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {locationsWithImages.map(
            (
              location
            ) => (
              <article
                key={
                  location.name
                }
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* IMAGE */}
                <Link
                  href={`/locations/${location.slug}`}
                  className="relative block h-56 overflow-hidden bg-slate-200"
                >
                  {location.imageUrl ? (
                    <>
                      <img
                        src={
                          location.imageUrl
                        }
                        alt={`${location.name} billboard advertising location in Saint Lucia`}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#071226]/65 via-transparent to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-300">
                            Featured Billboard
                          </p>

                          {location.featuredBillboard && (
                            <p className="mt-1 max-w-[220px] truncate text-xs font-bold text-white">
                              {
                                location
                                  .featuredBillboard
                                  .billboard_name
                              }
                            </p>
                          )}
                        </div>

                        <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[9px] font-extrabold uppercase tracking-wide text-white backdrop-blur">
                          {
                            location.type
                          }
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#071226,#12233f)] px-6 text-center">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-400">
                          Ernest Rentals
                        </p>

                        <p className="mt-2 text-sm font-bold text-slate-300">
                          Location photo coming soon
                        </p>
                      </div>
                    </div>
                  )}
                </Link>

                <div className="h-1.5 bg-gradient-to-r from-orange-500 to-sky-500" />

                {/* DETAILS */}
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                      Saint Lucia
                    </p>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-500">
                      {
                        location.type
                      }
                    </span>
                  </div>

                  <h2 className="mt-3 text-2xl font-black">
                    <Link
                      href={`/locations/${location.slug}`}
                      className="transition hover:text-orange-500"
                    >
                      {
                        location.name
                      }
                    </Link>
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-orange-500">
                    {
                      location.area
                    }
                  </p>

                  <p className="mt-4 min-h-[48px] text-sm leading-6 text-slate-500">
                    {
                      location.description
                    }
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/locations/${location.slug}`}
                      className="inline-flex rounded-xl bg-[#071226] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-orange-500"
                    >
                      View{" "}
                      {
                        location.name
                      }
                    </Link>

                    <Link
                      href={`/?location=${encodeURIComponent(
                        location.search
                      )}#availability`}
                      className="inline-flex rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-extrabold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
                    >
                      Check Availability
                    </Link>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      </section>

      {/* PRIMARY SITE LINKS */}
      <section className="bg-white px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
            Explore Ernest Rentals
          </p>

          <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-tight">
            Explore more billboard advertising options.
          </h2>

          <nav
            aria-label="Explore Ernest Rentals"
            className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <Link
              href="/billboards"
              className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 font-extrabold transition hover:border-orange-300 hover:bg-white hover:text-orange-600"
            >
              Billboard Advertising →
            </Link>

            <Link
              href="/digital-screens"
              className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 font-extrabold transition hover:border-orange-300 hover:bg-white hover:text-orange-600"
            >
              Digital Billboard Advertising →
            </Link>

            <Link
              href="/how-it-works"
              className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 font-extrabold transition hover:border-orange-300 hover:bg-white hover:text-orange-600"
            >
              How It Works →
            </Link>

            <Link
              href="/contact"
              className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 font-extrabold transition hover:border-orange-300 hover:bg-white hover:text-orange-600"
            >
              Contact Ernest Rentals →
            </Link>
          </nav>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#071226] px-8 py-10 text-white">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-400">
            Not sure where to advertise?
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="max-w-3xl text-3xl font-black">
                Search all available billboard inventory across Saint Lucia.
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                Enter your preferred campaign dates and compare available
                static and digital billboard locations in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/#availability"
                className="rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
              >
                Search Billboard Availability
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-extrabold text-white transition hover:bg-white/10"
              >
                Contact Ernest Rentals
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}