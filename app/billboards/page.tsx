import type {
  Metadata,
} from "next";

import Link from "next/link";

import AvailabilitySearch from "@/components/AvailabilitySearch";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const siteUrl =
  process.env
    .NEXT_PUBLIC_SITE_URL ??
  "https://www.ernestrentals.com";

export const metadata:
  Metadata = {
  title:
    "Billboard Advertising in Saint Lucia",

  description:
    "Find static and digital billboard advertising in Saint Lucia with Ernest Rentals. Compare billboard locations, check live availability and start your outdoor advertising campaign online.",

  alternates: {
    canonical:
      "/billboards",
  },

  openGraph: {
    title:
      "Billboard Advertising in Saint Lucia | Ernest Rentals",

    description:
      "Explore static and digital billboard advertising opportunities across Saint Lucia. Compare locations, check availability and start your campaign with Ernest Rentals.",

    url:
      "/billboards",

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
          "Ernest Rentals billboard advertising in Saint Lucia",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Billboard Advertising in Saint Lucia | Ernest Rentals",

    description:
      "Search static and digital billboard advertising opportunities across Saint Lucia.",

    images: [
      "/ernest-rentals-logo.png",
    ],
  },
};

const structuredData = {
  "@context":
    "https://schema.org",

  "@graph": [
    {
      "@type":
        "WebPage",

      "@id":
        `${siteUrl}/billboards#webpage`,

      url:
        `${siteUrl}/billboards`,

      name:
        "Billboard Advertising in Saint Lucia",

      description:
        "Find static and digital billboard advertising in Saint Lucia with Ernest Rentals. Compare locations, check availability and start your campaign online.",

      isPartOf: {
        "@id":
          `${siteUrl}/#website`,
      },

      about: {
        "@id":
          `${siteUrl}/billboards#service`,
      },

      breadcrumb: {
        "@id":
          `${siteUrl}/billboards#breadcrumb`,
      },

      inLanguage:
        "en-LC",
    },

    {
      "@type":
        "Service",

      "@id":
        `${siteUrl}/billboards#service`,

      name:
        "Billboard Advertising in Saint Lucia",

      serviceType:
        "Billboard Advertising",

      description:
        "Static and digital billboard advertising opportunities across Saint Lucia provided by Ernest Rentals.",

      provider: {
        "@id":
          `${siteUrl}/#organization`,
      },

      areaServed: {
        "@type":
          "Country",

        name:
          "Saint Lucia",
      },

      url:
        `${siteUrl}/billboards`,

      hasOfferCatalog: {
        "@type":
          "OfferCatalog",

        name:
          "Billboard Advertising Options",

        itemListElement: [
          {
            "@type":
              "OfferCatalog",

            name:
              "Static Billboard Advertising",
          },

          {
            "@type":
              "OfferCatalog",

            name:
              "Digital Billboard Advertising",
          },
        ],
      },
    },

    {
      "@type":
        "BreadcrumbList",

      "@id":
        `${siteUrl}/billboards#breadcrumb`,

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
            "Billboards",

          item:
            `${siteUrl}/billboards`,
        },
      ],
    },
  ],
};

export default function BillboardsPage() {
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
      <section className="relative overflow-hidden bg-[#071226] px-5 pb-20 pt-16 text-white lg:px-8 lg:pb-24 lg:pt-20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-orange-500 blur-3xl" />

          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-sky-500 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-400">
            Saint Lucia Outdoor Advertising
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Billboard Advertising

            <span className="block bg-gradient-to-r from-orange-400 to-sky-400 bg-clip-text text-transparent">
              in Saint Lucia.
            </span>
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Find static and digital billboard advertising opportunities across
            Saint Lucia. Compare locations, check live availability and choose
            the outdoor advertising option that fits your campaign.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#availability"
              className="rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
            >
              Search Billboard Availability
            </Link>

            <Link
              href="/locations"
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-extrabold text-white transition hover:bg-white/10"
            >
              Explore Billboard Locations
            </Link>
          </div>
        </div>
      </section>

      {/* LIVE AVAILABILITY */}
      <AvailabilitySearch />

      {/* BILLBOARD TYPES */}
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
              Advertising Options
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Static and digital billboards across Saint Lucia.
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Ernest Rentals provides outdoor advertising solutions for
              businesses that want long-term roadside exposure or flexible
              digital campaigns.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">

            {/* STATIC */}
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
                Static Billboard Advertising
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Long-term roadside visibility.
              </h2>

              <p className="mt-4 leading-7 text-slate-500">
                Static billboard advertising is ideal for businesses that want
                consistent brand exposure in a fixed Saint Lucia location.
                Choose an available billboard and select a 3, 6 or 12-month
                campaign period.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  "3 Months",
                  "6 Months",
                  "12 Months",
                ].map(
                  (
                    label
                  ) => (
                    <div
                      key={
                        label
                      }
                      className="rounded-2xl bg-slate-50 px-3 py-4 text-center text-sm font-black text-slate-700"
                    >
                      {
                        label
                      }
                    </div>
                  )
                )}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/?type=static#availability"
                  className="rounded-xl bg-orange-500 px-5 py-3 font-extrabold text-white transition hover:bg-orange-600"
                >
                  Search Static Billboards
                </Link>

                <Link
                  href="/locations"
                  className="rounded-xl border border-slate-200 px-5 py-3 font-extrabold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                >
                  View Locations
                </Link>
              </div>
            </article>

            {/* DIGITAL */}
            <article className="rounded-3xl bg-[#071226] p-8 text-white shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-400">
                Digital Billboard Advertising
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Flexible digital advertising.
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                Digital billboard campaigns use rotating advertising slots,
                allowing your business to run dynamic creative across a digital
                screen. Search your campaign dates to see live Standard,
                Premium and Shoutout slot availability.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-sm font-bold">
                <span className="rounded-full bg-white/10 px-4 py-2">
                  Standard
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2">
                  Premium
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2">
                  Shoutout
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2">
                  10s &amp; 15s Slots
                </span>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/?type=digital#availability"
                  className="rounded-xl bg-orange-500 px-5 py-3 font-extrabold text-white transition hover:bg-orange-600"
                >
                  Search Digital Billboards
                </Link>

                <Link
                  href="/digital-screens"
                  className="rounded-xl bg-white px-5 py-3 font-extrabold text-[#071226] transition hover:bg-orange-400"
                >
                  Digital Billboard Details
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* INFORMATION */}
      <section className="bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_.8fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sky-600">
              Outdoor Advertising in Saint Lucia
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Put your business in front of people on the road.
            </h2>

            <p className="mt-5 max-w-3xl leading-8 text-slate-600">
              Billboard advertising gives businesses a highly visible way to
              reach motorists, commuters, residents and visitors across Saint
              Lucia. Ernest Rentals offers billboard locations in multiple
              communities, with both traditional static advertising and digital
              billboard options.
            </p>

            <p className="mt-4 max-w-3xl leading-8 text-slate-600">
              Use our online availability search to select your preferred
              location and campaign dates, review the available advertising
              options and submit your campaign request directly to Ernest
              Rentals.
            </p>
          </div>

          <aside className="rounded-3xl bg-[#f5f8fc] p-7">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-orange-500">
              Explore Ernest Rentals
            </p>

            <nav
              aria-label="Explore Ernest Rentals"
              className="mt-5 space-y-3"
            >
              <Link
                href="/digital-screens"
                className="block rounded-2xl border border-slate-200 bg-white p-4 font-extrabold transition hover:border-orange-300 hover:text-orange-600"
              >
                Digital Billboard Advertising →
              </Link>

              <Link
                href="/locations"
                className="block rounded-2xl border border-slate-200 bg-white p-4 font-extrabold transition hover:border-orange-300 hover:text-orange-600"
              >
                Billboard Locations in Saint Lucia →
              </Link>

              <Link
                href="/how-it-works"
                className="block rounded-2xl border border-slate-200 bg-white p-4 font-extrabold transition hover:border-orange-300 hover:text-orange-600"
              >
                How Billboard Advertising Works →
              </Link>

              <Link
                href="/contact"
                className="block rounded-2xl border border-slate-200 bg-white p-4 font-extrabold transition hover:border-orange-300 hover:text-orange-600"
              >
                Contact Ernest Rentals →
              </Link>
            </nav>
          </aside>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#071226] px-7 py-10 text-white sm:px-10">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-400">
            Start Your Campaign
          </p>

          <h2 className="mt-2 max-w-3xl text-3xl font-black sm:text-4xl">
            Find an available billboard for your Saint Lucia advertising
            campaign.
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Search available static and digital billboard inventory by location
            and campaign date.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/#availability"
              className="inline-flex rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
            >
              Search Billboard Availability
            </Link>

            <Link
              href="/contact"
              className="inline-flex rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-extrabold text-white transition hover:bg-white/10"
            >
              Contact Ernest Rentals
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}