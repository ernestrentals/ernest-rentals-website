import type {
  Metadata,
  Viewport,
} from "next";

import { Montserrat } from "next/font/google";

import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://www.ernestrentals.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "Billboard & Outdoor Advertising in Saint Lucia | Ernest Rentals",
    template:
      "%s | Ernest Rentals",
  },

  description:
    "Advertise across Saint Lucia with Ernest Rentals. Explore static and digital billboard locations, check availability, compare advertising options and start your campaign online.",

  applicationName:
    "Ernest Rentals",

  authors: [
    {
      name: "Ernest Rentals",
      url: siteUrl,
    },
  ],

  creator:
    "Ernest Rentals",

  publisher:
    "Ernest Rentals",

  category:
    "Outdoor Advertising",

  keywords: [
    "billboard advertising Saint Lucia",
    "billboards Saint Lucia",
    "outdoor advertising Saint Lucia",
    "digital billboards Saint Lucia",
    "digital billboard advertising Saint Lucia",
    "static billboards Saint Lucia",
    "billboard rental Saint Lucia",
    "LED billboard Saint Lucia",
    "OOH advertising Saint Lucia",
    "out of home advertising Saint Lucia",
    "roadside advertising Saint Lucia",
    "advertising Castries Saint Lucia",
    "digital advertising Saint Lucia",
    "Ernest Rentals",
  ],

  alternates: {
    canonical:
      "/",
  },

  openGraph: {
    type:
      "website",

    locale:
      "en_LC",

    url:
      "/",

    siteName:
      "Ernest Rentals",

    title:
      "Billboard & Outdoor Advertising in Saint Lucia | Ernest Rentals",

    description:
      "Explore static and digital billboard advertising across Saint Lucia. Search locations, check availability and start your campaign with Ernest Rentals.",

    images: [
      {
        url:
          "/ernest-rentals-logo.png",

        alt:
          "Ernest Rentals Billboard and Outdoor Advertising in Saint Lucia",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Billboard & Outdoor Advertising in Saint Lucia | Ernest Rentals",

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

  icons: {
    icon: [
      {
        url:
          "/ernest-rentals-logo.png",

        type:
          "image/png",
      },
    ],

    shortcut:
      "/ernest-rentals-logo.png",

    apple:
      "/ernest-rentals-logo.png",
  },

  other: {
    "geo.region":
      "LC",

    "geo.placename":
      "Saint Lucia",
  },
};

export const viewport: Viewport = {
  width:
    "device-width",

  initialScale:
    1,

  themeColor:
    "#071226",
};

const organizationStructuredData = {
  "@context":
    "https://schema.org",

  "@type": [
    "Organization",
    "LocalBusiness",
  ],

  "@id":
    "https://www.ernestrentals.com/#organization",

  name:
    "Ernest Rentals",

  url:
    "https://www.ernestrentals.com",

  logo:
    "https://www.ernestrentals.com/ernest-rentals-logo.png",

  image:
    "https://www.ernestrentals.com/ernest-rentals-logo.png",

  description:
    "Ernest Rentals provides static and digital billboard advertising and outdoor advertising opportunities across Saint Lucia.",

  telephone:
    "+1-758-713-3701",

  areaServed: {
    "@type":
      "Country",

    name:
      "Saint Lucia",
  },

  knowsAbout: [
    "Billboard Advertising",
    "Outdoor Advertising",
    "Digital Billboards",
    "Static Billboards",
    "Out-of-Home Advertising",
    "Roadside Advertising",
  ],

  serviceType: [
    "Billboard Advertising",
    "Digital Billboard Advertising",
    "Static Billboard Advertising",
    "Outdoor Advertising",
  ],
};

const websiteStructuredData = {
  "@context":
    "https://schema.org",

  "@type":
    "WebSite",

  "@id":
    "https://www.ernestrentals.com/#website",

  url:
    "https://www.ernestrentals.com",

  name:
    "Ernest Rentals",

  publisher: {
    "@id":
      "https://www.ernestrentals.com/#organization",
  },

  inLanguage:
    "en",
};

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={montserrat.variable}
    >
      <body className="min-h-screen bg-[#f5f8fc] font-sans text-[#071226] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                organizationStructuredData
              ),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                websiteStructuredData
              ),
          }}
        />

        {children}
      </body>
    </html>
  );
}