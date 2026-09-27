import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { categoryValidator } from "./schema";

/**
 * Boutiq product catalogue — Indian women's wear.
 *
 * Version 1 scope: shoppers browse a curated catalogue. Data is seeded into
 * Convex and served through reactive queries; there is no cart, checkout or
 * admin flow in v1.
 */

const SEED_PRODUCTS = [
  {
    name: "Rani Handblock Cotton Kurta",
    brand: "Boutiq Studio",
    category: "kurtas" as const,
    subcategory: "Cotton Kurtas",
    price: 1690,
    mrp: 2450,
    rating: 4.8,
    ratingCount: 312,
    colors: ["Indigo", "Ivory"],
    sizes: ["XS", "S", "M", "L", "XL"],
    tags: ["bestseller"],
    photoId: "photo-1583394838336-acd977736f90",
    notes: "Hand-block printed mul cotton with wooden buttons and side slits.",
  },
  {
    name: "Meenakari Chanderi Kurta",
    brand: "Boutiq Studio",
    category: "kurtas" as const,
    subcategory: "Silk Kurtas",
    price: 2890,
    mrp: 4200,
    rating: 4.7,
    ratingCount: 164,
    colors: ["Emerald", "Maroon"],
    sizes: ["S", "M", "L", "XL"],
    tags: ["new"],
    photoId: "photo-1610030469983-98e550d6193c",
    notes: "Chanderi silk-cotton with gota detailing along the yoke.",
  },
  {
    name: "Gulmohar Angrakha Kurta",
    brand: "Atelier Gul",
    category: "kurtas" as const,
    subcategory: "Angrakha",
    price: 2340,
    mrp: 3400,
    rating: 4.6,
    ratingCount: 98,
    colors: ["Mustard", "Rust"],
    sizes: ["XS", "S", "M", "L"],
    tags: [],
    photoId: "photo-1594633312681-425c7b97ccd1",
    notes: "Tie-up angrakha silhouette in soft handloom cotton.",
  },
  {
    name: "Naintara Chikankari Kurta",
    brand: "Awadh Label",
    category: "kurtas" as const,
    subcategory: "Chikankari",
    price: 3190,
    mrp: 4600,
    rating: 4.9,
    ratingCount: 76,
    colors: ["Ivory", "Powder Blue"],
    sizes: ["S", "M", "L"],
    tags: ["bestseller", "new"],
    photoId: "photo-1596755094514-f87e34085b2c",
    notes: "Lucknowi chikankari hand embroidery on georgette.",
  },
  {
    name: "Banarasi Silk Saree",
    brand: "Vastraa House",
    category: "sarees" as const,
    subcategory: "Banarasi",
    price: 6490,
    mrp: 9200,
    rating: 4.8,
    ratingCount: 142,
    colors: ["Deep Maroon", "Antique Gold"],
    sizes: ["Free Size"],
    tags: ["bestseller"],
    photoId: "photo-1583496661160-fb5886a0aaaa",
    notes: "Pure Katan silk with real zari brocade and unstitched blouse piece.",
  },
  {
    name: "Kanjivaram Temple-Border Saree",
    brand: "Vastraa House",
    category: "sarees" as const,
    subcategory: "Kanjivaram",
    price: 8990,
    mrp: 12800,
    rating: 4.9,
    ratingCount: 61,
    colors: ["Emerald", "Rani Pink"],
    sizes: ["Free Size"],
    tags: [],
    photoId: "photo-1610652492500-ded49ceeb378",
    notes: "Woven temple border in korvai technique, silk mark certified.",
  },
  {
    name: "Chanderi Everyday Saree",
    brand: "Boutiq Studio",
    category: "sarees" as const,
    subcategory: "Chanderi",
    price: 3890,
    mrp: 5400,
    rating: 4.6,
    ratingCount: 87,
    colors: ["Blush", "Sage"],
    sizes: ["Free Size"],
    tags: ["new"],
    photoId: "photo-1585487000160-6ebcfceb0d03",
    notes: "Featherlight chanderi with scattered buttis and gold selvedge.",
  },
  {
    name: "Linen Sunset Saree",
    brand: "Atelier Gul",
    category: "sarees" as const,
    subcategory: "Linen",
    price: 3290,
    mrp: 4600,
    rating: 4.5,
    ratingCount: 54,
    colors: ["Terracotta", "Sand"],
    sizes: ["Free Size"],
    tags: [],
    photoId: "photo-1601924994987-69e26d50dc26",
    notes: "Handloom linen with a wide terracotta pallu, pre-pleated fall.",
  },
  {
    name: "Zohra Co-ord Kurta Set",
    brand: "Boutiq Studio",
    category: "sets" as const,
    subcategory: "Kurta Sets",
    price: 3990,
    mrp: 5800,
    rating: 4.7,
    ratingCount: 118,
    colors: ["Sage", "Ivory"],
    sizes: ["XS", "S", "M", "L", "XL"],
    tags: ["bestseller", "new"],
    photoId: "photo-1572804013309-59a88b7e92f1",
    notes: "Three-piece kurta, palazzo and organza dupatta in tone-on-tone.",
  },
  {
    name: "Ambar Sharara Set",
    brand: "Awadh Label",
    category: "sets" as const,
    subcategory: "Sharara Sets",
    price: 5490,
    mrp: 7900,
    rating: 4.8,
    ratingCount: 73,
    colors: ["Powder Blue", "Champagne"],
    sizes: ["S", "M", "L"],
    tags: ["trending"],
    photoId: "photo-1620921575116-fb8902865f81",
    notes: "Sequinned short kurta with flared sharara and net dupatta.",
  },
  {
    name: "Suhana Anarkali Set",
    brand: "Atelier Gul",
    category: "sets" as const,
    subcategory: "Anarkali",
    price: 4690,
    mrp: 6800,
    rating: 4.6,
    ratingCount: 92,
    colors: ["Wine", "Dusty Rose"],
    sizes: ["XS", "S", "M", "L", "XL"],
    tags: [],
    photoId: "photo-1522771930-78848d9293e8",
    notes: "Floor-length anarkali with churidar and banarasi dupatta.",
  },
  {
    name: "Ila Cotton Lounge Set",
    brand: "Boutiq Studio",
    category: "sets" as const,
    subcategory: "Lounge Sets",
    price: 2190,
    mrp: 3100,
    rating: 4.5,
    ratingCount: 143,
    colors: ["Oat", "Powder Blue"],
    sizes: ["S", "M", "L", "XL"],
    tags: ["new"],
    photoId: "photo-1617137968427-85924c800a22",
    notes: "Breathable mul-cotton set for slow mornings and evenings in.",
  },
  {
    name: "Mehr Velvet Dress",
    brand: "Atelier Gul",
    category: "dresses" as const,
    subcategory: "Velvet",
    price: 4290,
    mrp: 6200,
    rating: 4.7,
    ratingCount: 66,
    colors: ["Wine", "Ink"],
    sizes: ["XS", "S", "M", "L"],
    tags: ["trending"],
    photoId: "photo-1509631179647-0177331693ae",
    notes: "Bias-cut velvet with embellished cuffs, festive evenings.",
  },
  {
    name: "Falak Indigo Midi Dress",
    brand: "Boutiq Studio",
    category: "dresses" as const,
    subcategory: "Midi",
    price: 2790,
    mrp: 3900,
    rating: 4.6,
    ratingCount: 104,
    colors: ["Indigo", "Ivory"],
    sizes: ["XS", "S", "M", "L", "XL"],
    tags: [],
    photoId: "photo-1496747611176-843222e1e57c",
    notes: "Hand-dyed indigo midi with wooden bead ties and pockets.",
  },
  {
    name: "Noor Tiered Maxi Dress",
    brand: "Awadh Label",
    category: "dresses" as const,
    subcategory: "Maxi",
    price: 3490,
    mrp: 5000,
    rating: 4.8,
    ratingCount: 58,
    colors: ["Blush", "Sage"],
    sizes: ["S", "M", "L"],
    tags: ["new"],
    photoId: "photo-1515372039744-b8f02a3ae446",
    notes: "Tiered georgette maxi with scalloped hem and smocked bodice.",
  },
  {
    name: "Aurelia Wrap Dress",
    brand: "Vastraa House",
    category: "dresses" as const,
    subcategory: "Wrap",
    price: 3090,
    mrp: 4400,
    rating: 4.5,
    ratingCount: 47,
    colors: ["Maroon", "Sand"],
    sizes: ["XS", "S", "M", "L", "XL"],
    tags: [],
    photoId: "photo-1591085686350-798c0f9faa7f",
    notes: "Silk-blend wrap dress with a hand-embroidered belt.",
  },
];

/** Seed the catalogue. Idempotent — skips when products already exist. */
export const seed = internalMutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing !== null) {
      return { seeded: 0, skipped: true };
    }
    let count = 0;
    for (const p of SEED_PRODUCTS) {
      await ctx.db.insert("products", { ...p, active: true });
      count += 1;
    }
    return { seeded: count, skipped: false };
  },
});

/**
 * Re-seed the catalogue from the current seed list. Wipes the products table
 * and re-inserts, so the storefront always matches the curated list.
 */
export const reseed = mutation({
  handler: async (ctx) => {
    const all = await ctx.db.query("products").collect();
    for (const p of all) {
      await ctx.db.delete(p._id);
    }
    let count = 0;
    for (const p of SEED_PRODUCTS) {
      await ctx.db.insert("products", { ...p, active: true });
      count += 1;
    }
    return { seeded: count };
  },
});

/**
 * Catalogue listing with category/subcategory filters, search and sort.
 * The curated catalogue is small, so filtering and sorting happen in the
 * query handler and the full result set is returned.
 */
export const list = query({
  args: {
    category: v.optional(categoryValidator),
    subcategory: v.optional(v.string()),
    search: v.optional(v.string()),
    sort: v.optional(
      v.union(
        v.literal("relevance"),
        v.literal("priceAsc"),
        v.literal("priceDesc"),
        v.literal("newest"),
        v.literal("rating"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db.query("products").collect();

    const search = args.search?.trim().toLowerCase() ?? "";
    const items = rows.filter((p) => {
      if (p.active === false) return false;
      if (args.category !== undefined && p.category !== args.category) {
        return false;
      }
      if (args.subcategory !== undefined && p.subcategory !== args.subcategory) {
        return false;
      }
      if (search !== "") {
        const hay =
          `${p.name} ${p.brand} ${p.subcategory} ${p.category} ${p.colors.join(" ")} ${p.notes}`.toLowerCase();
        if (!hay.includes(search)) return false;
      }
      return true;
    });

    const sort = args.sort ?? "relevance";
    if (sort === "priceAsc") {
      items.sort((a, b) => a.price - b.price);
    } else if (sort === "priceDesc") {
      items.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      items.sort((a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount);
    } else if (sort === "newest") {
      items.sort((a, b) => b._creationTime - a._creationTime);
    } else {
      items.sort((a, b) => b.ratingCount - a.ratingCount);
    }

    return { items, total: items.length };
  },
});

/** Fetch one product by id. */
export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product || product.active === false) return null;
    return product;
  },
});

/** Catalogue facets: per-subcategory counts, optionally scoped to a category. */
export const facets = query({
  args: { category: v.optional(categoryValidator) },
  handler: async (ctx, args) => {
    const products = await ctx.db.query("products").collect();
    const counts = new Map<string, number>();
    for (const p of products) {
      if (p.active === false) continue;
      if (args.category !== undefined && p.category !== args.category) continue;
      counts.set(p.subcategory, (counts.get(p.subcategory) ?? 0) + 1);
    }
    const subcategories = [...counts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

    const total = [...counts.values()].reduce((a, b) => a + b, 0);
    return { subcategories, total };
  },
});

/** Similar products: same subcategory first (nearest price), then same category. */
export const similar = query({
  args: { id: v.id("products"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) return [];
    const limit = args.limit ?? 4;

    const all = await ctx.db.query("products").collect();
    const candidates = all.filter(
      (p) => p._id !== product._id && p.active !== false,
    );

    const sameSub = candidates
      .filter((p) => p.subcategory === product.subcategory)
      .sort(
        (a, b) =>
          Math.abs(a.price - product.price) - Math.abs(b.price - product.price),
      );
    const sameCat = candidates
      .filter(
        (p) =>
          p.category === product.category &&
          p.subcategory !== product.subcategory,
      )
      .sort((a, b) => b.rating - a.rating);

    const out: typeof candidates = [];
    for (const p of [...sameSub, ...sameCat]) {
      if (out.length >= limit) break;
      out.push(p);
    }
    return out;
  },
});
