import type {
  Metadata,
  Viewport,
} from "next";

import { Montserrat } from "next/font/google";

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
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://ernest-rentals-website.vercel.app";

export const metadata: Metadata = {
  metadataBase:
    new URL(
      siteUrl
    ),

  title: {
    default:
      "Ernest Rentals | Billboard Advertising in Saint Lucia",
    template:
      "%s | Ernest Rentals",
  },

  description:
    "Search static and digital billboard advertising opportunities across Saint Lucia. Compare locations, check availability, view packages and start your Ernest Rentals campaign online.",

  applicationName:
    "Ernest Rentals",

  authors: [
    {
      name:
        "Ernest Rentals",
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
    "digital billboard Saint Lucia",
    "static billboard Saint Lucia",
    "outdoor advertising Saint Lucia",
    "advertising Saint Lucia",
    "Ernest Rentals",
    "billboard rental Saint Lucia",
    "digital advertising Saint Lucia",
    "roadside advertising Saint Lucia",
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
      "Ernest Rentals | Billboard Advertising in Saint Lucia",
    description:
      "Discover static and digital billboard advertising opportunities across Saint Lucia. Search locations, check availability and start your campaign online.",
    images: [
      {
        url:
          "/ernest-rentals-logo.png",
        width:
          1200,
        height:
          630,
        alt:
          "Ernest Rentals Outdoor Advertising",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",
    title:
      "Ernest Rentals | Billboard Advertising in Saint Lucia",
    description:
      "Search static and digital billboard advertising opportunities across Saint Lucia.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={
        montserrat.variable
      }
    >
      <body className="min-h-screen bg-[#f5f8fc] font-sans text-[#071226] antialiased">
        {children}
      </body>
    </html>
  );
}
