import { unstable_cache } from "next/cache";

import { createClient } from "@supabase/supabase-js";

export type PublicDigitalPackage = {
  package_id: string;
  package_code: string;
  package_name: string;
  package_type: "standard" | "premium" | "shoutout" | string;
  slot_duration_seconds: number | null;
  duration_value: number | null;
  duration_unit: string | null;
  duration_label: string | null;
  price: number;
  currency_code: string;
  includes_ad_creation: boolean;
};

export type PublicStaticPackage = {
  package_id: string;
  billboard_id: string;
  package_code: string;
  package_name: string;
  duration_value: number | null;
  duration_unit: string | null;
  duration_label: string | null;
  price: number;
  currency_code: string;
};

export type PublicBillboard = {
  billboard_id: string;
  billboard_code: string;
  billboard_name: string;
  location: string | null;
  billboard_type: string;
  image_url: string | null;
};

export type PublicCreativeService = {
  service_id: string;
  service_code: string;
  service_name: string;
  service_description: string | null;
  service_category: string;
  price: number;
  currency_code: string;
  included_revisions: number;
  subject_to_availability: boolean;
};

export type PublicPricingCatalog = {
  digitalPackages: PublicDigitalPackage[];
  staticPackages: PublicStaticPackage[];
  billboards: PublicBillboard[];
  creativeServices: PublicCreativeService[];
};

function createPublicServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

async function loadPublicPricing(): Promise<PublicPricingCatalog> {
  const supabase =
    createPublicServerClient();

  const [
    digitalResult,
    staticResult,
    billboardResult,
    creativeResult,
  ] = await Promise.all([
    supabase.rpc(
      "get_public_ad_packages",
      {
        p_billboard_type:
          "digital",
      }
    ),
    supabase.rpc(
      "get_public_static_billboard_packages"
    ),
    supabase.rpc(
      "get_public_location_billboards"
    ),
    supabase.rpc(
      "get_public_creative_services"
    ),
  ]);

  if (
    digitalResult.error
  ) {
    console.error(
      "Unable to load public digital pricing:",
      digitalResult.error
    );
  }

  if (
    staticResult.error
  ) {
    console.error(
      "Unable to load public static pricing:",
      staticResult.error
    );
  }

  if (
    billboardResult.error
  ) {
    console.error(
      "Unable to load public billboard inventory:",
      billboardResult.error
    );
  }

  if (
    creativeResult.error
  ) {
    console.error(
      "Unable to load public creative-service pricing:",
      creativeResult.error
    );
  }

  if (
    digitalResult.error &&
    staticResult.error
  ) {
    throw new Error(
      "The public pricing catalogue is temporarily unavailable."
    );
  }

  return {
    digitalPackages:
      (digitalResult.data ??
        []) as PublicDigitalPackage[],
    staticPackages:
      (staticResult.data ??
        []) as PublicStaticPackage[],
    billboards:
      (billboardResult.data ??
        []) as PublicBillboard[],
    creativeServices:
      (creativeResult.data ??
        []) as PublicCreativeService[],
  };
}

const getCachedPublicPricing =
  unstable_cache(
    loadPublicPricing,
    [
      "public-advertising-pricing-v2",
    ],
    {
      revalidate:
        300,
      tags: [
        "public-advertising-pricing",
      ],
    }
  );

export async function getPublicPricing(): Promise<PublicPricingCatalog> {
  try {
    return await getCachedPublicPricing();
  } catch (
    error
  ) {
    console.error(
      "Unable to load the public pricing catalogue:",
      error
    );

    return {
      digitalPackages:
        [],
      staticPackages:
        [],
      billboards:
        [],
      creativeServices:
        [],
    };
  }
}

export function packagesByType(
  packages:
    PublicDigitalPackage[],
  packageType:
    "standard" | "premium" | "shoutout"
) {
  return packages
    .filter(
      (item) =>
        item.package_type
          .trim()
          .toLowerCase() ===
        packageType
    )
    .sort(
      (a, b) => {
        const unitOrder = {
          day: 1,
          week: 2,
          month: 3,
        } as Record<string, number>;

        const unitDifference =
          (unitOrder[
            a.duration_unit ??
              ""
          ] ?? 99) -
          (unitOrder[
            b.duration_unit ??
              ""
          ] ?? 99);

        if (
          unitDifference !==
          0
        ) {
          return unitDifference;
        }

        return (
          (a.duration_value ??
            0) -
          (b.duration_value ??
            0)
        );
      }
    );
}

export function monthlyPackagePrice(
  item:
    Pick<
      PublicDigitalPackage,
      "duration_unit" | "duration_value" | "price"
    >
) {
  if (
    item.duration_unit !==
      "month" ||
    !item.duration_value ||
    item.duration_value <
      3
  ) {
    return null;
  }

  return (
    item.price /
    item.duration_value
  );
}

export function formatXcd(
  amount:
    number,
  maximumFractionDigits =
    0
) {
  return `EC$${new Intl.NumberFormat(
    "en-LC",
    {
      minimumFractionDigits:
        0,
      maximumFractionDigits,
    }
  ).format(amount)}`;
}
