export const COMBO_DISCOUNT_BY_TERM = {
  3: 0.1,
  6: 0.125,
  12: 0.15,
} as const;

export type ComboTerm =
  keyof typeof COMBO_DISCOUNT_BY_TERM;

export type ComboCalculation = {
  term: ComboTerm;
  discountRate: number;
  premiumDigitalTotal: number;
  premiumDigitalMonthly: number;
  staticRentalTotal: number;
  staticSavings: number;
  discountedStaticRental: number;
  comboTotal: number;
  effectiveMonthlyValue: number;
};

export type ComboInquirySelection = {
  term: ComboTerm;
  digitalPackageId: string;
  staticPackageId: string;
};

export function isComboTerm(
  value: number
): value is ComboTerm {
  return value === 3 ||
    value === 6 ||
    value === 12;
}

export function calculateCombo({
  term,
  premiumDigitalTotal,
  staticRentalTotal,
}: {
  term: ComboTerm;
  premiumDigitalTotal: number;
  staticRentalTotal: number;
}): ComboCalculation {
  const discountRate =
    COMBO_DISCOUNT_BY_TERM[
      term
    ];

  const staticSavings =
    staticRentalTotal *
    discountRate;

  const discountedStaticRental =
    staticRentalTotal -
    staticSavings;

  const comboTotal =
    premiumDigitalTotal +
    discountedStaticRental;

  return {
    term,
    discountRate,
    premiumDigitalTotal,
    premiumDigitalMonthly:
      premiumDigitalTotal /
      term,
    staticRentalTotal,
    staticSavings,
    discountedStaticRental,
    comboTotal,
    effectiveMonthlyValue:
      comboTotal /
      term,
  };
}

export function formatDiscount(
  value: number
) {
  return `${new Intl.NumberFormat(
    "en-LC",
    {
      maximumFractionDigits:
        1,
    }
  ).format(value * 100)}%`;
}
