import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { categoryValidator } from "./schema";
import { getOrCreateSettings } from "./settings";
import { SEED_PART1, SEED_PART2 } from "./seedData";

/** All seed products combined — 16 pieces with Tamil translations. */
const SEED_PRODUCTS = [...SEED_PART1, ...SEED_PART2];

/** Seed the catalogue. Idempotent — skips when products already exist. */
export const seed = internalMutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing !== null) {
      return { seeded: 0, canSkip: true as const };
    }
    let count = 0;
    for (const p of SEED_PRODUCTS) {
      await ctx.db.insert("products", { ...p, active: true });
      count += 1;
    }
    return { seeded: count, canSkip: false as const };
  },
});

/**
 * Seed sample products into an EMPTY catalogue only (passcode). Used by the
 * owner from /admin on a fresh production deployment. Never overwrites
 * existing products, so real shop data is safe.
 */
export const seedIfEmpty = mutation({
  args: { passcode: v.string() },
  handler: async (ctx, args) => {
    const current = await getOrCreateSettings(ctx);
    if (args.passcode !== current.passcode) {
      throw new Error("Wrong passcode");
    }
    const existing = await ctx.db.query("products").first();
    if (existing !== null) {
      return { seeded: 0, skipped: true as const };
    }
    let count = 0;
    for (const p of SEED_PRODUCTS) {
      await ctx.db.insert("products", { ...p, active: true });
      count += 1;
    }
    return { seeded: count, skipped: false as const };
  },
});

/** Owner re-seed: wipes and re-inserts the 16 sample pieces (passcode). */
export const reseed = mutation({
  args: { passcode: v.string() },
  handler: async (ctx, args) => {
    const current = await getOrCreateSettings(ctx);
    if (args.passcode !== current.passcode) {
      throw new Error("Wrong passcode");
    }
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
 * Search covers English and Tamil; hidden products are excluded.
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
        const hay = `${p.name} ${p.nameTa ?? ""} ${p.brand} ${p.subcategory} ${p.category} ${p.colors.join(" ")} ${p.notes} ${p.notesTa ?? ""}`.toLowerCase();
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

/** Fetch one product by id (hidden ones return null). */
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

/** Full catalogue including hidden items — used by the owner admin page. */
export const adminList = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("products").collect();
    const items = [...rows].sort((a, b) => b._creationTime - a._creationTime);
    return items;
  },
});
