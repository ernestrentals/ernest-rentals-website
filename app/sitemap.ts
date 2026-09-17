import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://www.ernestrentals.com";

const locationSlugs = [
  "dennery",
  "mamiku",
  "mon-repos",
  "piaye",
  "praslin",
  "richford",
  "rodney-bay",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/billboards`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/digital-screens`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/locations`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/how-it-works`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const locationPages: MetadataRoute.Sitemap =
    locationSlugs.map((slug) => ({
      url: `${siteUrl}/locations/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    }));

  return [
    ...staticPages,
    ...locationPages,
  ];
}