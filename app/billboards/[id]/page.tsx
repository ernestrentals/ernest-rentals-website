import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

import BillboardCampaignCTA from "@/components/BillboardCampaignCTA";
import BillboardShareButtons from "@/components/BillboardShareButtons";
import BillboardReviews from "@/components/BillboardReviews";
import CompactAvailabilitySearch from "@/components/CompactAvailabilitySearch";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

type BillboardPageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    start?: string;
    end?: string;
  }>;
};

type BillboardDetails = {
  billboard_id: string;
  billboard_code: string;
  billboard_name: string;
  location: string | null;
  address: string | null;
  billboard_type: string;
  orientation: string | null;
  width_ft: number | null;
  height_ft: number | null;
  faces: number;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
};

type AvailabilityResult = {
  billboard_id: string;
  available_static_faces: number;
  available_standard_slots: number;
  available_premium_slots: number;
  available_shoutout_slots: number;
  availability_status: string;
};

type BillboardPhoto = {
  photo_id: string;
  image_url: string;
  caption: string | null;
  is_primary: boolean;
  sort_order: number;
};

type AvailabilityVariant =
  | "standard"
  | "premium"
  | "shoutout"
  | "static";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://www.ernestrentals.com"
).replace(/\/$/, "");

function createPublicServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

function getLocationSeoSlug(
  location: string | null
) {
  const value =
    (location ?? "").toLowerCase();

  if (
    value.includes("rodney")
  ) {
    return "rodney-bay";
  }

  if (
    value.includes("mamiku")
  ) {
    return "mamiku";
  }

  if (
    value.includes("mon repos")
  ) {
    return "mon-repos";
  }

  if (
    value.includes("piaye")
  ) {
    return "piaye";
  }

  if (
    value.includes("praslin")
  ) {
    return "praslin";
  }

  if (
    value.includes("richford")
  ) {
    return "richford";
  }

  if (
    value.includes("dennery")
  ) {
    return "dennery";
  }

  return null;
}

function getAreaServedName(
  location: string | null
) {
  if (!location) {
    return "Saint Lucia";
  }

  if (
    location
      .toLowerCase()
      .includes("saint lucia")
  ) {
    return location;
  }

  return `${location}, Saint Lucia`;
}

function saintLuciaTodayString() {
  const parts =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "America/St_Lucia",
        year:
          "numeric",
        month:
          "2-digit",
        day:
          "2-digit",
      }
    ).formatToParts(
      new Date()
    );

  const year =
    parts.find(
      (part) =>
        part.type ===
        "year"
    )?.value;

  const month =
    parts.find(
      (part) =>
        part.type ===
        "month"
    )?.value;

  const day =
    parts.find(
      (part) =>
        part.type ===
        "day"
    )?.value;

  return `${year}-${month}-${day}`;
}

function isDateString(
  value: string
) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    return false;
  }

  const [
    year,
    month,
    day,
  ] =
    value
      .split("-")
      .map(Number);

  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day
      )
    );

  return (
    date.getUTCFullYear() ===
      year &&
    date.getUTCMonth() ===
      month - 1 &&
    date.getUTCDate() ===
      day
  );
}

export async function generateMetadata({
  params,
}: Pick<
  BillboardPageProps,
  "params"
>): Promise<Metadata> {
  const { id } =
    await params;

  const supabase =
    createPublicServerClient();

  const {
    data: billboardRows,
  } =
    await supabase.rpc(
      "get_public_billboard_details",
      {
        p_billboard_id:
          id,
      }
    );

  if (
    !billboardRows ||
    billboardRows.length ===
      0
  ) {
    return {
      title:
        "Billboard Advertising in Saint Lucia",

      description:
        "Explore static and digital billboard advertising opportunities with Ernest Rentals in Saint Lucia.",

      robots: {
        index:
          false,
        follow:
          true,
      },
    };
  }

  const billboard =
    billboardRows[0] as BillboardDetails;

  const typeLabel =
    billboard.billboard_type ===
    "digital"
      ? "Digital Billboard"
      : "Static Billboard";

  const place =
    billboard.location ||
    "Saint Lucia";

  const size =
    billboard.width_ft &&
    billboard.height_ft
      ? `${billboard.width_ft} x ${billboard.height_ft} ft`
      : null;

  const title =
    `${billboard.billboard_code} Billboard Advertising in ${place}`;

  const descriptionParts = [
    `View ${billboard.billboard_name}, a ${typeLabel.toLowerCase()} advertising location in ${place}.`,

    size
      ? `${size} billboard.`
      : null,

    "Check availability, campaign options and start your advertising request with Ernest Rentals.",
  ].filter(Boolean);

  const description =
    descriptionParts.join(
      " "
    );

  const pageUrl =
    `${siteUrl}/billboards/${billboard.billboard_id}`;

  return {
    title,

    description,

    alternates: {
      canonical:
        pageUrl,
    },

    robots: {
      index:
        true,
      follow:
        true,
    },

    openGraph: {
      title:
        `${title} | Ernest Rentals`,

      description,

      url:
        pageUrl,

      type:
        "website",

      images:
        billboard.image_url
          ? [
              {
                url:
                  billboard.image_url,

                alt:
                  `${billboard.billboard_name} billboard advertising in ${place}`,
              },
            ]
          : [
              {
                url:
                  "/ernest-rentals-logo.png",

                alt:
                  "Ernest Rentals billboard advertising in Saint Lucia",
              },
            ],
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        `${title} | Ernest Rentals`,

      description,

      images: [
        billboard.image_url ||
          "/ernest-rentals-logo.png",
      ],
    },
  };
}

export default async function BillboardPage({
  params,
  searchParams,
}: BillboardPageProps) {
  const { id } =
    await params;

  const filters =
    await searchParams;

  const today =
    saintLuciaTodayString();

  const rawStart =
    filters.start ?? "";

  const rawEnd =
    filters.end ?? "";

  const validStart =
    rawStart &&
    isDateString(
      rawStart
    )
      ? rawStart
      : "";

  const validEnd =
    rawEnd &&
    isDateString(
      rawEnd
    )
      ? rawEnd
      : "";

  const normalizedStart =
    validStart &&
    validStart < today
      ? today
      : validStart;

  const normalizedEnd =
    validEnd &&
    normalizedStart &&
    validEnd >
      normalizedStart
      ? validEnd
      : "";

  const shouldNormalizeUrl =
    rawStart !==
      normalizedStart ||
    rawEnd !==
      normalizedEnd;

  if (
    shouldNormalizeUrl
  ) {
    const nextParams =
      new URLSearchParams();

    if (
      normalizedStart
    ) {
      nextParams.set(
        "start",
        normalizedStart
      );
    }

    if (
      normalizedEnd
    ) {
      nextParams.set(
        "end",
        normalizedEnd
      );
    }

    const query =
      nextParams.toString();

    redirect(
      `/billboards/${id}${
        query
          ? `?${query}`
          : ""
      }`
    );
  }

  const supabase =
    createPublicServerClient();

  const {
    data: billboardRows,
    error: billboardError,
  } =
    await supabase.rpc(
      "get_public_billboard_details",
      {
        p_billboard_id:
          id,
      }
    );

  if (
    billboardError ||
    !billboardRows ||
    billboardRows.length ===
      0
  ) {
    notFound();
  }

  const billboard =
    billboardRows[0] as BillboardDetails;

  const {
    data: photoRows,
  } =
    await supabase.rpc(
      "get_public_billboard_photos",
      {
        p_billboard_id:
          billboard.billboard_id,
      }
    );

  const photos =
    (photoRows ??
      []) as BillboardPhoto[];

  const startDate =
    normalizedStart;

  const changeoverDate =
    normalizedEnd;

  let availability:
    | AvailabilityResult
    | null = null;

  if (
    startDate &&
    changeoverDate &&
    changeoverDate >
      startDate
  ) {
    const {
      data: availabilityRows,
    } =
      await supabase.rpc(
        "search_public_billboard_availability",
        {
          p_start_date:
            startDate,

          p_end_date:
            changeoverDate,

          p_location:
            null,

          p_billboard_type:
            billboard.billboard_type,
        }
      );

    const match =
      availabilityRows?.find(
        (
          item: AvailabilityResult
        ) =>
          item.billboard_id ===
          billboard.billboard_id
      );

    if (match) {
      availability =
        match as AvailabilityResult;
    }
  }

  const isDigital =
    billboard.billboard_type ===
    "digital";

  const typeLabel =
    isDigital
      ? "Digital Billboard"
      : "Static Billboard";

  const isAvailable =
    availability?.availability_status ===
    "available";

  const primaryPhoto =
    photos.find(
      (photo) =>
        photo.is_primary
    ) ??
    photos[0] ??
    null;

  const galleryPhotos =
    photos.filter(
      (photo) =>
        photo.photo_id !==
        primaryPhoto?.photo_id
    );

  const fallbackImage =
    billboard.image_url;

  const hasCoordinates =
    billboard.latitude !==
      null &&
    billboard.longitude !==
      null;

  const mapQuery =
    hasCoordinates
      ? `${billboard.latitude},${billboard.longitude}`
      : billboard.address ||
        billboard.location ||
        "Saint Lucia";

  const mapEmbedUrl =
    `https://www.google.com/maps?q=${encodeURIComponent(
      mapQuery
    )}&z=16&output=embed`;

  const googleMapsUrl =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      mapQuery
    )}`;

  const pageUrl =
    `${siteUrl}/billboards/${billboard.billboard_id}`;

  const shareUrl =
    pageUrl;

  const shareTitle =
    `${billboard.billboard_name} - ${typeLabel}`;

  const shareDescription =
    `View ${billboard.billboard_name} in ${
      billboard.location ||
      "Saint Lucia"
    }. Check billboard details, availability and advertising opportunities with Ernest Rentals.`;

  const locationSlug =
    getLocationSeoSlug(
      billboard.location
    );

  const structuredDescription =
    `${billboard.billboard_name} is a ${typeLabel.toLowerCase()} advertising location in ${
      billboard.location ||
      "Saint Lucia"
    } operated by Ernest Rentals.`;

  const billboardServiceStructuredData = {
    "@context":
      "https://schema.org",

    "@type":
      "Service",

    "@id":
      `${pageUrl}#service`,

    name:
      `${billboard.billboard_code} Billboard Advertising`,

    serviceType:
      `${typeLabel} Advertising`,

    description:
      structuredDescription,

    url:
      pageUrl,

    provider: {
      "@id":
        "https://www.ernestrentals.com/#organization",
    },

    areaServed: {
      "@type":
        "Place",

      name:
        getAreaServedName(
          billboard.location
        ),
    },

    image:
      primaryPhoto?.image_url ||
      billboard.image_url ||
      "https://www.ernestrentals.com/ernest-rentals-logo.png",
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
          "Billboards",

        item:
          "https://www.ernestrentals.com/billboards",
      },

      ...(locationSlug
        ? [
            {
              "@type":
                "ListItem",

              position:
                3,

              name:
                billboard.location ||
                "Location",

              item:
                `https://www.ernestrentals.com/locations/${locationSlug}`,
            },
          ]
        : []),

      {
        "@type":
          "ListItem",

        position:
          locationSlug
            ? 4
            : 3,

        name:
          billboard.billboard_name,

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
              billboardServiceStructuredData
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

      {/* CONTENT */}
      <section className="px-5 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <Link
            href="/#availability"
            className="text-sm font-bold text-sky-600 transition hover:text-sky-700"
          >
            ← Back to availability
          </Link>

          <div className="mt-5">
            <CompactAvailabilitySearch
              initialLocation=""
              initialBillboardType=""
              initialStartDate={
                startDate
              }
              initialChangeoverDate={
                changeoverDate
              }
            />
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.35fr_.65fr]">

            {/* LEFT SIDE */}
            <div>

              {/* PHOTO GALLERY */}
              {primaryPhoto ||
              fallbackImage ? (
                <div className="grid gap-3 md:grid-cols-[2fr_1fr]">

                  <div className="relative min-h-[430px] overflow-hidden rounded-3xl bg-slate-200 shadow-lg">
                    <img
                      src={
                        primaryPhoto?.image_url ||
                        fallbackImage ||
                        ""
                      }
                      alt={`${billboard.billboard_name} ${typeLabel.toLowerCase()} in ${
                        billboard.location ||
                        "Saint Lucia"
                      }`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    <div className="relative flex min-h-[430px] items-end p-8 text-white">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-400">
                          Ernest Rentals
                        </p>

                        <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                          {
                            billboard.billboard_name
                          }
                        </h1>

                        <p className="mt-3 text-lg font-semibold text-slate-200">
                          {typeLabel} Advertising in{" "}
                          {billboard.location ||
                            "Saint Lucia"}
                        </p>

                        <p className="mt-2 text-sm text-slate-300">
                          Reference:{" "}
                          {
                            billboard.billboard_code
                          }
                        </p>

                        {primaryPhoto?.caption && (
                          <p className="mt-2 text-sm text-slate-300">
                            {
                              primaryPhoto.caption
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-1">

                    {galleryPhotos
                      .slice(
                        0,
                        2
                      )
                      .map(
                        (
                          photo,
                          index
                        ) => (
                          <div
                            key={
                              photo.photo_id
                            }
                            className="relative min-h-[205px] overflow-hidden rounded-2xl bg-slate-200"
                          >
                            <img
                              src={
                                photo.image_url
                              }
                              alt={
                                photo.caption ||
                                `${billboard.billboard_name} billboard photo ${
                                  index +
                                  2
                                }`
                              }
                              className="absolute inset-0 h-full w-full object-cover"
                            />

                            {photo.caption && (
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                <p className="text-sm font-semibold text-white">
                                  {
                                    photo.caption
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      )}

                    {galleryPhotos.length ===
                      0 && (
                      <div className="col-span-2 flex min-h-[205px] items-center justify-center rounded-2xl bg-[#071226] px-6 text-center md:col-span-1">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.15em] text-orange-400">
                            Ernest Rentals
                          </p>

                          <p className="mt-2 text-sm text-slate-300">
                            More billboard photos coming soon
                          </p>
                        </div>
                      </div>
                    )}

                    {galleryPhotos.length ===
                      1 && (
                      <div className="flex min-h-[205px] items-center justify-center rounded-2xl bg-[#071226] px-6 text-center">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.15em] text-orange-400">
                            Ernest Rentals
                          </p>

                          <p className="mt-2 text-sm text-slate-300">
                            More billboard photos coming soon
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[430px] items-end rounded-3xl bg-[#071226] p-8 text-white shadow-lg">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-400">
                      Ernest Rentals
                    </p>

                    <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                      {
                        billboard.billboard_name
                      }
                    </h1>

                    <p className="mt-3 text-lg font-semibold text-slate-300">
                      {typeLabel} Advertising in{" "}
                      {billboard.location ||
                        "Saint Lucia"}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      Reference:{" "}
                      {
                        billboard.billboard_code
                      }
                    </p>

                    <p className="mt-4 text-sm text-slate-300">
                      Billboard photos coming soon
                    </p>
                  </div>
                </div>
              )}

              {/* EXTRA PHOTOS */}
              {galleryPhotos.length >
                2 && (
                <section className="mt-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
                        Photo Gallery
                      </p>

                      <h2 className="mt-1 text-2xl font-black">
                        More views
                      </h2>
                    </div>

                    <p className="text-sm text-slate-500">
                      {
                        photos.length
                      }{" "}
                      photos
                    </p>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {galleryPhotos
                      .slice(
                        2
                      )
                      .map(
                        (
                          photo,
                          index
                        ) => (
                          <div
                            key={
                              photo.photo_id
                            }
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                          >
                            <img
                              src={
                                photo.image_url
                              }
                              alt={
                                photo.caption ||
                                `${billboard.billboard_name} gallery photo ${
                                  index +
                                  4
                                }`
                              }
                              className="h-52 w-full object-cover"
                            />

                            {photo.caption && (
                              <div className="p-4">
                                <p className="text-sm font-semibold text-slate-700">
                                  {
                                    photo.caption
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      )}
                  </div>
                </section>
              )}

              {/* LOCATION */}
              <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="p-7">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
                    Location
                  </p>

                  <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black">
                        Where this billboard is located
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        View the billboard location and surrounding area before starting your campaign.
                      </p>
                    </div>

                    <a
                      href={
                        googleMapsUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                    >
                      Open in Google Maps ↗
                    </a>
                  </div>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">

                    <div className="rounded-2xl bg-slate-50 p-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Area
                      </p>

                      <p className="mt-2 font-bold text-slate-800">
                        {billboard.location ||
                          "Saint Lucia"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Address
                      </p>

                      <p className="mt-2 font-bold text-slate-800">
                        {billboard.address ||
                          "Location details available on request"}
                      </p>
                    </div>
                  </div>

                  {locationSlug && (
                    <div className="mt-5">
                      <Link
                        href={`/locations/${locationSlug}`}
                        className="inline-flex rounded-xl bg-[#071226] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-orange-500"
                      >
                        Explore Billboard Advertising in{" "}
                        {billboard.location}
                      </Link>
                    </div>
                  )}
                </div>

                <div className="h-[360px] border-t border-slate-200 bg-slate-100">
                  <iframe
                    src={
                      mapEmbedUrl
                    }
                    title={`${billboard.billboard_name} location`}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0"
                  />
                </div>

                {!hasCoordinates && (
                  <div className="border-t border-orange-100 bg-orange-50 px-7 py-4">
                    <p className="text-sm text-orange-800">
                      This map is currently based on the billboard&apos;s listed area or address. Exact coordinates can be added from the Ernest Rentals CRM.
                    </p>
                  </div>
                )}
              </section>

              {/* DETAILS */}
              <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
                  Billboard Details
                </p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                  <Detail
                    label="Type"
                    value={
                      typeLabel
                    }
                  />

                  <Detail
                    label="Location"
                    value={
                      billboard.location ||
                      "—"
                    }
                  />

                  <Detail
                    label="Size"
                    value={
                      billboard.width_ft &&
                      billboard.height_ft
                        ? `${billboard.width_ft} × ${billboard.height_ft} ft`
                        : "Available on request"
                    }
                  />

                  <Detail
                    label="Orientation"
                    value={
                      billboard.orientation ||
                      "—"
                    }
                  />

                  <Detail
                    label="Faces"
                    value={String(
                      billboard.faces ||
                        1
                    )}
                  />

                  <Detail
                    label="Reference"
                    value={
                      billboard.billboard_code
                    }
                  />
                </div>
              </div>

              {/* SEO CONTENT */}
              <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-600">
                  Outdoor Advertising
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight">
                  Advertise with this billboard in{" "}
                  {billboard.location ||
                    "Saint Lucia"}.
                </h2>

                <p className="mt-4 leading-8 text-slate-600">
                  {billboard.billboard_name} is an Ernest Rentals{" "}
                  {typeLabel.toLowerCase()} advertising location serving{" "}
                  {billboard.location ||
                    "Saint Lucia"}. Businesses can review billboard details,
                  search campaign availability and submit an advertising
                  request directly online.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/billboards"
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                  >
                    Explore All Billboards
                  </Link>

                  <Link
                    href="/locations"
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                  >
                    Explore Billboard Locations
                  </Link>

                  {isDigital && (
                    <Link
                      href="/digital-screens"
                      className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                    >
                      Digital Billboard Advertising
                    </Link>
                  )}
                </div>
              </section>
            </div>

            {/* RIGHT SIDE */}
            <aside>
              <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">

                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
                  Campaign Availability
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Start advertising here
                </h2>

                {startDate &&
                changeoverDate ? (
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">

                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Requested Period
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold">
                          {
                            startDate
                          }
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          Starts 9:00 AM
                        </p>
                      </div>

                      <div className="text-slate-300">
                        →
                      </div>

                      <div className="text-right">
                        <p className="font-bold">
                          {
                            changeoverDate
                          }
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          Changeover 9:00 AM
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
                    Choose campaign dates in the search bar above to see live availability.
                  </div>
                )}

                {/* AVAILABILITY */}
                {availability && (
                  <div className="mt-6">

                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
                          Live Availability
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          Available for your dates
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Live
                      </span>
                    </div>

                    {isDigital ? (
                      <div className="space-y-2">

                        <AvailabilityCard
                          variant="standard"
                          label="Standard"
                          duration="10 sec"
                          count={
                            availability.available_standard_slots
                          }
                          noun="slots"
                        />

                        <AvailabilityCard
                          variant="premium"
                          label="Premium"
                          duration="15 sec"
                          count={
                            availability.available_premium_slots
                          }
                          noun="slots"
                        />

                        <AvailabilityCard
                          variant="shoutout"
                          label="Shoutout"
                          duration="15 sec"
                          count={
                            availability.available_shoutout_slots
                          }
                          noun="slots"
                        />
                      </div>
                    ) : (
                      <AvailabilityCard
                        variant="static"
                        label="Static Billboard"
                        duration="Face"
                        count={
                          availability.available_static_faces
                        }
                        noun={
                          availability.available_static_faces ===
                          1
                            ? "face"
                            : "faces"
                        }
                      />
                    )}
                  </div>
                )}

                <BillboardCampaignCTA
                  billboardId={
                    billboard.billboard_id
                  }
                  billboardName={
                    billboard.billboard_name
                  }
                  billboardType={
                    billboard.billboard_type
                  }
                  location={
                    billboard.location
                  }
                  startDate={
                    startDate
                  }
                  changeoverDate={
                    changeoverDate
                  }
                  available={
                    isAvailable
                  }
                />

                <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                  Submitting a request does not immediately reserve the billboard.
                  Ernest Rentals will confirm availability, package details and next steps.
                </p>
              </div>
            </aside>
          </div>

          {/* REVIEWS */}
          <BillboardReviews
            billboardId={
              billboard.billboard_id
            }
            billboardName={
              billboard.billboard_name
            }
          />

          {/* SHARE */}
          <section className="mx-auto mt-10 max-w-4xl">
            <BillboardShareButtons
              title={
                shareTitle
              }
              description={
                shareDescription
              }
              url={
                shareUrl
              }
            />
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function AvailabilityCard({
  variant,
  label,
  duration,
  count,
  noun,
}: {
  variant: AvailabilityVariant;
  label: string;
  duration: string;
  count: number;
  noun: string;
}) {
  const styles = {
    standard: {
      badge:
        "bg-sky-50 text-sky-700",
      count:
        "text-sky-700",
      border:
        "hover:border-sky-200",
    },

    premium: {
      badge:
        "bg-orange-50 text-orange-600",
      count:
        "text-orange-600",
      border:
        "hover:border-orange-200",
    },

    shoutout: {
      badge:
        "bg-violet-50 text-violet-700",
      count:
        "text-violet-700",
      border:
        "hover:border-violet-200",
    },

    static: {
      badge:
        "bg-emerald-50 text-emerald-700",
      count:
        "text-emerald-700",
      border:
        "hover:border-emerald-200",
    },
  };

  const selectedStyle =
    styles[variant];

  const soldOut =
    count <= 0;

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 transition ${selectedStyle.border}`}
    >
      <div className="flex min-w-0 items-center gap-3">

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-black ${selectedStyle.badge}`}
        >
          {duration}
        </div>

        <div className="min-w-0">
          <p className="font-extrabold text-slate-900">
            {label}
          </p>

          <p className="mt-0.5 text-xs text-slate-400">
            {soldOut
              ? "Currently fully booked"
              : "Available for selected dates"}
          </p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="flex items-baseline justify-end gap-1">

          <span
            className={`text-2xl font-black ${
              soldOut
                ? "text-slate-300"
                : selectedStyle.count
            }`}
          >
            {count}
          </span>

          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            {noun}
          </span>
        </div>

        {!soldOut && (
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
            Available
          </p>
        )}
      </div>
    </div>
  );
}