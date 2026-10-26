import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(
  new URL(
    "../supabase/migrations/20261025220000_update_shoutout_daily_pricing.sql",
    import.meta.url
  ),
  "utf8"
);

const pricingComponent = readFileSync(
  new URL("../components/DigitalPricingCards.tsx", import.meta.url),
  "utf8"
);

const digitalPage = readFileSync(
  new URL("../app/digital-screens/page.tsx", import.meta.url),
  "utf8"
);

const expectedDailyPrices = [50, 100, 150, 200, 250, 300, 350];

test("publishes seven daily Shoutout packages at EC$50 per day", () => {
  expectedDailyPrices.forEach((price, index) => {
    const days = index + 1;

    assert.match(
      migration,
      new RegExp(
        `PACKAGE-SHOUT-DAILY-${days}D'[\\s\\S]*?'shoutout', 15, ${days}, 'day', '${days} Day${days === 1 ? "" : "s"}', ${price}, 'XCD'`
      )
    );
  });
});

test("website presents the official daily rate and calculation", () => {
  assert.match(pricingComponent, /Premium Shoutouts/);
  assert.match(pricingComponent, /dailyRate/);
  assert.match(pricingComponent, /number of days/);
  assert.match(pricingComponent, /15-second Shoutout/);
  assert.match(digitalPage, /EC\$50 per day/);
});

test("legacy Shoutout options are archived without altering other products", () => {
  assert.match(migration, /status = 'inactive'/);
  assert.doesNotMatch(migration, /delete\s+from\s+public\.ad_packages/i);
  assert.doesNotMatch(migration, /PACKAGE-STD-|PACKAGE-PREM-/);
  assert.doesNotMatch(migration, /INTERNAL-SMALL-BIZ-3D/);
});
