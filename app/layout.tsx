import type {
  Metadata,
  Viewport,
} from "next";

import {
  Montserrat,
} from "next/font/google";

import "./globals.css";

const montserrat =
  Montserrat({
    subsets: [
      "latin",
    ],

    display:
      "swap",

    variable:
      "--font-montserrat",
  });

const siteUrl =
  process.env
    .NEXT_PUBLIC_SITE_URL ??
  "https://www.ernestrentals.com";

export const metadata:
  Metadata = {
  metadataBase:
    new URL(
      siteUrl
    ),

  /*
    SITE / BRAND NAME

    Keep Ernest Rentals prominent so Google has
    a consistent site-name signal across the site.
  */
  title: {
    default:
      "Ernest Rentals | Billboard Advertising in Saint Lucia",

    template:
      "%s | Ernest Rentals",
  },

  description:
    "Ernest Rentals provides static and digital billboard advertising across Saint Lucia. Explore billboard locations, check live availability and start your advertising campaign online.",

  applicationName:
    "Ernest Rentals",

  authors: [
    {
      name:
        "Ernest Rentals",

      url:
        siteUrl,
    },
  ],

  creator:
    "Ernest Rentals",

  publisher:
    "Ernest Rentals",

  category:
    "Outdoor Advertising",

  /*
    Do NOT place a global canonical here.

    Each important page should declare its own
    canonical URL so /billboards, /locations,
    /digital-screens and other pages can be
    indexed independently.
  */

  openGraph: {
    type:
      "website",

    locale:
      "en_LC",

    siteName:
      "Ernest Rentals",

    title:
      "Ernest Rentals | Billboard Advertising in Saint Lucia",

    description:
      "Explore static and digital billboard advertising across Saint Lucia. View locations, check live availability and start your campaign with Ernest Rentals.",

    images: [
      {
        url:
          "/ernest-rentals-logo.png",

        alt:
          "Ernest Rentals - Billboard Advertising in Saint Lucia",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Ernest Rentals | Billboard Advertising in Saint Lucia",

    description:
      "Explore static and digital billboard advertising opportunities across Saint Lucia.",

    images: [
      "/ernest-rentals-logo.png",
    ],
  },

  robots: {
    index:
      true,

    follow:
      true,

    googleBot: {
      index:
        true,

      follow:
        true,

      "max-image-preview":
        "large",

      "max-snippet":
        -1,

      "max-video-preview":
        -1,
    },
  },

  /*
    WEBSITE ICONS

    These now point to the proper favicon files
    we created instead of using the general logo
    for every favicon purpose.
  */
  icons: {
    icon: [
      {
        url:
          "/favicon.ico",

        sizes:
          "any",
      },

      {
        url:
          "/icon.png",

        type:
          "image/png",

        sizes:
          "256x256",
      },
    ],

    shortcut:
      "/favicon.ico",

    apple: [
      {
        url:
          "/apple-icon.png",

        type:
          "image/png",
      },
    ],
  },

  other: {
    "geo.region":
      "LC",

    "geo.placename":
      "Saint Lucia",
  },
};

export const viewport:
  Viewport = {
  width:
    "device-width",

  initialScale:
    1,

  themeColor:
    "#071226",
};

/*
  ============================================================
  STRUCTURED DATA
  ============================================================

  Google can use this information to better understand:

  - the site's preferred name;
  - the organization operating the site;
  - the relationship between the website and Ernest Rentals;
  - the primary services provided.
*/

const structuredData = {
  "@context":
    "https://schema.org",

  "@graph": [
    {
      "@type": [
        "Organization",
        "LocalBusiness",
      ],

      "@id":
        `${siteUrl}/#organization`,

      name:
        "Ernest Rentals",

      alternateName:
        "Ernest Rentals Saint Lucia",

      url:
        siteUrl,

      logo: {
        "@type":
          "ImageObject",

        url:
          `${siteUrl}/ernest-rentals-logo.png`,
      },

      image:
        `${siteUrl}/ernest-rentals-logo.png`,

      description:
        "Ernest Rentals provides static and digital billboard advertising and outdoor advertising opportunities across Saint Lucia.",

      telephone:
        "+1-758-713-3701",

      contactPoint: [
        {
          "@type":
            "ContactPoint",

          telephone:
            "+1-758-713-3701",

          contactType:
            "sales",

          areaServed:
            "LC",

          availableLanguage: [
            "English",
          ],
        },
      ],

      areaServed: {
        "@type":
          "Country",

        name:
          "Saint Lucia",
      },

      knowsAbout: [
        "Billboard Advertising",
        "Outdoor Advertising",
        "Digital Billboard Advertising",
        "Static Billboard Advertising",
        "Out-of-Home Advertising",
        "Roadside Advertising",
      ],

      serviceType: [
        "Billboard Advertising",
        "Digital Billboard Advertising",
        "Static Billboard Advertising",
        "Outdoor Advertising",
      ],
    },

    {
      "@type":
        "WebSite",

      "@id":
        `${siteUrl}/#website`,

      url:
        siteUrl,

      name:
        "Ernest Rentals",

      alternateName:
        [
          "Ernest Rentals Saint Lucia",
          "Ernest Rentals Billboards",
        ],

      description:
        "The official website of Ernest Rentals for static and digital billboard advertising in Saint Lucia.",

      publisher: {
        "@id":
          `${siteUrl}/#organization`,
      },

      inLanguage:
        "en-LC",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html
      lang="en-LC"
      className={
        montserrat.variable
      }
    >
      <body className="min-h-screen bg-[#f5f8fc] font-sans text-[#071226] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                structuredData
              ),
          }}
        />

        {children}
      </body>
    </html>
  );
}