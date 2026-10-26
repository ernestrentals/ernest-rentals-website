import type { Metadata } from "next";

import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getPublicPricing } from "@/lib/public-pricing";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://www.ernestrentals.com";

export const metadata: Metadata = {
  title: "Customer Resources | Rate Cards, Guides & Proposals",
  description:
    "Download Ernest Rentals billboard rate cards, review artwork guidelines and request a custom advertising proposal in Saint Lucia.",
  alternates: { canonical: "/resources" },
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

const advertisingResources = [
  {
    title: "Digital Billboard Rate Card",
    href: "/downloads/ernest-rentals-digital-billboard-rate-card-2026.pdf",
    action: "Download PDF",
    download: true,
  },
  {
    title: "Static Billboard Rate Card",
    href: "/downloads/ernest-rentals-static-billboard-rate-card-2026.pdf",
    action: "Download PDF",
    download: true,
  },
  {
    title: "Billboard Artwork Guidelines",
    href: "/artwork-guidelines",
    action: "View Guide",
    download: false,
  },
  {
    title: "Custom Advertising Proposal",
    href: "/contact",
    action: "Request Proposal",
    download: false,
  },
] as const;

const campaignTools = [
  {
    title: "Digital Billboard Packages",
    href: "/digital-screens",
    primaryAction: "View Packages",
    secondaryHref: "/pricing",
    secondaryAction: "Compare Pricing",
  },
  {
    title: "Static Billboard Locations",
    href: "/billboards",
    primaryAction: "Browse Billboards",
    secondaryHref: "/locations",
    secondaryAction: "View Locations",
  },
  {
    title: "Campaign Planning Guide",
    href: "/how-it-works",
    primaryAction: "How It Works",
    secondaryHref: "/artwork-guidelines",
    secondaryAction: "Artwork Guide",
  },
  {
    title: "Billboard Availability",
    href: "/#availability",
    primaryAction: "Search Availability",
    secondaryHref: "/contact",
    secondaryAction: "Contact Sales",
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
        "Billboard advertising resources, rate cards and campaign guides for Ernest Rentals customers.",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "ItemList",
      name: "Ernest Rentals billboard advertising resources",
      itemListElement: advertisingResources.map((resource, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: resource.title,
        url: `${siteUrl}${resource.href}`,
      })),
    },
  ],
};

function PdfIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 15h8" />
      <path d="M8 18h5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default async function ResourcesPage() {
  const { billboards } = await getPublicPricing();

  const heroImage =
    billboards.find(
      (billboard) =>
        billboard.billboard_code === "RBY-DIG-01" && billboard.image_url
    )?.image_url ??
    billboards.find((billboard) => Boolean(billboard.image_url))?.image_url ??
    null;

  return (
    <main className="min-h-screen bg-white text-[#071226]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <SiteHeader />

      <section className="px-4 pt-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto flex min-h-[360px] max-w-[1500px] items-center justify-center overflow-hidden bg-[#071226] sm:min-h-[440px] lg:min-h-[520px]">
          {heroImage ? (
            <img
              src={heroImage}
              alt="Ernest Rentals billboard advertising in Saint Lucia"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-[#071226] to-sky-950" />
          )}

          <div className="absolute inset-0 bg-[#071226]/55" />

          <div className="relative px-5 text-center text-white">
            <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-orange-300">
              Ernest Rentals
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.04em] sm:text-5xl lg:text-6xl">
              Resources
            </h1>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="border-b-2 border-[#071226] pb-5">
            <h2 className="text-2xl font-black uppercase tracking-[0.08em] sm:text-3xl">
              Billboard Advertising Resources
            </h2>
          </div>

          <div className="grid border-b border-slate-200 md:grid-cols-2 xl:grid-cols-4">
            {advertisingResources.map((resource, index) => (
              <article
                key={resource.href}
                className={`flex min-h-44 flex-col justify-between border-slate-200 py-8 md:px-7 ${index % 2 === 0 ? "md:border-r" : ""} ${index > 0 ? "border-t md:border-t-0" : ""} ${index > 1 ? "md:border-t xl:border-t-0" : ""} ${index < advertisingResources.length - 1 ? "xl:border-r" : ""} xl:px-8`}
              >
                <h3 className="max-w-xs text-xl font-black leading-snug">
                  {resource.title}
                </h3>

                {resource.download ? (
                  <a
                    href={resource.href}
                    download
                    className="mt-8 inline-flex w-fit items-center gap-2 border-b-2 border-orange-500 pb-1 text-xs font-black uppercase tracking-[0.16em] transition hover:text-orange-600"
                  >
                    <PdfIcon />
                    {resource.action}
                  </a>
                ) : (
                  <Link
                    href={resource.href}
                    className="mt-8 inline-flex w-fit items-center gap-2 border-b-2 border-orange-500 pb-1 text-xs font-black uppercase tracking-[0.16em] transition hover:text-orange-600"
                  >
                    {resource.action}
                    <ArrowIcon />
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f2f5f8] px-5 py-16 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="border-b-2 border-[#071226] pb-5">
            <h2 className="text-2xl font-black uppercase tracking-[0.08em] sm:text-3xl">
              Campaign Guides & Tools
            </h2>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4">
            {campaignTools.map((resource, index) => (
              <article
                key={resource.title}
                className={`min-h-48 border-slate-300 py-8 md:px-7 ${index % 2 === 0 ? "md:border-r" : ""} ${index > 0 ? "border-t md:border-t-0" : ""} ${index > 1 ? "md:border-t xl:border-t-0" : ""} ${index < campaignTools.length - 1 ? "xl:border-r" : ""} xl:px-8`}
              >
                <h3 className="text-xl font-black leading-snug">
                  {resource.title}
                </h3>

                <p className="mt-8 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                  <Link href={resource.href} className="transition hover:text-orange-600">
                    {resource.primaryAction}
                  </Link>
                  <span className="px-2 text-orange-500">|</span>
                  <Link href={resource.secondaryHref} className="transition hover:text-orange-600">
                    {resource.secondaryAction}
                  </Link>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#071226] px-5 py-14 text-white lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-400">
              Need something specific?
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Let us help plan your campaign.
            </h2>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
          >
            Contact Ernest Rentals
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
