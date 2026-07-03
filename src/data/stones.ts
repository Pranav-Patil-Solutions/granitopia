/**
 * Typed stone catalog — real Granitopia products with real photography pulled
 * from granitopia.com (self-hosted under /public/images/stones). Drives the
 * featured grid, the 3D slab texture, and the collection + detail pages.
 *
 * TODO(assets): swap the low-res site thumbnails for high-res studio shots +
 * scanned PBR textures before go-live.
 */

export type Finish = "polished" | "leathered" | "honed" | "flamed";

export type StoneCategory =
  | "granite"
  | "marble"
  | "monuments"
  | "exotics"
  | "sandstone"
  | "tiles";

export interface Stone {
  slug: string;
  name: string;
  category: StoneCategory;
  /** Real product photo (also used as the 3D slab texture). */
  image: string;
  /** Dominant surface colour (hex) — fallback material tint + loading state. */
  heroColor: string;
  /** Secondary colour for veining/flecks (procedural fallback material). */
  veinColor: string;
  finishes: Finish[];
  origin: string;
  thickness: string;
  applications: string[];
  blurb: string;
}

export const stones: Stone[] = [
  {
    slug: "absolute-black",
    name: "Absolute Black",
    category: "granite",
    image: "/images/stones/absolute-black.jpg",
    heroColor: "#0b0b0d",
    veinColor: "#3a3a40",
    finishes: ["polished", "leathered", "honed", "flamed"],
    origin: "Karnataka, India",
    thickness: "18mm / 20mm / 30mm",
    applications: ["Countertops", "Flooring", "Cladding", "Monuments"],
    blurb:
      "A flawless jet-black granite with a mirror polish — the definitive choice for statement countertops and cladding.",
  },
  {
    slug: "black-galaxy",
    name: "Black Galaxy",
    category: "granite",
    image: "/images/stones/black-galaxy.jpg",
    heroColor: "#111119",
    veinColor: "#b89a5a",
    finishes: ["polished", "honed"],
    origin: "Andhra Pradesh, India",
    thickness: "18mm / 20mm / 30mm",
    applications: ["Countertops", "Feature walls", "Flooring"],
    blurb:
      "Deep black scattered with golden flecks that catch the light like a night sky.",
  },
  {
    slug: "tan-brown",
    name: "Tan Brown",
    category: "granite",
    image: "/images/stones/tan-brown.jpg",
    heroColor: "#3a2820",
    veinColor: "#7a4a3a",
    finishes: ["polished", "leathered", "flamed"],
    origin: "Rajasthan, India",
    thickness: "18mm / 20mm / 30mm",
    applications: ["Countertops", "Exterior cladding", "Steps"],
    blurb:
      "Warm chocolate and rust tones with excellent weather resistance for interiors and façades.",
  },
  {
    slug: "alaska-gold",
    name: "Alaska Gold",
    category: "granite",
    image: "/images/stones/alaska-gold.jpg",
    heroColor: "#6a5a3c",
    veinColor: "#d9c08a",
    finishes: ["polished", "leathered"],
    origin: "Imported",
    thickness: "18mm / 20mm / 30mm",
    applications: ["Countertops", "Feature walls", "Flooring"],
    blurb:
      "Golden-brown movement with a warm, glowing depth for feature surfaces.",
  },
  {
    slug: "brown-fantasy",
    name: "Brown Fantasy",
    category: "marble",
    image: "/images/stones/brown-fantasy.jpg",
    heroColor: "#4a3a2e",
    veinColor: "#b89a6a",
    finishes: ["polished", "honed"],
    origin: "Imported",
    thickness: "18mm / 20mm",
    applications: ["Feature walls", "Flooring", "Bathrooms", "Tabletops"],
    blurb:
      "A dark brown marble laced with fine golden veins — dramatic, warm and unmistakable.",
  },
  {
    slug: "rainforest-green",
    name: "Rainforest Green",
    category: "marble",
    image: "/images/stones/rainforest-green.jpg",
    heroColor: "#2f3a2c",
    veinColor: "#9caf88",
    finishes: ["polished", "honed"],
    origin: "Rajasthan, India",
    thickness: "18mm / 20mm",
    applications: ["Feature walls", "Bar tops", "Bathrooms"],
    blurb:
      "Exotic green marble with dendritic 'forest' veining, cut from Indian hillsides.",
  },
  {
    slug: "crystallo-divine",
    name: "Crystallo Divine",
    category: "exotics",
    image: "/images/stones/crystallo-divine.jpg",
    heroColor: "#d8d2c4",
    veinColor: "#8a94a0",
    finishes: ["polished", "honed"],
    origin: "Imported",
    thickness: "18mm / 20mm",
    applications: ["Feature walls", "Bar tops", "Backlit surfaces"],
    blurb:
      "A translucent, crystalline exotic that glows when backlit — pure luxury.",
  },
  {
    slug: "patagonia",
    name: "Patagonia",
    category: "exotics",
    image: "/images/stones/patagonia.jpg",
    heroColor: "#6a5a4a",
    veinColor: "#cbb48a",
    finishes: ["polished"],
    origin: "Imported",
    thickness: "18mm / 20mm / 30mm",
    applications: ["Feature walls", "Islands", "Statement surfaces"],
    blurb:
      "Bold, glacier-like movement in a rare exotic — a true statement stone.",
  },
  {
    slug: "mint-sandstone",
    name: "Mint Sandstone",
    category: "sandstone",
    image: "/images/stones/mint-sandstone.jpg",
    heroColor: "#9a8d6e",
    veinColor: "#c9bd97",
    finishes: ["honed", "flamed"],
    origin: "Rajasthan, India",
    thickness: "22mm / 30mm / 40mm",
    applications: ["Paving", "Facades", "Landscaping"],
    blurb:
      "A soft green-grey sandstone, naturally slip-resistant for paving and façades.",
  },
  {
    slug: "mahogany",
    name: "Mahogany",
    category: "monuments",
    image: "/images/stones/mahogany.jpg",
    heroColor: "#4a2b28",
    veinColor: "#7a3a2f",
    finishes: ["polished", "flamed"],
    origin: "Rajasthan, India",
    thickness: "As per drawing",
    applications: ["Memorials", "Headstones", "Plaques"],
    blurb:
      "A deep red-brown granite favoured for enduring memorials and monuments.",
  },
  {
    slug: "tandur-grey",
    name: "Tandur Grey",
    category: "tiles",
    image: "/images/stones/tandur-grey.jpg",
    heroColor: "#6b6b63",
    veinColor: "#9a9a8f",
    finishes: ["honed", "leathered"],
    origin: "Telangana, India",
    thickness: "20mm / 25mm",
    applications: ["Flooring", "Paving", "Cobbles"],
    blurb:
      "A hard-wearing grey limestone, ideal for flooring, paving and cobbles.",
  },
];

/** Curated subset shown in the Home "featured" grid + 3D showcase. */
export const featuredStones: Stone[] = [
  stones[0], // Absolute Black
  stones[1], // Black Galaxy
  stones[3], // Alaska Gold
  stones[4], // Brown Fantasy
  stones[5], // Rainforest Green
  stones[2], // Tan Brown
];

/** Display order for the Collections index. */
export const categoryOrder: StoneCategory[] = [
  "granite",
  "marble",
  "exotics",
  "sandstone",
  "monuments",
  "tiles",
];

export function getStone(slug: string): Stone | undefined {
  return stones.find((s) => s.slug === slug);
}

export function stonesInCategory(category: StoneCategory): Stone[] {
  return stones.filter((s) => s.category === category);
}

/** Representative photo for a category card. */
export function categoryImage(category: StoneCategory): string {
  return `/images/categories/${category}.jpg`;
}

export function categoryHeroColor(category: StoneCategory): string {
  return stonesInCategory(category)[0]?.heroColor ?? "#3e3333";
}

export function categoryVeinColor(category: StoneCategory): string {
  return stonesInCategory(category)[0]?.veinColor ?? "#7a6f5f";
}
