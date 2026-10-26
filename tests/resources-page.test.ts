import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("app/resources/page.tsx", "utf8");
const header = readFileSync("components/SiteHeader.tsx", "utf8");
const footer = readFileSync("components/SiteFooter.tsx", "utf8");
const sitemap = readFileSync("app/sitemap.ts", "utf8");

test("publishes both current rate-card downloads", () => {
  const downloads = [
    "ernest-rentals-digital-billboard-rate-card-2026.pdf",
    "ernest-rentals-static-billboard-rate-card-2026.pdf",
  ];

  for (const file of downloads) {
    assert.match(page, new RegExp(file.replaceAll(".", "\\.")));
    assert.equal(existsSync(`public/downloads/${file}`), true);
  }
});

test("directs customers to artwork guidance and a custom proposal", () => {
  assert.match(page, /Billboard Artwork Guidelines/);
  assert.match(page, /Custom Advertising Proposal/);
  assert.match(page, /Request Proposal/);
  assert.match(page, /href: "\/artwork-guidelines"/);
  assert.match(page, /href="\/contact"/);
});

test("adds Resources to desktop, mobile and footer navigation", () => {
  assert.match(header, /href: "\/resources"[\s\S]*label: "Resources"/);
  assert.match(footer, /href: "\/resources"[\s\S]*label: "Resources"/);
  assert.match(footer, /Customer Resources/);
  assert.match(sitemap, /`\$\{siteUrl\}\/resources`/);
});
