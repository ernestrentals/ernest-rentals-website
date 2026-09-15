import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Contact Ernest Rentals",
  description:
    "Contact Ernest Rentals in Saint Lucia for help with static billboards, digital advertising, locations, availability and campaign planning.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Ernest Rentals",
    description:
      "Get help planning your next static or digital billboard campaign in Saint Lucia.",
    url: "/contact",
    type: "website",
  },
};

const whatsappUrl =
  "https://wa.me/17587133701?text=Hi%20Ernest%20Rentals%2C%20I%27m%20interested%20in%20billboard%20advertising%20in%20Saint%20Lucia.";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#071226]">
      <SiteHeader />

      <section className="bg-white px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-500">
            Contact Ernest Rentals
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
            Let&apos;s talk about your next billboard campaign.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">
            Need help choosing a location, billboard type or advertising package?
            Contact Ernest Rentals or start by searching available billboard inventory.
          </p>
        </div>
      </section>

      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <div className="space-y-4">
            <a
              href="tel:+17587133701"
              className="block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                Phone
              </p>

              <p className="mt-2 text-2xl font-black">
                758-713-3701
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Tap to call Ernest Rentals.
              </p>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-600">
                    WhatsApp
                  </p>

                  <p className="mt-2 text-2xl font-black text-[#071226]">
                    758-713-3701
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Chat with Ernest Rentals about locations, packages and availability.
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-extrabold text-white">
                  CHAT
                </span>
              </div>
            </a>

            <a
              href="mailto:rentalsernest@gmail.com"
              className="block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                Email
              </p>

              <p className="mt-2 break-all text-2xl font-black">
                rentalsernest@gmail.com
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Send campaign, artwork or general advertising questions by email.
              </p>
            </a>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                Location
              </p>

              <p className="mt-2 text-2xl font-black">
                Praslin, Micoud
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Saint Lucia
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-[#071226] p-8 text-white lg:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-400">
              Fastest Way To Start
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Search the available billboard inventory first.
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-slate-300">
              The search shows available static and digital billboard opportunities,
              package options and the information needed to begin a campaign request.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#availability"
                className="rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
              >
                Search Billboards
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-emerald-600 px-6 py-3.5 font-extrabold text-white transition hover:bg-emerald-700"
              >
                Chat on WhatsApp
              </a>

              <Link
                href="/how-it-works"
                className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-extrabold text-white transition hover:bg-white/10"
              >
                See How It Works
              </Link>
            </div>

            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="text-sm font-bold">
                Already know where you want to advertise?
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Open the billboard from the availability results, choose the appropriate
                package and submit your campaign request directly from its detail page.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
