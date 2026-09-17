import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const siteUrl =
  (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://www.ernestrentals.com"
  ).replace(/\/$/, "");

const locationSlugs = [
  "dennery",
  "mamiku",
  "mon-repos",
  "piaye",
  "praslin",
  "richford",
  "rodney-bay",
];

type SitemapBillboard = {
  billboard_id: string;
  billboard_code: string;
  billboard_name: string;
  location: string | null;
  billboard_type: string;
};

export const revalidate = 3600;

function createPublicServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now =
    new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url:
        `${siteUrl}/`,
      lastModified:
        now,
      changeFrequency:
        "weekly",
      priority:
        1,
    },

    {
      url:
        `${siteUrl}/billboards`,
      lastModified:
        now,
      changeFrequency:
        "daily",
      priority:
        0.95,
    },

    {
      url:
        `${siteUrl}/digital-screens`,
      lastModified:
        now,
      changeFrequency:
        "weekly",
      priority:
        0.9,
    },

    {
      url:
        `${siteUrl}/locations`,
      lastModified:
        now,
      changeFrequency:
        "weekly",
      priority:
        0.9,
    },

    {
      url:
        `${siteUrl}/how-it-works`,
      lastModified:
        now,
      changeFrequency:
        "monthly",
      priority:
        0.75,
    },

    {
      url:
        `${siteUrl}/contact`,
      lastModified:
        now,
      changeFrequency:
        "monthly",
      priority:
        0.7,
    },
  ];

  const locationPages: MetadataRoute.Sitemap =
    locationSlugs.map(
      (slug) => ({
        url:
          `${siteUrl}/locations/${slug}`,

        lastModified:
          now,

        changeFrequency:
          "weekly",

        priority:
          0.85,
      })
    );

  const supabase =
    createPublicServerClient();

  const {
    data,
    error,
  } =
    await supabase.rpc(
      "get_public_billboard_sitemap"
    );

  if (error) {
    console.error(
      "Unable to load public billboards for sitemap:",
      error
    );
  }

  const billboards =
    (data ??
      []) as SitemapBillboard[];

  const billboardPages: MetadataRoute.Sitemap =
    billboards.map(
      (billboard) => ({
        url:
          `${siteUrl}/billboards/${billboard.billboard_id}`,

        changeFrequency:
          "weekly",

        priority:
          billboard.billboard_type ===
          "digital"
            ? 0.9
            : 0.85,
      })
    );

  return [
    ...staticPages,
    ...locationPages,
    ...billboardPages,
  ];
}