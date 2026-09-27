import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { categoryValidator } from "./schema";

/**
 * Boutiq product catalogue.
 *
 * Version 1 scope: shoppers browse a curated catalogue. Data is seeded into
 * Convex and served through reactive queries; there is no cart, checkout or
 * admin flow in v1.
 */

const SEED_PRODUCTS = [
  // ── Women ────────────────────────────────────────────────────────────────
  {
    name: "Anouk Printed A-Line Kurta",
    brand: "Anouk",
    category: "women" as const,
    subcategory: "Kurtas",
    price: 479,
    mrp: 1299,
    rating: 4.2,
    ratingCount: 58420,
    colors: ["Maroon", "Teal", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    tags: ["bestseller"],
    photoId: "photo-1594633312681-425c7b97ccd1",
    notes: "Cotton blend · Block print · Straight fit with side slits",
  },
  {
    name: "Rouge Aura Satin Slip Dress",
    brand: "Sereia",
    category: "women" as const,
    subcategory: "Dresses",
    price: 1599,
    mrp: 3999,
    rating: 4.3,
    ratingCount: 12840,
    colors: ["Wine", "Black"],
    sizes: ["XS", "S", "M", "L"],
    tags: ["trending", "new"],
    photoId: "photo-1596755094514-f87e34085b2c",
    notes: "Satin finish · Adjustable straps · Midi length",
  },
  {
    name: "Libas Chikankari Straight Kurta",
    brand: "Libas",
    category: "women" as const,
    subcategory: "Kurtas",
    price: 899,
    mrp: 2299,
    rating: 4.4,
    ratingCount: 8930,
    colors: ["White", "Sky Blue"],
    sizes: ["S", "M", "L", "XL"],
    tags: ["new"],
    photoId: "photo-1583391733956-6c78276477e2",
    notes: "Chikankari embroidery · Cotton · Calf length",
  },
  {
    name: "Sereia High-Rise Wide-Leg Jeans",
    brand: "Sereia",
    category: "women" as const,
    subcategory: "Jeans",
    price: 1799,
    mrp: 3599,
    rating: 4.1,
    ratingCount: 21450,
    colors: ["Mid Blue", "Ecru"],
    sizes: ["26", "28", "30", "32", "34"],
    tags: ["bestseller"],
    photoId: "photo-1541099649105-f69ad21f3246",
    notes: "Stretch denim · High rise · Floor length",
  },
  {
    name: "Anouk Rayon Palazzo Pants",
    brand: "Anouk",
    category: "women" as const,
    subcategory: "Bottomwear",
    price: 549,
    mrp: 1499,
    rating: 4.0,
    ratingCount: 34110,
    colors: ["Black", "Navy", "Mustard"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    tags: [],
    photoId: "photo-1591195853828-11db59a44f6b",
    notes: "Flared · Elasticated waist · Rayon",
  },
  {
    name: "Mitera Georgette Saree",
    brand: "Mitera",
    category: "women" as const,
    subcategory: "Sarees",
    price: 1249,
    mrp: 4999,
    rating: 4.2,
    ratingCount: 9640,
    colors: ["Rani Pink", "Emerald"],
    sizes: ["Free Size"],
    tags: ["trending"],
    photoId: "photo-1610030469983-98e550d6193c",
    notes: "Zari border · Blouse piece included · 5.5 m saree",
  },

  // ── Men ──────────────────────────────────────────────────────────────────
  {
    name: "Here&Now Printed Cotton T-shirt",
    brand: "Here&Now",
    category: "men" as const,
    subcategory: "T-Shirts",
    price: 399,
    mrp: 999,
    rating: 4.2,
    ratingCount: 112300,
    colors: ["Black", "Olive", "White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    tags: ["bestseller", "trending"],
    photoId: "photo-1521572163474-6864f9cf17ab",
    notes: "Typography print · Pure cotton · Regular fit",
  },
  {
    name: "Roadster Casual Denim Shirt",
    brand: "Roadster",
    category: "men" as const,
    subcategory: "Shirts",
    price: 1099,
    mrp: 2799,
    rating: 4.3,
    ratingCount: 45210,
    colors: ["Indigo", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    tags: ["bestseller"],
    photoId: "photo-1520975954732-35dd22299614",
    notes: "Washed denim · Spread collar · Full sleeves",
  },
  {
    name: "U.S. Polo Assn. Checked Shirt",
    brand: "U.S. Polo Assn.",
    category: "men" as const,
    subcategory: "Shirts",
    price: 1549,
    mrp: 3099,
    rating: 4.4,
    ratingCount: 18220,
    colors: ["Grey Checks", "Blue Checks"],
    sizes: ["M", "L", "XL", "XXL"],
    tags: ["new"],
    photoId: "photo-1592878904946-b3cd8ae243d0",
    notes: "Yarn-dyed checks · Cotton poplin · Slim fit",
  },
  {
    name: "Mast & Harbour Slim Fit Chinos",
    brand: "Mast & Harbour",
    category: "men" as const,
    subcategory: "Trousers",
    price: 1349,
    mrp: 2999,
    rating: 4.1,
    ratingCount: 52870,
    colors: ["Khaki", "Navy", "Charcoal"],
    sizes: ["28", "30", "32", "34", "36"],
    tags: ["bestseller"],
    photoId: "photo-1591047139829-d91aecb6caea",
    notes: "Stretch cotton · Slim tapered · Mid rise",
  },
  {
    name: "H&M Regular Fit Oxford Shirt",
    brand: "H&M",
    category: "men" as const,
    subcategory: "Shirts",
    price: 1299,
    mrp: 2290,
    rating: 4.2,
    ratingCount: 11050,
    colors: ["White", "Sky Blue"],
    sizes: ["S", "M", "L", "XL"],
    tags: [],
    photoId: "photo-1602810318383-e386cc2a3ccf",
    notes: "Oxford weave · Button-down collar · Cotton",
  },
  {
    name: "Anouk Woven Design Kurta Set",
    brand: "Anouk",
    category: "men" as const,
    subcategory: "Kurta Sets",
    price: 1899,
    mrp: 4499,
    rating: 4.3,
    ratingCount: 7690,
    colors: ["Cream", "Maroon"],
    sizes: ["M", "L", "XL", "XXL"],
    tags: ["trending"],
    photoId: "photo-1583089892943-e02e5b017b6a",
    notes: "Kurta with churidar · Woven zari · Mandarin collar",
  },
  {
    name: "Roadster Puffer Jacket",
    brand: "Roadster",
    category: "men" as const,
    subcategory: "Jackets",
    price: 1699,
    mrp: 4999,
    rating: 4.0,
    ratingCount: 24310,
    colors: ["Black", "Bottle Green"],
    sizes: ["M", "L", "XL", "XXL"],
    tags: ["new"],
    photoId: "photo-1551028719-00167b16eac5",
    notes: "Water resistant · Hooded · Quilted padding",
  },

  // ── Kids ─────────────────────────────────────────────────────────────────
  {
    name: "Pantaloons Junior Printed T-shirt",
    brand: "Pantaloons Junior",
    category: "kids" as const,
    subcategory: "T-Shirts",
    price: 349,
    mrp: 799,
    rating: 4.2,
    ratingCount: 9840,
    colors: ["Sunny Yellow", "Aqua"],
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"],
    tags: ["bestseller"],
    photoId: "photo-1503919545889-aef636e10ad4",
    notes: "Cartoon print · Pure cotton · Short sleeves",
  },
  {
    name: "Juniors Dungaree Set",
    brand: "Tiny Bees",
    category: "kids" as const,
    subcategory: "Dungarees",
    price: 899,
    mrp: 2199,
    rating: 4.5,
    ratingCount: 4210,
    colors: ["Denim Blue", "Coral"],
    sizes: ["2-3Y", "3-4Y", "4-5Y"],
    tags: ["trending", "new"],
    photoId: "photo-1519238263530-99bdd11df2ea",
    notes: "Denim dungaree with tee · Adjustable straps",
  },
  {
    name: "Kids Cotton Frock",
    brand: "Cute Bees",
    category: "kids" as const,
    subcategory: "Frocks",
    price: 599,
    mrp: 1499,
    rating: 4.3,
    ratingCount: 6120,
    colors: ["Peach", "Lilac"],
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"],
    tags: [],
    photoId: "photo-1518831959646-742c3a14ebf7",
    notes: "Flared frock · Floral applique · Soft cotton lining",
  },
  {
    name: "Juniors Cargo Shorts",
    brand: "Tiny Bees",
    category: "kids" as const,
    subcategory: "Shorts",
    price: 449,
    mrp: 999,
    rating: 4.1,
    ratingCount: 3150,
    colors: ["Sand", "Sage"],
    sizes: ["4-5Y", "5-6Y", "6-7Y", "7-8Y"],
    tags: ["new"],
    photoId: "photo-1622290348960-9d1b8a9da3d3",
    notes: "Multi-pocket · Cotton twill · Elasticated back",
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

/** Re-seed the catalogue (dev convenience). Wipes and re-inserts. */
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
 * Catalogue listing with Flipkart-style category/subcategory filters,
 * search and sort. The curated catalogue is small, so all filtering and
 * sorting happens in the query and the full result set is returned.
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
          `${p.name} ${p.brand} ${p.subcategory} ${p.category} ${p.colors.join(" ")}`.toLowerCase();
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
      items.sort(
        (a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount,
      );
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
    const limit = args.limit ?? 5;

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
