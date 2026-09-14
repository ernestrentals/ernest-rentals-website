import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "How Billboard Advertising Works",
  description:
    "Learn how to search billboard availability, choose an advertising package, submit your campaign request and launch with Ernest Rentals in Saint Lucia.",
  alternates: {
    canonical: "/how-it-works",
  },
  openGraph: {
    title: "How Billboard Advertising Works",
    description:
      "See how Ernest Rentals takes customers from billboard search to campaign launch.",
    url: "/how-it-works",
    type: "website",
  },
};

const steps = [
  {
    number: "01",
    title: "Search",
    body:
      "Choose your preferred location, billboard type, start date and changeover date to see available inventory.",
  },
  {
    number: "02",
    title: "Choose",
    body:
      "Open a billboard to review its location, specifications, live availability and advertising package options.",
  },
  {
    number: "03",
    title: "Request",
    body:
      "Submit your company, contact and campaign information. Static billboard customers choose a rental period first.",
  },
  {
    number: "04",
    title: "Confirm",
    body:
      "Ernest Rentals reviews the request, confirms final availability and package details, and coordinates the next steps.",
  },
  {
    number: "05",
    title: "Prepare",
    body:
      "Provide your finished artwork or coordinate the required creative work before the campaign is scheduled.",
  },
  {
    number: "06",
    title: "Launch",
    body:
      "Once the campaign is approved and confirmed, your advertisement is prepared for the selected billboard placement.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#071226]">
      <SiteHeader />

      <section className="bg-[#071226] px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-400">
            How It Works
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
            From finding a billboard to launching your campaign.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            The Ernest Rentals website is designed to make billboard advertising
            easier to understand, compare and request.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <p className="text-4xl font-black text-orange-500">
                  {step.number}
                </p>

                <h2 className="mt-5 text-2xl font-black">
                  {step.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
              Static Billboards
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Fixed rental periods.
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Static billboards are offered in 3, 6 and 12-month packages.
              When you choose a package, the website calculates the proper
              changeover date from your selected start date.
            </p>
          </div>

          <div className="rounded-3xl bg-[#071226] p-8 text-white">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-400">
              Digital Billboards
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Slot-based advertising.
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Digital billboards show live slot availability for the campaign
              period you request, including Standard, Premium and Shoutout options.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 rounded-3xl bg-orange-500 px-8 py-10">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#071226]/65">
              Ready?
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Start with availability.
            </h2>
          </div>

          <Link
            href="/#availability"
            className="rounded-xl bg-[#071226] px-6 py-3.5 font-extrabold text-white"
          >
            Search Billboards
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
