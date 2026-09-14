import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Billboard Locations in Saint Lucia",
  description:
    "Explore Ernest Rentals billboard locations across Saint Lucia, including Dennery, Mamiku, Mon Repos, Piaye, Praslin, Richford and Rodney Bay.",
  alternates: {
    canonical: "/locations",
  },
  openGraph: {
    title: "Billboard Locations in Saint Lucia",
    description:
      "Explore static and digital billboard advertising locations across Saint Lucia.",
    url: "/locations",
    type: "website",
  },
};

const locations = [
  {
    name: "Dennery",
    area: "Anse Canot, Dennery",
    description:
      "Static billboard opportunities including V-Shape advertising faces.",
    search: "Dennery",
  },
  {
    name: "Mamiku",
    area: "Mamiku, Micoud",
    description:
      "Static roadside billboard locations along the east coast corridor.",
    search: "Mamiku",
  },
  {
    name: "Mon Repos",
    area: "Mon Repos, Micoud",
    description:
      "Static advertising opportunities serving traffic through the Micoud area.",
    search: "Mon Repos",
  },
  {
    name: "Piaye",
    area: "Piaye, Choiseul",
    description:
      "Large-format static billboard visibility in the south-west corridor.",
    search: "Piaye",
  },
  {
    name: "Praslin",
    area: "Praslin, Micoud",
    description:
      "V-Shape static billboard advertising with directional face options.",
    search: "Praslin",
  },
  {
    name: "Richford",
    area: "Richford, Dennery Valley",
    description:
      "Large-format static billboard locations in the Dennery Valley area.",
    search: "Richford",
  },
  {
    name: "Rodney Bay",
    area: "Rodney Bay, Gros Islet",
    description:
      "Digital billboard inventory for one of Saint Lucia's busiest commercial areas.",
    search: "Rodney Bay",
  },
];

export default function LocationsPage() {
  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#071226]">
      <SiteHeader />

      <section className="bg-white px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-500">
            Billboard Locations
          </p>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-black tracking-tight">
                Advertising locations across Saint Lucia.
              </h1>

              <p className="mt-5 text-lg leading-8 text-slate-500">
                Explore the areas where Ernest Rentals offers static and digital
                billboard advertising, then search your campaign dates to see
                what is available.
              </p>
            </div>

            <Link
              href="/#availability"
              className="rounded-xl bg-[#071226] px-5 py-3 font-extrabold text-white transition hover:bg-orange-600"
            >
              Search All Locations
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {locations.map((location) => (
            <article
              key={location.name}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-2 bg-gradient-to-r from-orange-500 to-sky-500" />

              <div className="p-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                  Saint Lucia
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {location.name}
                </h2>

                <p className="mt-1 text-sm font-semibold text-orange-500">
                  {location.area}
                </p>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  {location.description}
                </p>

                <Link
                  href={`/?location=${encodeURIComponent(
                    location.search
                  )}#availability`}
                  className="mt-6 inline-flex rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-extrabold text-slate-700 transition group-hover:bg-[#071226] group-hover:text-white"
                >
                  Search {location.name}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#071226] px-8 py-10 text-white">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-400">
            Not sure where to advertise?
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black">
                Search all available billboard inventory.
              </h2>

              <p className="mt-3 max-w-2xl text-slate-300">
                Enter your preferred dates and compare the available locations in one place.
              </p>
            </div>

            <Link
              href="/#availability"
              className="rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white"
            >
              Search Billboards
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
