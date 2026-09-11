import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

import BillboardCampaignCTA from "@/components/BillboardCampaignCTA";

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

function createPublicServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

export default async function BillboardPage({
  params,
  searchParams,
}: BillboardPageProps) {
  const { id } = await params;
  const filters = await searchParams;

  const supabase =
    createPublicServerClient();

  const {
    data: billboardRows,
    error: billboardError,
  } = await supabase.rpc(
    "get_public_billboard_details",
    {
      p_billboard_id: id,
    }
  );

  if (
    billboardError ||
    !billboardRows ||
    billboardRows.length === 0
  ) {
    notFound();
  }

  const billboard =
    billboardRows[0] as BillboardDetails;

  const {
    data: photoRows,
  } = await supabase.rpc(
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
    filters.start || "";

  const changeoverDate =
    filters.end || "";

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

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#071226]">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <img
              src="/ernest-rentals-logo.png"
              alt="Ernest Rentals"
              className="h-10 w-10 object-contain"
            />

            <div>
              <p className="font-extrabold">
                ERNEST RENTALS
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Outdoor Advertising
              </p>
            </div>
          </Link>

          <Link
            href="/#availability"
            className="rounded-xl bg-[#071226] px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Check Availability
          </Link>
        </div>
      </header>

      {/* CONTENT */}
      <section className="px-5 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <Link
            href="/#availability"
            className="text-sm font-bold text-sky-600 transition hover:text-sky-700"
          >
            ← Back to availability
          </Link>

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
                      alt={
                        billboard.billboard_name
                      }
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

                        <p className="mt-3 text-lg text-slate-200">
                          {billboard.location ||
                            "Saint Lucia"}
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
                                `${billboard.billboard_name} photo ${
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

                    <p className="mt-3 text-lg text-slate-300">
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
                      isDigital
                        ? "Digital Billboard"
                        : "Static Billboard"
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
            </div>

            {/* RIGHT SIDE */}
            <aside>
              <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">

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
                    Choose campaign dates from the homepage to see live availability.
                  </div>
                )}

                {/* NEW AVAILABILITY DESIGN */}
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
                  Ernest Rentals will confirm availability, pricing and next steps.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
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