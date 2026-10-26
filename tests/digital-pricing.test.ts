import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(
  new URL(
    "../supabase/migrations/20261025120000_update_digital_billboard_pricing.sql",
    import.meta.url
  ),
  "utf8"
);

const frequencySource = readFileSync(
  new URL("../lib/digital-play-frequency.ts", import.meta.url),
  "utf8"
);

function readNumericConstant(name: string) {
  const match = frequencySource.match(
    new RegExp(`export const ${name} =\\s*(\\d+);`)
  );

  assert.ok(match, `${name} should be declared as a numeric constant`);
  return Number(match[1]);
}

const expectedRates = [
  ["PACKAGE-STD-1W", 400],
  ["PACKAGE-STD-2W", 750],
  ["PACKAGE-STD-1M", 1400],
  ["PACKAGE-STD-3M", 3900],
  ["PACKAGE-STD-6M", 7200],
  ["PACKAGE-STD-12M", 13200],
  ["PACKAGE-PREM-1W", 600],
  ["PACKAGE-PREM-2W", 1100],
  ["PACKAGE-PREM-1M", 2100],
  ["PACKAGE-PREM-3M", 5700],
  ["PACKAGE-PREM-6M", 10800],
  ["PACKAGE-PREM-12M", 19800],
] as const;

test("website migration publishes the exact current rate card", () => {
  for (const [packageCode, price] of expectedRates) {
    assert.match(
      migration,
      new RegExp(`\\('${packageCode}'[\\s\\S]*?[, ]${price}, 'XCD'`)
    );
  }
});

test("commercial rotation keeps Standard and Premium capacity independent", () => {
  assert.equal(readNumericConstant("DIGITAL_STANDARD_SLOT_CAPACITY"), 8);
  assert.equal(readNumericConstant("DIGITAL_PREMIUM_SLOT_CAPACITY"), 4);
  assert.equal(readNumericConstant("DIGITAL_STANDARD_SLOT_SECONDS"), 10);
  assert.equal(readNumericConstant("DIGITAL_PREMIUM_SLOT_SECONDS"), 15);
  assert.equal(readNumericConstant("DIGITAL_RESERVED_CONTENT_SECONDS"), 45);
  assert.match(
    frequencySource,
    /DIGITAL_COMMERCIAL_ROTATION_SECONDS\s*=\s*[\s\S]*DIGITAL_STANDARD_SLOT_CAPACITY[\s\S]*DIGITAL_PREMIUM_SLOT_CAPACITY/
  );
  assert.match(
    frequencySource,
    /DIGITAL_ROTATION_SECONDS\s*=\s*[\s\S]*DIGITAL_COMMERCIAL_ROTATION_SECONDS\s*\+[\s\S]*DIGITAL_RESERVED_CONTENT_SECONDS/
  );
});

test("weekly full-capacity revenue matches the approved projection", () => {
  const standardCapacity = readNumericConstant(
    "DIGITAL_STANDARD_SLOT_CAPACITY"
  );
  const premiumCapacity = readNumericConstant(
    "DIGITAL_PREMIUM_SLOT_CAPACITY"
  );
  const weeklyRevenue =
    standardCapacity * 400 + premiumCapacity * 600;

  assert.equal(weeklyRevenue, 5600);
  assert.equal(weeklyRevenue * 52, 291200);
  assert.equal(
    Number(
      (
        (weeklyRevenue * 52) /
        12
      ).toFixed(2)
    ),
    24266.67
  );
});
