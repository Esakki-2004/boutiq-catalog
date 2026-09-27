import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { categoryValidator } from "./schema";

/**
 * Shop settings + owner admin actions.
 *
 * The shop owner manages everything from /admin with a simple passcode — no
 * accounts, no subscription. All admin mutations verify the passcode against
 * the settings row before touching data.
 */

/** Fallback settings used until the owner saves their own. */
const DEFAULTS = {
  whatsappNumber: "919845012345",
  phoneDisplay: "+91 98450 12345",
  announcementEn: "Complimentary shipping across India",
  announcementTa: "இந்தியா முழுவதும் இலவச டெலிவரி",
  deliveryInfoEn: "Free delivery across India · Same-day in the city",
  deliveryInfoTa: "இந்தியா முழுவதும் இலவச டெலிவரி · நகரத்தில் அதே நாள் விநியோகம்",
  freeDeliveryAbove: 2000,
  passcode: "boutiq2024",
};

/** Return the settings row, creating it with defaults on first call. */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db.query("settings").first();
    if (row) return row;
    return await ctx.db.insert("settings", { ...DEFAULTS });
  },
});

/** Verify an owner passcode (used by /admin to unlock the panel). */
export const verifyPasscode = mutation({
  args: { passcode: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db.query("settings").first();
    const current = row ?? (await ctx.db.insert("settings", { ...DEFAULTS }));
    return { ok: args.passcode === current.passcode };
  },
});

/** Owner updates shop settings (passcode-protected). */
export const update = mutation({
  args: {
    passcode: v.string(),
    whatsappNumber: v.optional(v.string()),
    phoneDisplay: v.optional(v.string()),
    announcementEn: v.optional(v.string()),
    announcementTa: v.optional(v.string()),
    deliveryInfoEn: v.optional(v.string()),
    deliveryInfoTa: v.optional(v.string()),
    freeDeliveryAbove: v.optional(v.number()),
    newPasscode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const row = await ctx.db.query("settings").first();
    const current = row ?? (await ctx.db.insert("settings", { ...DEFAULTS }));
    if (args.passcode !== current.passcode) {
      throw new Error("Wrong passcode");
    }
    const { passcode, newPasscode, ...rest } = args;
    const patch: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(rest)) {
      if (val !== undefined) patch[k] = val;
    }
    if (newPasscode !== undefined && newPasscode !== "") {
      patch.passcode = newPasscode;
    }
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(current._id, patch);
    }
    return { ok: true };
  },
});

/** Owner adds a product (passcode-protected). */
export const addProduct = mutation({
  args: {
    passcode: v.string(),
    name: v.string(),
    nameTa: v.optional(v.string()),
    brand: v.optional(v.string()),
    category: categoryValidator,
    subcategory: v.optional(v.string()),
    price: v.number(),
    mrp: v.number(),
    colors: v.array(v.string()),
    sizes: v.array(v.string()),
    photoUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
    notesTa: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const row = await ctx.db.query("settings").first();
    const current = row ?? (await ctx.db.insert("settings", { ...DEFAULTS }));
    if (args.passcode !== current.passcode) {
      throw new Error("Wrong passcode");
    }

    const { passcode, ...p } = args;
    await ctx.db.insert("products", {
      name: p.name,
      nameTa: p.nameTa,
      brand: p.brand && p.brand.trim() !== "" ? p.brand.trim() : "Boutiq",
      category: p.category,
      subcategory:
        p.subcategory && p.subcategory.trim() !== ""
          ? p.subcategory.trim()
          : "New Arrivals",
      price: p.price,
      mrp: p.mrp > 0 ? p.mrp : p.price,
      rating: 4.5,
      ratingCount: 0,
      colors: p.colors,
      sizes: p.sizes,
      tags: p.tags ?? [],
      photoUrl: p.photoUrl,
      notes: p.notes ?? "",
      notesTa: p.notesTa,
      active: true,
    });
    return { ok: true };
  },
});

/** Owner hides a product from the storefront without deleting it. */
export const hideProduct = mutation({
  args: { passcode: v.string(), id: v.id("products") },
  handler: async (ctx, args) => {
    const row = await ctx.db.query("settings").first();
    const current = row ?? (await ctx.db.insert("settings", { ...DEFAULTS }));
    if (args.passcode !== current.passcode) {
      throw new Error("Wrong passcode");
    }
    await ctx.db.patch(args.id, { active: false });
    return { ok: true };
  },
});

/** Owner shows a previously hidden product again. */
export const showProduct = mutation({
  args: { passcode: v.string(), id: v.id("products") },
  handler: async (ctx, args) => {
    const row = await ctx.db.query("settings").first();
    const current = row ?? (await ctx.db.insert("settings", { ...DEFAULTS }));
    if (args.passcode !== current.passcode) {
      throw new Error("Wrong passcode");
    }
    await ctx.db.patch(args.id, { active: true });
    return { ok: true };
  },
});

/** Owner permanently deletes a product. */
export const deleteProduct = mutation({
  args: { passcode: v.string(), id: v.id("products") },
  handler: async (ctx, args) => {
    const row = await ctx.db.query("settings").first();
    const current = row ?? (await ctx.db.insert("settings", { ...DEFAULTS }));
    if (args.passcode !== current.passcode) {
      throw new Error("Wrong passcode");
    }
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});

/** Owner edits price, stock visibility, names and description of a product. */
export const editProduct = mutation({
  args: {
    passcode: v.string(),
    id: v.id("products"),
    name: v.optional(v.string()),
    nameTa: v.optional(v.string()),
    price: v.optional(v.number()),
    mrp: v.optional(v.number()),
    notes: v.optional(v.string()),
    notesTa: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const row = await ctx.db.query("settings").first();
    const current = row ?? (await ctx.db.insert("settings", { ...DEFAULTS }));
    if (args.passcode !== current.passcode) {
      throw new Error("Wrong passcode");
    }
    const { passcode, id, ...rest } = args;
    const patch: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(rest)) {
      if (val !== undefined && val !== "") patch[k] = val;
    }
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(id, patch);
    }
    return { ok: true };
  },
});
