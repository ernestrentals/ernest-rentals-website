import type {
  Metadata,
} from "next";

import Link from "next/link";

import DigitalPackageComparison from "@/components/DigitalPackageComparison";
import DigitalPricingCards from "@/components/DigitalPricingCards";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  formatXcd,
  getPublicPricing,
  type PublicStaticPackage,
} from "@/lib/public-pricing";

export const revalidate =
  300;

const siteUrl =
  process.env
    .NEXT_PUBLIC_SITE_URL ??
  "https://www.ernestrentals.com";

export const metadata:
  Metadata = {
  title:
    "Billboard Advertising Rates in Saint Lucia",

  description:
    "Compare Ernest Rentals static and digital billboard advertising rates in Saint Lucia, including Standard, Premium and Shoutout digital packages.",

  alternates: {
    canonical:
      "/pricing",
  },

  openGraph: {
    title:
      "Billboard Advertising Rates in Saint Lucia | Ernest Rentals",

    description:
      "Compare static billboard rentals, Standard and Premium digital advertising, and Shoutout packages from Ernest Rentals.",

    url:
      "/pricing",

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
          "Ernest Rentals billboard advertising rates in Saint Lucia",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Billboard Advertising Rates in Saint Lucia | Ernest Rentals",

    description:
      "Compare static, Standard, Premium and Shoutout billboard advertising packages in Saint Lucia.",

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
        `${siteUrl}/pricing#webpage`,

      url:
        `${siteUrl}/pricing`,

      name:
        "Billboard Advertising Rates in Saint Lucia",

      description:
        "Compare Ernest Rentals static and digital billboard advertising packages across Saint Lucia.",

      isPartOf: {
        "@id":
          `${siteUrl}/#website`,
      },

      about: {
        "@id":
          `${siteUrl}/pricing#service`,
      },

      breadcrumb: {
        "@id":
          `${siteUrl}/pricing#breadcrumb`,
      },

      inLanguage:
        "en-LC",
    },

    {
      "@type":
        "Service",

      "@id":
        `${siteUrl}/pricing#service`,

      name:
        "Billboard Advertising Packages",

      serviceType:
        "Billboard Advertising",

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
        `${siteUrl}/pricing`,
    },

    {
      "@type":
        "BreadcrumbList",

      "@id":
        `${siteUrl}/pricing#breadcrumb`,

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
            "Pricing",

          item:
            `${siteUrl}/pricing`,
        },
      ],
    },
  ],
};

function staticPriceRange(
  packages:
    PublicStaticPackage[],
  duration:
    number
) {
  const matchingPrices =
    packages
      .filter(
        (item) =>
          item.duration_unit ===
            "month" &&
          item.duration_value ===
            duration
      )
      .map(
        (item) =>
          item.price
      );

  if (
    matchingPrices.length ===
    0
  ) {
    return null;
  }

  return {
    minimum:
      Math.min(
        ...matchingPrices
      ),
    maximum:
      Math.max(
        ...matchingPrices
      ),
  };
}

export default async function PricingPage() {
  const {
    digitalPackages,
    staticPackages,
  } =
    await getPublicPricing();

  const staticTerms = [
    3,
    6,
    12,
  ].map(
    (duration) => ({
      duration,
      range:
        staticPriceRange(
          staticPackages,
          duration
        ),
    })
  );

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#071226]">
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

      <section className="relative overflow-hidden bg-[#071226] px-5 py-20 text-white lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-orange-500 blur-3xl" />

          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-sky-500 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-400">
            Ernest Rentals Rate Card
          </p>

          <h1 className="mt-4 max-w-5xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Billboard Advertising Rates

            <span className="block bg-gradient-to-r from-orange-400 to-sky-400 bg-clip-text text-transparent">
              in Saint Lucia.
            </span>
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Compare static and digital billboard advertising packages across
            Saint Lucia. Choose the campaign length and advertising option
            that best fits your business.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#availability"
              className="rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
            >
              Search Billboard Availability
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-extrabold text-white transition hover:bg-white/10"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sky-600">
              Digital Billboard Pricing
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Flexible terms for Standard, Premium and Shoutouts.
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Longer digital terms show the equivalent monthly amount first,
              with the full campaign commitment directly below it.
            </p>
          </div>

          <div className="mt-9">
            <DigitalPricingCards
              packages={
                digitalPackages
              }
            />
          </div>
        </div>
      </section>

      <DigitalPackageComparison
        packages={
          digitalPackages
        }
      />

      <section className="bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
                Static Billboard Pricing
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Rates vary by billboard location.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                Static billboard package prices depend on the selected
                location and advertising face. The ranges shown come directly
                from the live public package catalogue.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/?type=static#availability"
                  className="rounded-xl bg-[#071226] px-5 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
                >
                  View Available Static Billboards
                </Link>

                <a
                  href="/downloads/ernest-rentals-static-billboard-rate-card-2026.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-extrabold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                >
                  Open Static Rate Card
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {staticTerms.map(
                (
                  item
                ) => (
                  <article
                    key={
                      item.duration
                    }
                    className="rounded-3xl border border-slate-200 bg-[#f8fafc] p-6"
                  >
                    <p className="text-sm font-extrabold text-slate-500">
                      {item.duration} Months
                    </p>

                    {item.range ? (
                      <>
                        <p className="mt-3 text-2xl font-black text-orange-600">
                          {formatXcd(
                            item.range.minimum
                          )}

                          <span className="block text-sm font-bold text-slate-400">
                            to {formatXcd(
                              item.range.maximum
                            )}
                          </span>
                        </p>

                        <p className="mt-3 text-xs leading-5 text-slate-500">
                          Package total varies by selected billboard.
                        </p>
                      </>
                    ) : (
                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        View available billboards for current pricing.
                      </p>
                    )}
                  </article>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 rounded-[2rem] bg-orange-500 px-7 py-10 sm:px-10">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#071226]/65">
              Ready to Advertise?
            </p>

            <h2 className="mt-2 max-w-3xl text-3xl font-black">
              Check live availability for your campaign dates.
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-[#071226]/70">
              Choose a billboard and package through the existing Ernest
              Rentals campaign request flow.
            </p>
          </div>

          <Link
            href="/#availability"
            className="rounded-xl bg-[#071226] px-6 py-3.5 font-extrabold text-white transition hover:bg-[#0b1a36]"
          >
            Search Billboard Availability
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
