import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Billboard Locations in Saint Lucia",

  description:
    "Explore Ernest Rentals billboard advertising locations across Saint Lucia, including Dennery, Mamiku, Mon Repos, Piaye, Praslin, Richford and Rodney Bay.",

  alternates: {
    canonical: "/locations",
  },

  openGraph: {
    title:
      "Billboard Locations in Saint Lucia | Ernest Rentals",

    description:
      "Explore static and digital billboard advertising locations across Saint Lucia and search live campaign availability.",

    url:
      "/locations",

    type:
      "website",

    images: [
      {
        url:
          "/ernest-rentals-logo.png",

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

const locations = [
  {
    name: "Dennery",
    slug: "dennery",
    area: "Anse Canot, Dennery",
    description:
      "Static billboard advertising opportunities including V-Shape advertising faces.",
    search: "Dennery",
    type: "Static Billboard",
  },
  {
    name: "Mamiku",
    slug: "mamiku",
    area: "Mamiku, Micoud",
    description:
      "Static roadside billboard advertising along the east coast corridor.",
    search: "Mamiku",
    type: "Static Billboard",
  },
  {
    name: "Mon Repos",
    slug: "mon-repos",
    area: "Mon Repos, Micoud",
    description:
      "Static billboard advertising opportunities serving traffic through the Micoud area.",
    search: "Mon Repos",
    type: "Static Billboard",
  },
  {
    name: "Piaye",
    slug: "piaye",
    area: "Piaye, Choiseul",
    description:
      "Large-format static billboard advertising in Saint Lucia's south-west corridor.",
    search: "Piaye",
    type: "Static Billboard",
  },
  {
    name: "Praslin",
    slug: "praslin",
    area: "Praslin, Micoud",
    description:
      "V-Shape static billboard advertising with directional face options.",
    search: "Praslin",
    type: "Static Billboard",
  },
  {
    name: "Richford",
    slug: "richford",
    area: "Richford, Dennery Valley",
    description:
      "Large-format static billboard advertising in the Dennery Valley area.",
    search: "Richford",
    type: "Static Billboard",
  },
  {
    name: "Rodney Bay",
    slug: "rodney-bay",
    area: "Rodney Bay, Gros Islet",
    description:
      "Digital billboard advertising inventory in one of Saint Lucia's busiest commercial areas.",
    search: "Rodney Bay",
    type: "Digital Billboard",
  },
];

const locationsStructuredData = {
  "@context": "https://schema.org",

  "@type": "ItemList",

  "@id":
    "https://www.ernestrentals.com/locations#billboard-locations",

  name:
    "Ernest Rentals Billboard Locations in Saint Lucia",

  description:
    "Static and digital billboard advertising locations available through Ernest Rentals across Saint Lucia.",

  numberOfItems:
    locations.length,

  itemListElement:
    locations.map((location, index) => ({
      "@type": "ListItem",

      position:
        index + 1,

      url:
        `https://www.ernestrentals.com/locations/${location.slug}`,

      item: {
        "@type": "Place",

        name:
          `${location.name} Billboard Advertising`,

        url:
          `https://www.ernestrentals.com/locations/${location.slug}`,

        description:
          location.description,

        address: {
          "@type": "PostalAddress",

          addressLocality:
            location.area,

          addressCountry:
            "LC",
        },
      },
    })),
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",

  "@type": "BreadcrumbList",

  itemListElement: [
    {
      "@type": "ListItem",

      position: 1,

      name: "Home",

      item:
        "https://www.ernestrentals.com",
    },
    {
      "@type": "ListItem",

      position: 2,

      name:
        "Billboard Locations",

      item:
        "https://www.ernestrentals.com/locations",
    },
  ],
};

export default function LocationsPage() {
  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#071226]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              locationsStructuredData
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              breadcrumbStructuredData
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
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {locations.map((location) => (
            <article
              key={location.name}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-2 bg-gradient-to-r from-orange-500 to-sky-500" />

              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                    Saint Lucia
                  </p>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-500">
                    {location.type}
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-black">
                  <Link
                    href={`/locations/${location.slug}`}
                    className="transition hover:text-orange-500"
                  >
                    {location.name}
                  </Link>
                </h2>

                <p className="mt-1 text-sm font-semibold text-orange-500">
                  {location.area}
                </p>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  {location.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/locations/${location.slug}`}
                    className="inline-flex rounded-xl bg-[#071226] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-orange-500"
                  >
                    View {location.name}
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
          ))}
        </div>
      </section>

      {/* INTERNAL LINKS */}
      <section className="bg-white px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
            Explore Advertising Options
          </p>

          <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-tight">
            Choose the billboard format that fits your campaign.
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <Link
              href="/billboards"
              className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 font-extrabold transition hover:border-orange-300 hover:bg-white hover:text-orange-600"
            >
              Billboard Advertising in Saint Lucia →
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
              How Billboard Booking Works →
            </Link>
          </div>
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