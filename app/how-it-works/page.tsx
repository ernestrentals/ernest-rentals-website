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
    "How Billboard Advertising Works",

  description:
    "Learn how to search billboard availability, choose an advertising package, submit your campaign request and launch with Ernest Rentals in Saint Lucia.",

  alternates: {
    canonical:
      "/how-it-works",
  },

  openGraph: {
    title:
      "How Billboard Advertising Works | Ernest Rentals",

    description:
      "See how Ernest Rentals takes customers from billboard search and package selection to campaign request and launch in Saint Lucia.",

    url:
      "/how-it-works",

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
          "Ernest Rentals billboard advertising process in Saint Lucia",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "How Billboard Advertising Works | Ernest Rentals",

    description:
      "Learn how to search billboard availability, choose a package and start an advertising campaign with Ernest Rentals.",

    images: [
      "/ernest-rentals-logo.png",
    ],
  },
};

const steps = [
  {
    number:
      "01",

    title:
      "Search",

    body:
      "Choose your preferred location, billboard type, start date and changeover date to see available inventory.",
  },

  {
    number:
      "02",

    title:
      "Choose",

    body:
      "Open a billboard to review its location, specifications, live availability and advertising package options.",
  },

  {
    number:
      "03",

    title:
      "Request",

    body:
      "Submit your company, contact and campaign information. Static billboard customers choose a rental period first.",
  },

  {
    number:
      "04",

    title:
      "Confirm",

    body:
      "Ernest Rentals reviews the request, confirms final availability and package details, and coordinates the next steps.",
  },

  {
    number:
      "05",

    title:
      "Prepare",

    body:
      "Provide your finished artwork or coordinate the required creative work before the campaign is scheduled.",
  },

  {
    number:
      "06",

    title:
      "Launch",

    body:
      "Once the campaign is approved and confirmed, your advertisement is prepared for the selected billboard placement.",
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
        `${siteUrl}/how-it-works#webpage`,

      url:
        `${siteUrl}/how-it-works`,

      name:
        "How Billboard Advertising Works",

      description:
        "Learn how billboard advertising works with Ernest Rentals, from availability search and package selection to campaign confirmation and launch.",

      isPartOf: {
        "@id":
          `${siteUrl}/#website`,
      },

      about: {
        "@id":
          `${siteUrl}/#organization`,
      },

      breadcrumb: {
        "@id":
          `${siteUrl}/how-it-works#breadcrumb`,
      },

      mainEntity: {
        "@id":
          `${siteUrl}/how-it-works#process`,
      },

      inLanguage:
        "en-LC",
    },

    {
      "@type":
        "ItemList",

      "@id":
        `${siteUrl}/how-it-works#process`,

      name:
        "Ernest Rentals Billboard Advertising Process",

      numberOfItems:
        steps.length,

      itemListElement:
        steps.map(
          (
            step,
            index
          ) => ({
            "@type":
              "ListItem",

            position:
              index + 1,

            name:
              step.title,

            description:
              step.body,
          })
        ),
    },

    {
      "@type":
        "BreadcrumbList",

      "@id":
        `${siteUrl}/how-it-works#breadcrumb`,

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
            "How It Works",

          item:
            `${siteUrl}/how-it-works`,
        },
      ],
    },
  ],
};

export default function HowItWorksPage() {
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
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-orange-500/25 blur-3xl" />

          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-400">
            How Billboard Advertising Works
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
            From finding a billboard

            <span className="block bg-gradient-to-r from-orange-400 to-sky-400 bg-clip-text text-transparent">
              to launching your campaign.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Ernest Rentals makes it easier to search available billboard
            inventory, compare advertising options and submit your campaign
            request online.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#availability"
              className="rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
            >
              Search Billboard Availability
            </Link>

            <Link
              href="/billboards"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-extrabold text-white transition hover:bg-white/10"
            >
              Explore Billboards
            </Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
              Campaign Process
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Six steps from search to campaign launch.
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Start by searching available billboard inventory, review the
              advertising options and send your campaign details directly to
              Ernest Rentals.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {steps.map(
              (
                step
              ) => (
                <article
                  key={
                    step.number
                  }
                  className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-4xl font-black text-orange-500">
                      {
                        step.number
                      }
                    </p>

                    <div className="h-1 w-10 rounded-full bg-gradient-to-r from-orange-500 to-sky-500" />
                  </div>

                  <h2 className="mt-5 text-2xl font-black">
                    {
                      step.title
                    }
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {
                      step.body
                    }
                  </p>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* STATIC VS DIGITAL */}
      <section className="bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sky-600">
              Advertising Options
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Static and digital campaigns work a little differently.
            </h2>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">

            {/* STATIC */}
            <article className="rounded-3xl bg-slate-50 p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
                Static Billboards
              </p>

              <h3 className="mt-3 text-3xl font-black">
                Fixed rental periods.
              </h3>

              <p className="mt-4 leading-7 text-slate-500">
                Static billboards are offered in 3, 6 and 12-month packages.
                When you choose a package, the website calculates the proper
                changeover date from your selected start date.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-600">
                  3 Months
                </span>

                <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-600">
                  6 Months
                </span>

                <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-600">
                  12 Months
                </span>
              </div>

              <Link
                href="/?type=static#availability"
                className="mt-7 inline-flex rounded-xl bg-[#071226] px-5 py-3 font-extrabold text-white transition hover:bg-orange-600"
              >
                Search Static Billboards
              </Link>
            </article>

            {/* DIGITAL */}
            <article className="rounded-3xl bg-[#071226] p-8 text-white">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-400">
                Digital Billboards
              </p>

              <h3 className="mt-3 text-3xl font-black">
                Slot-based advertising.
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                Digital billboards show live slot availability for the campaign
                period you request, including Standard, Premium and Shoutout
                advertising options.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-slate-300">
                  Standard
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-slate-300">
                  Premium
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-slate-300">
                  Shoutout
                </span>
              </div>

              <Link
                href="/digital-screens"
                className="mt-7 inline-flex rounded-xl bg-orange-500 px-5 py-3 font-extrabold text-white transition hover:bg-orange-600"
              >
                Explore Digital Screens
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* EXPLORE ERNEST RENTALS */}
      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
            Explore Ernest Rentals
          </p>

          <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-tight">
            Continue planning your advertising campaign.
          </h2>

          <nav
            aria-label="Explore Ernest Rentals"
            className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <Link
              href="/billboards"
              className="rounded-2xl border border-slate-200 bg-white p-5 font-extrabold transition hover:border-orange-300 hover:text-orange-600"
            >
              Billboard Advertising →
            </Link>

            <Link
              href="/digital-screens"
              className="rounded-2xl border border-slate-200 bg-white p-5 font-extrabold transition hover:border-orange-300 hover:text-orange-600"
            >
              Digital Screens →
            </Link>

            <Link
              href="/locations"
              className="rounded-2xl border border-slate-200 bg-white p-5 font-extrabold transition hover:border-orange-300 hover:text-orange-600"
            >
              Billboard Locations →
            </Link>

            <Link
              href="/contact"
              className="rounded-2xl border border-slate-200 bg-white p-5 font-extrabold transition hover:border-orange-300 hover:text-orange-600"
            >
              Contact Ernest Rentals →
            </Link>
          </nav>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-16 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 rounded-3xl bg-orange-500 px-8 py-10">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#071226]/65">
              Ready to start?
            </p>

            <h2 className="mt-2 max-w-2xl text-3xl font-black">
              Start with live billboard availability.
            </h2>

            <p className="mt-3 max-w-xl leading-7 text-[#071226]/70">
              Choose your campaign dates and see which static billboards and
              digital advertising slots are available.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/#availability"
              className="rounded-xl bg-[#071226] px-6 py-3.5 font-extrabold text-white transition hover:bg-[#0b1a36]"
            >
              Search Billboards
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