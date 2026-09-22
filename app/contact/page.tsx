import type {
  Metadata,
} from "next";

import Link from "next/link";

import MeetingScheduler from "@/components/MeetingScheduler";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const siteUrl =
  process.env
    .NEXT_PUBLIC_SITE_URL ??
  "https://www.ernestrentals.com";

const phoneNumber =
  "+17587133701";

const displayPhone =
  "+1 758-713-3701";

const emailAddress =
  "rentalsernest@gmail.com";

const whatsappUrl =
  "https://wa.me/17587133701?text=Hi%20Ernest%20Rentals%2C%20I%27m%20interested%20in%20billboard%20advertising%20in%20Saint%20Lucia.";

export const metadata:
  Metadata = {
  title: {
    absolute:
      "Contact Ernest Rentals",
  },

  description:
    "Contact Ernest Rentals in Saint Lucia for help with static billboards, digital advertising, billboard locations, availability and campaign planning.",

  alternates: {
    canonical:
      "/contact",
  },

  openGraph: {
    title:
      "Contact Ernest Rentals | Billboard Advertising Saint Lucia",

    description:
      "Contact Ernest Rentals for help planning a static or digital billboard advertising campaign in Saint Lucia.",

    url:
      "/contact",

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
          "Contact Ernest Rentals for billboard advertising in Saint Lucia",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Contact Ernest Rentals | Billboard Advertising Saint Lucia",

    description:
      "Contact Ernest Rentals for billboard locations, availability and campaign planning in Saint Lucia.",

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
        "ContactPage",

      "@id":
        `${siteUrl}/contact#webpage`,

      url:
        `${siteUrl}/contact`,

      name:
        "Contact Ernest Rentals",

      description:
        "Contact Ernest Rentals for static and digital billboard advertising, availability, locations and campaign planning in Saint Lucia.",

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
          `${siteUrl}/#organization`,
      },

      breadcrumb: {
        "@id":
          `${siteUrl}/contact#breadcrumb`,
      },

      inLanguage:
        "en-LC",
    },

    {
      "@type":
        "BreadcrumbList",

      "@id":
        `${siteUrl}/contact#breadcrumb`,

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
            "Contact",

          item:
            `${siteUrl}/contact`,
        },
      ],
    },
  ],
};

export default function ContactPage() {
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

      {/* HERO */}
      <section className="relative overflow-hidden bg-white px-5 py-16 lg:px-8 lg:py-20">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-100 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-500">
            Contact Ernest Rentals
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
            Let&apos;s talk about your next

            <span className="block text-orange-500">
              billboard campaign.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-500">
            Need help choosing a billboard location, advertising format or
            campaign package? Contact Ernest Rentals, schedule a meeting or
            start by searching available billboard inventory.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#schedule"
              className="rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
            >
              Schedule a Meeting
            </a>

            <Link
              href="/#availability"
              className="rounded-xl bg-[#071226] px-6 py-3.5 font-extrabold text-white transition hover:bg-[#0b1a36]"
            >
              Search Billboards
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-3.5 font-extrabold text-emerald-700 transition hover:bg-emerald-100"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT OPTIONS */}
      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[.9fr_1.1fr]">

          <div className="space-y-4">
            <a
              href={`tel:${phoneNumber}`}
              className="group block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                    Phone
                  </p>

                  <p className="mt-2 text-2xl font-black transition group-hover:text-orange-500">
                    {displayPhone}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Call Ernest Rentals about billboard advertising.
                  </p>
                </div>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 font-black text-slate-400 transition group-hover:bg-orange-500 group-hover:text-white">
                  →
                </span>
              </div>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-600">
                    WhatsApp
                  </p>

                  <p className="mt-2 text-2xl font-black text-[#071226]">
                    {displayPhone}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Chat with Ernest Rentals about locations, packages and
                    availability.
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-extrabold text-white">
                  CHAT
                </span>
              </div>
            </a>

            <a
              href={`mailto:${emailAddress}`}
              className="group block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                    Email
                  </p>

                  <p className="mt-2 break-all text-2xl font-black transition group-hover:text-orange-500">
                    {emailAddress}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Send campaign, artwork or general advertising questions by
                    email.
                  </p>
                </div>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 font-black text-slate-400 transition group-hover:bg-orange-500 group-hover:text-white">
                  →
                </span>
              </div>
            </a>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                Based In
              </p>

              <p className="mt-2 text-2xl font-black">
                Praslin, Micoud
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Saint Lucia
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Ernest Rentals provides billboard advertising opportunities
                across multiple locations in Saint Lucia.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-[#071226] p-8 text-white lg:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-400">
                Fastest Way To Start
              </p>

              <h2 className="mt-3 max-w-2xl text-4xl font-black">
                Search the available billboard inventory first.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-300">
                The search shows available static and digital billboard
                opportunities, package options and the information needed to
                begin a campaign request.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/#availability"
                  className="rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
                >
                  Search Billboards
                </Link>

                <a
                  href="#schedule"
                  className="rounded-xl bg-white px-6 py-3.5 font-extrabold text-[#071226] transition hover:bg-slate-100"
                >
                  Schedule Meeting
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-emerald-600 px-6 py-3.5 font-extrabold text-white transition hover:bg-emerald-700"
                >
                  Chat on WhatsApp
                </a>
              </div>

              <div className="mt-10 border-t border-white/10 pt-6">
                <p className="text-sm font-bold">
                  Already know where you want to advertise?
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Open the billboard from the availability results, choose the
                  appropriate advertising package and submit your campaign
                  request directly from its billboard detail page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEETING SCHEDULER */}
      <section
        id="schedule"
        className="scroll-mt-24 border-t border-slate-200 bg-white px-5 py-16 lg:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-500">
              Schedule a Meeting
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Pick a time that works for you.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-500">
              Choose the type of meeting you need, select an available time
              from our live calendar and we&apos;ll send you a calendar
              invitation once the meeting is confirmed.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                Monday–Friday
              </span>

              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                10:00 AM–3:00 PM
              </span>

              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                Saint Lucia Time
              </span>

              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                Live Availability
              </span>
            </div>
          </div>

          <MeetingScheduler />
        </div>
      </section>

      {/* EXPLORE ERNEST RENTALS */}
      <section className="border-t border-slate-200 bg-[#f5f8fc] px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
            Explore Ernest Rentals
          </p>

          <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-tight">
            Explore billboard advertising before you get in touch.
          </h2>

          <nav
            aria-label="Explore Ernest Rentals"
            className="mt-7 grid gap-4 md:grid-cols-3"
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
              href="/how-it-works"
              className="rounded-2xl border border-slate-200 bg-white p-5 font-extrabold transition hover:border-orange-300 hover:text-orange-600"
            >
              How It Works →
            </Link>

            <Link
              href="/#availability"
              className="rounded-2xl border border-slate-200 bg-[#071226] p-5 font-extrabold text-white transition hover:bg-orange-500"
            >
              Search Billboard Availability →
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 font-extrabold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
            >
              Chat on WhatsApp →
            </a>
          </nav>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}