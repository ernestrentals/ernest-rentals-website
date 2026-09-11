"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import StartCampaignForm from "@/components/StartCampaignForm";
import { createBrowserClient } from "@/lib/supabase/client";

type BillboardCampaignCTAProps = {
  billboardId: string;
  billboardName: string;
  billboardType: string;
  location: string | null;
  startDate: string;
  changeoverDate: string;
  available: boolean;
};

type PublicAdPackage = {
  package_id: string;
  package_code: string;
  package_name: string;
  package_type: string;
  slot_duration_seconds: number | null;
  duration_value: number | null;
  duration_unit: string | null;
  duration_label: string | null;
  price: number;
  currency_code: string;
  includes_ad_creation: boolean;
};

function formatMoney(
  value: number,
  currency: string
) {
  try {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }
    ).format(value);
  } catch {
    return `${currency} ${value.toFixed(0)}`;
  }
}

function packageTypeLabel(
  packageType: string
) {
  switch (packageType.toLowerCase()) {
    case "standard":
      return "Standard";

    case "premium":
      return "Premium";

    case "shoutout":
      return "Shoutout";

    case "static":
      return "Static Billboard";

    default:
      return packageType
        .replaceAll("_", " ")
        .replace(
          /\b\w/g,
          (letter) =>
            letter.toUpperCase()
        );
  }
}

function packageDescription(
  adPackage: PublicAdPackage
) {
  const parts: string[] = [];

  if (
    adPackage.slot_duration_seconds
  ) {
    parts.push(
      `${adPackage.slot_duration_seconds}-second ad`
    );
  }

  if (
    adPackage.duration_label
  ) {
    parts.push(
      adPackage.duration_label
    );
  } else if (
    adPackage.duration_value &&
    adPackage.duration_unit
  ) {
    parts.push(
      `${adPackage.duration_value} ${adPackage.duration_unit}${
        adPackage.duration_value === 1
          ? ""
          : "s"
      }`
    );
  }

  return (
    parts.join(" · ") ||
    "Campaign package"
  );
}

export default function BillboardCampaignCTA({
  billboardId,
  billboardName,
  billboardType,
  location,
  startDate,
  changeoverDate,
  available,
}: BillboardCampaignCTAProps) {
  const supabase =
    useMemo(
      () =>
        createBrowserClient(),
      []
    );

  const [
    open,
    setOpen,
  ] =
    useState(false);

  const [
    packages,
    setPackages,
  ] =
    useState<
      PublicAdPackage[]
    >([]);

  const [
    loadingPackages,
    setLoadingPackages,
  ] =
    useState(true);

  const [
    packageError,
    setPackageError,
  ] =
    useState("");

  const [
    selectedPackageId,
    setSelectedPackageId,
  ] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPackages() {
      setLoadingPackages(true);
      setPackageError("");

      const {
        data,
        error,
      } =
        await supabase.rpc(
          "get_public_ad_packages",
          {
            p_billboard_type:
              billboardType,
          }
        );

      if (cancelled) {
        return;
      }

      if (error) {
        console.error(error);

        setPackageError(
          "Pricing is available on request."
        );

        setPackages([]);
        setLoadingPackages(false);

        return;
      }

      const loadedPackages =
        (data ??
          []) as PublicAdPackage[];

      setPackages(
        loadedPackages
      );

      if (
        loadedPackages.length >
        0
      ) {
        setSelectedPackageId(
          loadedPackages[0]
            .package_id
        );
      }

      setLoadingPackages(false);
    }

    loadPackages();

    return () => {
      cancelled = true;
    };
  }, [
    billboardType,
    supabase,
  ]);

  const selectedPackage =
    packages.find(
      (item) =>
        item.package_id ===
        selectedPackageId
    ) ?? null;

  return (
    <>
      {/* PACKAGE SELECTOR */}
      <div className="mt-6 border-t border-slate-100 pt-6">

        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
          Advertising Package
        </p>

        <h3 className="mt-1 text-lg font-black text-[#071226]">
          Choose your package
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Select the advertising package that best suits your campaign.
        </p>

        {loadingPackages ? (
          <div className="mt-4 rounded-xl bg-slate-50 px-4 py-5 text-center text-sm text-slate-400">
            Loading packages...
          </div>
        ) : packages.length > 0 ? (
          <>
            <div className="mt-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
                  Package
                </span>

                <select
                  value={
                    selectedPackageId
                  }
                  onChange={(
                    event
                  ) =>
                    setSelectedPackageId(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  {packages.map(
                    (
                      adPackage
                    ) => (
                      <option
                        key={
                          adPackage.package_id
                        }
                        value={
                          adPackage.package_id
                        }
                      >
                        {
                          adPackage.package_name
                        }{" "}
                        —{" "}
                        {formatMoney(
                          Number(
                            adPackage.price
                          ),
                          adPackage.currency_code
                        )}
                      </option>
                    )
                  )}
                </select>
              </label>
            </div>

            {selectedPackage && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Selected Package
                    </p>

                    <p className="mt-1 font-black text-slate-900">
                      {
                        selectedPackage.package_name
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {packageTypeLabel(
                        selectedPackage.package_type
                      )}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Price
                    </p>

                    <p className="mt-1 text-xl font-black text-orange-500">
                      {formatMoney(
                        Number(
                          selectedPackage.price
                        ),
                        selectedPackage.currency_code
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-200 pt-4">
                  <p className="text-sm font-semibold text-slate-700">
                    {packageDescription(
                      selectedPackage
                    )}
                  </p>

                  {selectedPackage.includes_ad_creation && (
                    <p className="mt-2 text-xs font-semibold text-sky-700">
                      ✓ Ad creation included
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">
              Pricing available on request
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Submit a campaign request and Ernest Rentals will provide pricing for this billboard.
            </p>
          </div>
        )}

        {packageError && (
          <p className="mt-3 text-xs text-slate-400">
            {packageError}
          </p>
        )}
      </div>

      {/* CTA */}
      <button
        type="button"
        disabled={
          !available ||
          !startDate ||
          !changeoverDate ||
          (
            packages.length > 0 &&
            !selectedPackage
          )
        }
        onClick={() =>
          setOpen(true)
        }
        className="mt-5 w-full rounded-xl bg-orange-500 px-5 py-4 font-extrabold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {available
          ? "Start Campaign"
          : "Currently Unavailable"}
      </button>

      {!startDate ||
      !changeoverDate ? (
        <p className="mt-3 text-center text-xs text-slate-400">
          Choose campaign dates from the homepage first.
        </p>
      ) : null}

      {open && (
        <StartCampaignForm
          billboardId={
            billboardId
          }
          billboardName={
            billboardName
          }
          billboardType={
            billboardType
          }
          location={
            location
          }
          startDate={
            startDate
          }
          changeoverDate={
            changeoverDate
          }

          selectedPackageId={
            selectedPackage?.package_id ??
            null
          }

          selectedPackageName={
            selectedPackage?.package_name ??
            null
          }

          selectedPackageCode={
            selectedPackage?.package_code ??
            null
          }

          selectedPackageType={
            selectedPackage?.package_type ??
            null
          }

          selectedPackagePrice={
            selectedPackage
              ? Number(
                  selectedPackage.price
                )
              : null
          }

          selectedPackageCurrency={
            selectedPackage?.currency_code ??
            null
          }

          selectedPackageDurationLabel={
            selectedPackage?.duration_label ??
            null
          }

          selectedPackageSlotDuration={
            selectedPackage?.slot_duration_seconds ??
            null
          }

          selectedPackageIncludesAdCreation={
            selectedPackage?.includes_ad_creation ??
            false
          }

          onClose={() =>
            setOpen(false)
          }
        />
      )}
    </>
  );
}