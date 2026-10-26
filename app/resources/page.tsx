import type { Metadata } from "next";

import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://www.ernestrentals.com";

export const metadata: Metadata = {
  title: "Customer Resources | Rate Cards, Guides & Proposals",
  description:
    "Download Ernest Rentals billboard rate cards, review artwork guidelines and request a custom advertising proposal in Saint Lucia.",
  alternates: {
    canonical: "/resources",
  },
  openGraph: {
    title: "Ernest Rentals Customer Resources",
    description:
      "Rate cards, artwork guidelines and campaign planning resources for billboard advertisers in Saint Lucia.",
    url: "/resources",
    siteName: "Ernest Rentals",
    locale: "en_LC",
    type: "website",
    images: [
      {
        url: "/ernest-rentals-logo.png",
        width: 256,
        height: 256,
        alt: "Ernest Rentals customer resources",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ernest Rentals Customer Resources",
    description:
      "Download rate cards, review artwork guidelines and plan your billboard campaign.",
    images: ["/ernest-rentals-logo.png"],
  },
};

const downloadableResources = [
  {
    eyebrow: "Digital Advertising",
    title: "Digital Billboard Rate Card",
    description:
      "Compare Standard, Premium and Shoutout advertising packages for the Rodney Bay Digital Billboard.",
    href: "/downloads/ernest-rentals-digital-billboard-rate-card-2026.pdf",
    fileDetails: "PDF · 2026 rates · 348 KB",
    accent: "orange",
  },
  {
    eyebrow: "Static Advertising",
    title: "Static Billboard Rate Card",
    description:
      "Review static billboard rental packages and the information needed to plan a campaign across Saint Lucia.",
    href: "/downloads/ernest-rentals-static-billboard-rate-card-2026.pdf",
    fileDetails: "PDF · 2026 rates · 1.4 MB",
    accent: "sky",
  },
] as const;

const planningResources = [
  {
    eyebrow: "Creative Preparation",
    title: "Billboard Artwork Guidelines",
    description:
      "Prepare clear, readable artwork for static billboards, digital campaigns and 15-second Shoutouts.",
    href: "/artwork-guidelines",
    action: "View Artwork Guidelines",
  },
  {
    eyebrow: "Campaign Planning",
    title: "How Billboard Advertising Works",
    description:
      "Follow the process from finding a billboard and selecting dates to confirmation, artwork and launch.",
    href: "/how-it-works",
    action: "View the Campaign Process",
  },
  {
    eyebrow: "Availability",
    title: "Search Billboard Locations",
    description:
      "Explore Ernest Rentals locations and check availability for your preferred advertising period.",
    href: "/#availability",
    action: "Search Billboard Availability",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/resources#webpage`,
      url: `${siteUrl}/resources`,
      name: "Ernest Rentals Customer Resources",
      description:
        "Rate cards, artwork guidelines and campaign planning resources for Ernest Rentals customers.",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "ItemList",
      name: "Ernest Rentals downloadable resources",
      itemListElement: downloadableResources.map((resource, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: resource.title,
        url: `${siteUrl}${resource.href}`,
      })),
    },
  ],
};

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#071226]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <SiteHeader />

      <section className="relative overflow-hidden bg-[#071226] px-5 py-20 text-white lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-orange-500 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-sky-500 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-400">
              Ernest Rentals Resource Centre
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Everything you need to
              <span className="block bg-gradient-to-r from-orange-400 to-sky-400 bg-clip-text text-transparent">
                plan your campaign.
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Download current rate cards, prepare your artwork and find the
              right next step for your Ernest Rentals billboard campaign.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#downloads"
                className="rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
              >
                Browse Downloads
              </a>

              <Link
                href="/contact"
                className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-extrabold text-white transition hover:bg-white/10"
              >
                Request a Proposal
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="downloads" className="scroll-mt-24 px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-600">
              Downloadable Rate Cards
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Current advertising packages in one place.
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Save or share the latest Ernest Rentals rate cards. Final
              placement remains subject to availability and campaign
              confirmation.
            </p>
          </div>

          <div className="mt-9 grid gap-6 lg:grid-cols-2">
            {downloadableResources.map((resource) => {
              const isOrange = resource.accent === "orange";

              return (
                <article
                  key={resource.href}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`h-2 ${isOrange ? "bg-orange-500" : "bg-sky-500"}`}
                  />

                  <div className="flex flex-1 flex-col p-7 sm:p-8">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isOrange ? "bg-orange-50 text-orange-600" : "bg-sky-50 text-sky-600"}`}
                    >
                      <DownloadIcon />
                    </div>

                    <p
                      className={`mt-6 text-xs font-extrabold uppercase tracking-[0.16em] ${isOrange ? "text-orange-600" : "text-sky-600"}`}
                    >
                      {resource.eyebrow}
                    </p>

                    <h3 className="mt-2 text-2xl font-black tracking-tight">
                      {resource.title}
                    </h3>

                    <p className="mt-3 flex-1 leading-7 text-slate-500">
                      {resource.description}
                    </p>

                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                      {resource.fileDetails}
                    </p>

                    <a
                      href={resource.href}
                      download
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#071226] px-5 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
                    >
                      <DownloadIcon />
                      Download Rate Card
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sky-600">
              Guides & Planning Tools
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Move from idea to billboard with confidence.
            </h2>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {planningResources.map((resource) => (
              <article
                key={resource.href}
                className="flex h-full flex-col rounded-3xl border border-slate-200 bg-[#f8fafc] p-6 transition hover:border-sky-200 hover:bg-sky-50/40"
              >
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-sky-600">
                  {resource.eyebrow}
                </p>

                <h3 className="mt-3 text-xl font-black tracking-tight">
                  {resource.title}
                </h3>

                <p className="mt-3 flex-1 leading-7 text-slate-500">
                  {resource.description}
                </p>

                <Link
                  href={resource.href}
                  className="mt-6 inline-flex items-center gap-2 font-extrabold text-[#071226] transition hover:text-orange-600"
                >
                  {resource.action}
                  <ArrowIcon />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#071226] text-white lg:grid-cols-[1.2fr_.8fr]">
          <div className="p-8 sm:p-10 lg:p-12">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-400">
              Custom Proposal
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Need recommendations for your campaign?
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Tell our team about your audience, preferred locations, campaign
              dates and budget. We can prepare a proposal based on your actual
              advertising needs and current availability.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
              >
                Request a Custom Proposal
              </Link>

              <Link
                href="/pricing"
                className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-extrabold text-white transition hover:bg-white/10"
              >
                View Pricing Online
              </Link>
            </div>
          </div>

          <div className="border-t border-white/10 bg-white/5 p-8 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-sky-300">
              Helpful details to include
            </p>

            <ul className="mt-5 space-y-4 text-sm font-semibold text-slate-200">
              {[
                "Business or campaign name",
                "Preferred billboard location",
                "Campaign start date and duration",
                "Target audience and campaign objective",
                "Whether your artwork is ready",
              ].map((detail) => (
                <li key={detail} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-[#071226]">
                    ✓
                  </span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
