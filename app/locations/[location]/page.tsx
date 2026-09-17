import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

type LocationData = {
  name: string;
  area: string;
  region: string;
  type: "Static" | "Digital";
  search: string;
  description: string;
  detail: string;
};

const locations: Record<string, LocationData> = {
  dennery: {
    name: "Dennery",
    area: "Anse Canot, Dennery",
    region: "Dennery",
    type: "Static",
    search: "Dennery",
    description:
      "Explore static billboard advertising opportunities in Dennery, Saint Lucia, including V-Shape roadside advertising faces.",
    detail:
      "Dennery offers roadside advertising opportunities for businesses looking to build visibility along the east coast and through the Dennery area. Ernest Rentals provides static billboard options designed for longer-term advertising campaigns.",
  },

  mamiku: {
    name: "Mamiku",
    area: "Mamiku, Micoud",
    region: "Micoud",
    type: "Static",
    search: "Mamiku",
    description:
      "Explore static billboard advertising in Mamiku, Micoud, with roadside visibility along Saint Lucia's east coast corridor.",
    detail:
      "Mamiku provides roadside advertising opportunities along Saint Lucia's east coast. Ernest Rentals offers static billboard locations suitable for businesses seeking consistent brand exposure over 3, 6 or 12-month campaign periods.",
  },

  "mon-repos": {
    name: "Mon Repos",
    area: "Mon Repos, Micoud",
    region: "Micoud",
    type: "Static",
    search: "Mon Repos",
    description:
      "Explore billboard advertising opportunities in Mon Repos, Micoud, Saint Lucia with Ernest Rentals.",
    detail:
      "Mon Repos offers static outdoor advertising opportunities serving motorists and communities travelling through the Micoud area. Advertisers can search availability and submit campaign requests directly through Ernest Rentals.",
  },

  piaye: {
    name: "Piaye",
    area: "Piaye, Choiseul",
    region: "Choiseul",
    type: "Static",
    search: "Piaye",
    description:
      "Explore large-format static billboard advertising opportunities in Piaye, Choiseul, Saint Lucia.",
    detail:
      "Piaye provides large-format roadside advertising opportunities in Saint Lucia's south-west corridor. Static billboard campaigns are available for businesses seeking consistent visibility over longer advertising periods.",
  },

  praslin: {
    name: "Praslin",
    area: "Praslin, Micoud",
    region: "Micoud",
    type: "Static",
    search: "Praslin",
    description:
      "Explore V-Shape static billboard advertising opportunities in Praslin, Micoud, Saint Lucia.",
    detail:
      "Praslin offers V-Shape roadside billboard advertising with directional advertising faces. Businesses can search available campaign dates and submit an advertising request online through Ernest Rentals.",
  },

  richford: {
    name: "Richford",
    area: "Richford, Dennery Valley",
    region: "Dennery",
    type: "Static",
    search: "Richford",
    description:
      "Explore large-format static billboard advertising opportunities in Richford, Dennery Valley, Saint Lucia.",
    detail:
      "Richford provides large-format roadside billboard opportunities within the Dennery Valley area. Ernest Rentals offers longer-term static advertising options for businesses looking to maintain consistent local visibility.",
  },

  "rodney-bay": {
    name: "Rodney Bay",
    area: "Rodney Bay, Gros Islet",
    region: "Gros Islet",
    type: "Digital",
    search: "Rodney Bay",
    description:
      "Explore digital billboard advertising opportunities in Rodney Bay, Gros Islet, one of Saint Lucia's major commercial areas.",
    detail:
      "Rodney Bay offers digital outdoor advertising opportunities for businesses seeking flexible campaign options in one of Saint Lucia's major commercial areas. Digital advertising can use rotating 10-second and 15-second slots depending on availability.",
  },
};

export function generateStaticParams() {
  return Object.keys(locations).map((location) => ({
    location,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    location: string;
  }>;
}): Promise<Metadata> {
  const { location } = await params;

  const data =
    locations[location];

  if (!data) {
    return {
      title:
        "Billboard Locations in Saint Lucia",
    };
  }

  const title =
    `Billboard Advertising in ${data.name}, Saint Lucia`;

  return {
    title,

    description:
      data.description,

    alternates: {
      canonical:
        `/locations/${location}`,
    },

    openGraph: {
      title:
        `${title} | Ernest Rentals`,

      description:
        data.description,

      url:
        `/locations/${location}`,

      type:
        "website",

      images: [
        {
          url:
            "/ernest-rentals-logo.png",

          alt:
            `Ernest Rentals billboard advertising in ${data.name}, Saint Lucia`,
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        `${title} | Ernest Rentals`,

      description:
        data.description,

      images: [
        "/ernest-rentals-logo.png",
      ],
    },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{
    location: string;
  }>;
}) {
  const { location } = await params;

  const data =
    locations[location];

  if (!data) {
    notFound();
  }

  const pageUrl =
    `https://www.ernestrentals.com/locations/${location}`;

  const locationStructuredData = {
    "@context":
      "https://schema.org",

    "@type":
      "Service",

    "@id":
      `${pageUrl}#service`,

    name:
      `Billboard Advertising in ${data.name}, Saint Lucia`,

    serviceType:
      `${data.type} Billboard Advertising`,

    description:
      data.description,

    provider: {
      "@id":
        "https://www.ernestrentals.com/#organization",
    },

    areaServed: {
      "@type":
        "Place",

      name:
        `${data.name}, ${data.region}, Saint Lucia`,
    },

    url:
      pageUrl,
  };

  const breadcrumbStructuredData = {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement: [
      {
        "@type":
          "ListItem",

        position:
          1,

        name:
          "Home",

        item:
          "https://www.ernestrentals.com",
      },

      {
        "@type":
          "ListItem",

        position:
          2,

        name:
          "Billboard Locations",

        item:
          "https://www.ernestrentals.com/locations",
      },

      {
        "@type":
          "ListItem",

        position:
          3,

        name:
          data.name,

        item:
          pageUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#071226]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              locationStructuredData
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              breadcrumbStructuredData
            ),
        }}
      />

      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#071226] px-5 py-20 text-white lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-orange-500 blur-3xl" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-sky-500 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-400">
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href="/locations"
              className="transition hover:text-white"
            >
              Locations
            </Link>

            <span>/</span>

            <span className="text-orange-400">
              {data.name}
            </span>
          </div>

          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-400">
            {data.type} Billboard Advertising
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
            Billboard Advertising
            <span className="block bg-gradient-to-r from-orange-400 to-sky-400 bg-clip-text text-transparent">
              in {data.name}, Saint Lucia.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            {data.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/?location=${encodeURIComponent(
                data.search
              )}#availability`}
              className="rounded-xl bg-orange-500 px-6 py-3.5 font-extrabold text-white transition hover:bg-orange-600"
            >
              Check {data.name} Availability
            </Link>

            <Link
              href="/locations"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-extrabold text-white transition hover:bg-white/10"
            >
              View All Locations
            </Link>
          </div>
        </div>
      </section>

      {/* LOCATION DETAILS */}
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_.65fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sky-600">
              Outdoor Advertising in {data.name}
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Reach motorists and communities in the {data.name} area.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              {data.detail}
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Ernest Rentals makes it easy to search billboard availability,
              compare advertising options and submit your campaign request
              online.
            </p>
          </div>

          <aside className="rounded-3xl bg-[#071226] p-7 text-white">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-400">
              Location Details
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Location
                </p>

                <p className="mt-1 text-xl font-black">
                  {data.area}
                </p>
              </div>

              <div className="border-t border-white/10 pt-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Advertising Type
                </p>

                <p className="mt-1 text-xl font-black">
                  {data.type} Billboard
                </p>
              </div>

              <div className="border-t border-white/10 pt-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Country
                </p>

                <p className="mt-1 text-xl font-black">
                  Saint Lucia
                </p>
              </div>
            </div>

            <Link
              href={`/?location=${encodeURIComponent(
                data.search
              )}#availability`}
              className="mt-7 inline-flex w-full justify-center rounded-xl bg-orange-500 px-5 py-3 font-extrabold text-white transition hover:bg-orange-600"
            >
              Search Available Billboards
            </Link>
          </aside>
        </div>
      </section>

      {/* WHY THIS LOCATION */}
      <section className="bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-500">
              Ernest Rentals
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Advertise in {data.name} with a campaign built around your goals.
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              Search your preferred dates online and see available Ernest
              Rentals billboard inventory for {data.name}. Once you select an
              advertising opportunity, submit your company and campaign details
              and our team will coordinate the next steps.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-[#f5f8fc] p-6">
              <p className="text-xl font-black">
                Search Availability
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Check your preferred campaign dates against live billboard
                inventory.
              </p>
            </div>

            <div className="rounded-2xl bg-[#f5f8fc] p-6">
              <p className="text-xl font-black">
                Compare Options
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review the billboard type and advertising opportunities
                available for your campaign.
              </p>
            </div>

            <div className="rounded-2xl bg-[#f5f8fc] p-6">
              <p className="text-xl font-black">
                Start Your Campaign
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Send your campaign request directly to Ernest Rentals online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERNAL LINKS */}
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sky-600">
            Explore More Advertising Options
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Link
              href="/billboards"
              className="rounded-2xl border border-slate-200 bg-white p-5 font-extrabold transition hover:border-orange-300 hover:text-orange-600"
            >
              Billboard Advertising in Saint Lucia →
            </Link>

            <Link
              href="/digital-screens"
              className="rounded-2xl border border-slate-200 bg-white p-5 font-extrabold transition hover:border-orange-300 hover:text-orange-600"
            >
              Digital Billboard Advertising →
            </Link>

            <Link
              href="/locations"
              className="rounded-2xl border border-slate-200 bg-white p-5 font-extrabold transition hover:border-orange-300 hover:text-orange-600"
            >
              Explore All Billboard Locations →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-orange-500 px-8 py-10">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#071226]/70">
            Ready to advertise in {data.name}?
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="max-w-3xl text-3xl font-black text-[#071226]">
                Check billboard availability for your campaign.
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-[#071226]/70">
                Select your campaign dates and see available Ernest Rentals
                advertising opportunities in {data.name}.
              </p>
            </div>

            <Link
              href={`/?location=${encodeURIComponent(
                data.search
              )}#availability`}
              className="rounded-xl bg-[#071226] px-6 py-3.5 font-extrabold text-white transition hover:bg-[#0b1a36]"
            >
              Search {data.name}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}