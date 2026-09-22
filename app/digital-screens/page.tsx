import type {
  Metadata,
} from "next";

import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const siteUrl =
  process.env
    .NEXT_PUBLIC_SITE_URL ??
  "https://www.ernestrentals.com";

export const metadata:
  Metadata = {
  title:
    "Digital Billboard Advertising in Saint Lucia",

  description:
    "Advertise on digital billboards in Saint Lucia with Ernest Rentals. Explore Standard 10-second, Premium 15-second and Shoutout advertising options, check live availability and start your campaign online.",

  alternates: {
    canonical:
      "/digital-screens",
  },

  openGraph: {
    title:
      "Digital Billboard Advertising in Saint Lucia | Ernest Rentals",

    description:
      "Explore digital billboard advertising in Saint Lucia, compare 10-second and 15-second advertising options and check live availability.",

    url:
      "/digital-screens",

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
          "Ernest Rentals digital billboard advertising in Saint Lucia",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Digital Billboard Advertising in Saint Lucia | Ernest Rentals",

    description:
      "Explore digital billboard advertising options and live availability across Saint Lucia.",

    images: [
      "/ernest-rentals-logo.png",
    ],
  },
};

const packages = [
  {
    label:
      "Standard",

    duration:
      "10 seconds",

    description:
      "A strong everyday option for brand awareness, promotions and recurring messages.",
  },

  {
    label:
      "Premium",

    duration:
      "15 seconds",

    description:
      "More screen time for campaigns that need additional visual or message space.",
  },

  {
    label:
      "Shoutout",

    duration:
      "15 seconds",

    description:
      "Designed for celebratory, community and short-form special-message advertising.",
  },
];

const structuredData = {
  "@context":
    "https://schema.org",

  "@graph": [
    {
      "@type":
        "WebPage",

      "@id":
        `${siteUrl}/digital-screens#webpage`,

      url:
        `${siteUrl}/digital-screens`,

      name:
        "Digital Billboard Advertising in Saint Lucia",

      description:
        "Explore digital billboard advertising in Saint Lucia with Standard, Premium and Shoutout advertising options from Ernest Rentals.",

      isPartOf: {
        "@id":
          `${siteUrl}/#website`,
      },

      about: {
        "@id":
          `${siteUrl}/digital-screens#service`,
      },

      breadcrumb: {
        "@id":
          `${siteUrl}/digital-screens#breadcrumb`,
      },

      inLanguage:
        "en-LC",
    },

    {
      "@type":
        "Service",

      "@id":
        `${siteUrl}/digital-screens#service`,

      name:
        "Digital Billboard Advertising in Saint Lucia",

      serviceType:
        "Digital Billboard Advertising",

      description:
        "Digital billboard advertising in Saint Lucia with 10-second and 15-second advertising options from Ernest Rentals.",

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
        `${siteUrl}/digital-screens`,

      hasOfferCatalog: {
        "@type":
          "OfferCatalog",

        name:
          "Digital Billboard Advertising Packages",

        itemListElement: [
          {
            "@type":
              "Offer",

            name:
              "Standard Digital Advertising",

            itemOffered: {
              "@type":
                "Service",

              name:
                "Standard 10-Second Digital Billboard Advertising",
            },
          },

          {
            "@type":
              "Offer",

            name:
              "Premium Digital Advertising",

            itemOffered: {
              "@type":
                "Service",

              name:
                "Premium 15-Second Digital Billboard Advertising",
            },
          },

          {
            "@type":
              "Offer",

            name:
              "Shoutout Digital Advertising",

            itemOffered: {
              "@type":
                "Service",

              name:
                "Shoutout 15-Second Digital Billboard Advertising",
            },
          },
        ],
      },
    },

    {
      "@type":
        "BreadcrumbList",

      "@id":
        `${siteUrl}/digital-screens#breadcrumb`,

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
            "Digital Screens",

          item:
            `${siteUrl}/digital-screens`,
        },
      ],
    },
  ],
};

export default function DigitalScreensPage() {
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
      <section className="relative overflow-hidden bg-[#071226] px-5 py-20 text-white lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-16 bottom-0 h-80 w-80 rounded-full bg-orange-500 blur-3xl" />

          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-sky-500 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-sky-400">
              Saint Lucia Digital Outdoor Advertising
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">
              Digital Billboard Advertising

              <span className="block bg-gradient-to-r from-orange-400 to-sky-400 bg-clip-text text-transparent">
                in Saint Lucia.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Put your brand on high-impact digital billboards with flexible
              10-second and 15-second advertising options, rotating campaigns
              and live slot availability.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/?type=digital#availability"
                className="inline-flex rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
              >
                Search Digital Availability
              </Link>

              <Link
                href="/locations"
                className="inline-flex rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-extrabold text-white transition hover:bg-white/10"
              >
                Explore Billboard Locations
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-orange-400 via-orange-500 to-sky-500 p-[2px]">
              <div className="rounded-[1.4rem] bg-[#020817] p-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-400">
                  Your Brand Here
                </p>

                <p className="mt-8 text-4xl font-black">
                  Bright. Clear. Visible.
                </p>

                <p className="mt-4 text-slate-400">
                  Digital outdoor advertising by Ernest Rentals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
              Digital Advertising Packages
            </p>

            <h2 className="mt-2 text-4xl font-black">
              Choose the digital billboard slot that fits your message.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-500">
              Ernest Rentals offers flexible digital advertising options for
              businesses, promotions, events and special messages across Saint
              Lucia.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {packages.map(
              (
                item
              ) => (
                <article
                  key={
                    item.label
                  }
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071226] text-sm font-black text-white">
                    {
                      item.duration.split(
                        " "
                      )[0]
                    }
                    s
                  </div>

                  <h2 className="mt-5 text-2xl font-black">
                    {
                      item.label
                    }
                  </h2>

                  <p className="mt-1 font-bold text-orange-500">
                    {
                      item.duration
                    }
                  </p>

                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    {
                      item.description
                    }
                  </p>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* DIGITAL BILLBOARD INFORMATION */}
      <section className="bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_.85fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sky-600">
              Digital Outdoor Advertising
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Flexible advertising built for busy roads.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Digital billboards allow multiple advertisers to share a
              high-visibility screen using scheduled advertising slots. This
              gives businesses the flexibility to run eye-catching campaigns
              without committing to one static creative for an extended period.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Ernest Rentals allows advertisers to search available campaign
              dates online, compare digital advertising options and submit a
              campaign request directly from the website.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/billboards"
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-extrabold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
              >
                Compare All Billboard Options
              </Link>

              <Link
                href="/how-it-works"
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-extrabold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
              >
                How Campaign Booking Works
              </Link>
            </div>
          </div>

          <aside className="rounded-3xl bg-[#071226] p-7 text-white">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-orange-400">
              Digital Advertising Options
            </p>

            <div className="mt-6 space-y-5">
              <div className="border-b border-white/10 pb-5">
                <p className="text-xl font-black">
                  Standard
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-300">
                  10-second advertising slot for brand awareness and everyday
                  promotions.
                </p>
              </div>

              <div className="border-b border-white/10 pb-5">
                <p className="text-xl font-black">
                  Premium
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-300">
                  15-second advertising slot for campaigns that need additional
                  visual and message time.
                </p>
              </div>

              <div>
                <p className="text-xl font-black">
                  Shoutout
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-300">
                  15-second option for birthdays, celebrations, community
                  messages and other special announcements.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* PROCESS */}
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
              How Digital Advertising Works
            </p>

            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              From availability search to live campaign.
            </h2>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {[
              [
                "Live Availability",
                "Search your campaign dates and see which digital advertising categories have open slots.",
              ],

              [
                "Simple Campaign Request",
                "Choose a screen and package, then send your company and campaign information online.",
              ],

              [
                "Managed Placement",
                "Ernest Rentals confirms the campaign details and coordinates the advertising content before your campaign goes live.",
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
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-xl font-black">
                    {
                      title
                    }
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {
                      body
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* PRIMARY INTERNAL LINKS */}
      <section className="bg-white px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sky-600">
            Explore Ernest Rentals
          </p>

          <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-tight">
            Explore more billboard advertising resources.
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
              href="/locations"
              className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 font-extrabold transition hover:border-orange-300 hover:bg-white hover:text-orange-600"
            >
              Billboard Locations →
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
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 rounded-3xl bg-orange-500 px-8 py-10">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#071226]/70">
              Ready to advertise?
            </p>

            <h2 className="mt-2 max-w-2xl text-3xl font-black text-[#071226]">
              Check digital billboard availability in Saint Lucia.
            </h2>

            <p className="mt-3 max-w-xl leading-7 text-[#071226]/70">
              Search campaign dates and find an available digital advertising
              slot for your brand.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/?type=digital#availability"
              className="rounded-xl bg-[#071226] px-6 py-3.5 font-extrabold text-white transition hover:bg-[#0b1a36]"
            >
              Search Digital Screens
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-[#071226]/20 bg-white/25 px-6 py-3.5 font-extrabold text-[#071226] transition hover:bg-white/40"
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