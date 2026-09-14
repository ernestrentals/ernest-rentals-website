import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Digital Billboard Advertising in Saint Lucia",
  description:
    "Explore digital billboard advertising in Saint Lucia with Standard 10-second, Premium 15-second and Shoutout campaign options from Ernest Rentals.",
  alternates: {
    canonical: "/digital-screens",
  },
  openGraph: {
    title: "Digital Billboard Advertising in Saint Lucia",
    description:
      "Explore digital billboard packages and live advertising availability with Ernest Rentals.",
    url: "/digital-screens",
    type: "website",
  },
};

const packages = [
  {
    label: "Standard",
    duration: "10 seconds",
    description:
      "A strong everyday option for brand awareness, promotions and recurring messages.",
  },
  {
    label: "Premium",
    duration: "15 seconds",
    description:
      "More screen time for campaigns that need additional visual or message space.",
  },
  {
    label: "Shoutout",
    duration: "15 seconds",
    description:
      "Designed for celebratory, community and short-form special-message advertising.",
  },
];

export default function DigitalScreensPage() {
  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#071226]">
      <SiteHeader />

      <section className="relative overflow-hidden bg-[#071226] px-5 py-20 text-white lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-16 bottom-0 h-80 w-80 rounded-full bg-orange-500 blur-3xl" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-sky-500 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-sky-400">
              Digital Advertising
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">
              Dynamic campaigns built for attention.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Put your brand on high-impact digital screens with flexible
              rotating advertising packages and live slot availability.
            </p>

            <Link
              href="/?type=digital#availability"
              className="mt-8 inline-flex rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
            >
              Search Digital Availability
            </Link>
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

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
              Advertising Options
            </p>

            <h2 className="mt-2 text-4xl font-black">
              Choose the slot that fits your message.
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {packages.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071226] text-sm font-black text-white">
                  {item.duration.split(" ")[0]}s
                </div>

                <p className="mt-5 text-2xl font-black">
                  {item.label}
                </p>

                <p className="mt-1 font-bold text-orange-500">
                  {item.duration}
                </p>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              ["Live Availability", "Search your campaign dates and see which digital advertising categories have open slots."],
              ["Simple Campaign Request", "Choose a screen and package, then send your company and campaign information online."],
              ["Managed Placement", "Ernest Rentals confirms the campaign details before the advertisement goes live."],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-3xl bg-slate-50 p-6"
              >
                <p className="text-xl font-black">
                  {title}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 rounded-3xl bg-orange-500 px-8 py-10">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#071226]/70">
              Ready to advertise?
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#071226]">
              Check digital screen availability.
            </h2>
          </div>

          <Link
            href="/?type=digital#availability"
            className="rounded-xl bg-[#071226] px-6 py-3.5 font-extrabold text-white"
          >
            Search Digital Screens
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
