// Data-integrity regression test for the stone catalog.
// Guards the GRN-122 "remove Mahogany / monuments category" edit and the
// general shape every stone entry must satisfy for the collections routes
// (src/app/[locale]/collections/**) to render correctly.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { categoryOrder, getStone, stones, type StoneCategory } from "./stones";

const PUBLIC_DIR = join(__dirname, "..", "..", "public");

describe("stones catalog", () => {
  it("has at least one stone", () => {
    expect(stones.length).toBeGreaterThan(0);
  });

  it("gives every stone a category present in categoryOrder", () => {
    const known = new Set<StoneCategory>(categoryOrder);
    const offenders = stones.filter((s) => !known.has(s.category));
    expect(offenders.map((s) => `${s.slug}:${s.category}`)).toEqual([]);
  });

  it("has unique slugs", () => {
    const slugs = stones.map((s) => s.slug);
    const duplicates = slugs.filter((slug, i) => slugs.indexOf(slug) !== i);
    expect(duplicates).toEqual([]);
  });

  it("resolves every stone image to a file on disk", () => {
    const missing = stones
      .filter((s) => !existsSync(join(PUBLIC_DIR, s.image)))
      .map((s) => `${s.slug}: ${s.image}`);
    expect(missing).toEqual([]);
  });

  it("does not list categoryOrder entries with zero stones", () => {
    const used = new Set(stones.map((s) => s.category));
    const empty = categoryOrder.filter((c) => !used.has(c));
    expect(empty).toEqual([]);
  });

  // GRN-122 regression: the "monuments" category and its sole stone
  // (Mahogany) were retired; guard against silent re-introduction.
  it("spells Millennium Cream and still resolves the old slug", () => {
    const stone = getStone("millennium-cream");
    expect(stone?.name).toBe("Millennium Cream");
    expect(stone?.image).toBe("/images/stones/millennium-cream.jpg");
    expect(getStone("millenium-cream")?.slug).toBe("millennium-cream");
    expect(stones.some((s) => /millenium/i.test(s.name))).toBe(false);
    expect(stones.some((s) => s.slug === "millenium-cream")).toBe(false);
  });

  it("no longer contains the retired monuments category or mahogany stone", () => {
    expect(categoryOrder).not.toContain("monuments");
    expect(stones.some((s) => s.slug === "mahogany")).toBe(false);
    expect(stones.some((s) => (s.category as string) === "monuments")).toBe(
      false,
    );
  });
});
