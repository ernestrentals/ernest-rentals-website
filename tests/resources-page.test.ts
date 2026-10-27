import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("app/resources/page.tsx", "utf8");
const header = readFileSync("components/SiteHeader.tsx", "utf8");
const footer = readFileSync("components/SiteFooter.tsx", "utf8");
const sitemap = readFileSync("app/sitemap.ts", "utf8");

test("publishes all current customer downloads", () => {
  const downloads = [
    "ernest-rentals-digital-billboard-rate-card-2026.pdf",
    "ernest-rentals-static-billboard-rate-card-2026.pdf",
    "ernest-rentals-static-billboard-artwork-guide.pdf",
    "ernest-rentals-digital-artwork-guide.pdf",
    "ernest-rentals-advertising-proposal.pdf",
    "ernest-rentals-exclusive-advertising-proposal.pdf",
  ];

  for (const file of downloads) {
    assert.match(page, new RegExp(file.replaceAll(".", "\\.")));
    assert.equal(existsSync(`public/downloads/${file}`), true);
  }
});

test("directs customers to artwork guidance and a custom proposal", () => {
  assert.match(page, /Billboard Artwork Guidelines/);
  assert.match(page, /Request a Custom Proposal/);
  assert.match(page, /href: "\/artwork-guidelines"/);
  assert.match(page, /href="\/contact"/);
});

test("keeps Resources out of the main menu and available elsewhere", () => {
  assert.doesNotMatch(header, /href: "\/resources"[\s\S]*label: "Resources"/);
  assert.match(footer, /href: "\/resources"[\s\S]*label: "Resources"/);
  assert.match(footer, /Customer Resources/);
  assert.match(sitemap, /`\$\{siteUrl\}\/resources`/);
});
