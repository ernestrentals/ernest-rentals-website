import type { Metadata } from "next";
import Link from "next/link";

import AvailabilitySearch from "@/components/AvailabilitySearch";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Billboards in Saint Lucia",
  description:
    "Search static and digital billboards across Saint Lucia. Compare locations, check live availability, review advertising options and start your campaign with Ernest Rentals.",
  alternates: {
    canonical: "/billboards",
  },
  openGraph: {
    title: "Billboards in Saint Lucia",
    description:
      "Search static and digital billboard advertising opportunities across Saint Lucia with Ernest Rentals.",
    url: "/billboards",
    type: "website",
  },
};

export default function BillboardsPage() {
  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#071226]">
      <SiteHeader />

      <section className="relative overflow-hidden bg-[#071226] px-5 pb-20 pt-16 text-white lg:px-8 lg:pb-24 lg:pt-20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-orange-500 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-sky-500 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-400">
            Billboard Marketplace
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Find the right billboard for your next campaign.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Compare static and digital advertising opportunities across Saint Lucia,
            check availability and begin your campaign request online.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#availability"
              className="rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
            >
              Search All Billboards
            </Link>

            <Link
              href="/locations"
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-extrabold text-white transition hover:bg-white/10"
            >
              Explore Locations
            </Link>
          </div>
        </div>
      </section>

      <AvailabilitySearch />

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
              Static Billboards
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Long-term roadside visibility.
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Static billboard rentals are offered in fixed rental periods.
              Choose the billboard, select a 3, 6 or 12-month package and the
              campaign changeover date is calculated automatically.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {["3 Months", "6 Months", "12 Months"].map((label) => (
                <div
                  key={label}
                  className="rounded-2xl bg-slate-50 px-3 py-4 text-center text-sm font-black text-slate-700"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-[#071226] p-8 text-white shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-400">
              Digital Billboards
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Flexible digital advertising.
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Digital campaigns use rotating advertising slots. Search your
              dates to see live availability for Standard, Premium and Shoutout
              opportunities.
            </p>

            <Link
              href="/digital-screens"
              className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 font-extrabold text-[#071226] transition hover:bg-orange-400"
            >
              Learn About Digital
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
