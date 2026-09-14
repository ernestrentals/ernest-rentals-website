import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:
      "Ernest Rentals",
    short_name:
      "Ernest Rentals",
    description:
      "Static and digital billboard advertising across Saint Lucia.",
    start_url:
      "/",
    display:
      "standalone",
    background_color:
      "#F5F8FC",
    theme_color:
      "#071226",
    icons: [
      {
        src:
          "/ernest-rentals-logo.png",
        sizes:
          "any",
        type:
          "image/png",
      },
    ],
  };
}
