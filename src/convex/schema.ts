import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

/** Product categories for the boutique — Indian women's wear. */
export const categoryValidator = v.union(
  v.literal("kurtas"),
  v.literal("sarees"),
  v.literal("sets"),
  v.literal("dresses"),
);
export type Category = Infer<typeof categoryValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Product catalogue. Tamil fields make the shop understandable to local
    // shoppers; photoUrl lets the owner paste any image link from /admin.
    products: defineTable({
      name: v.string(), // product name (English)
      nameTa: v.optional(v.string()), // product name (Tamil)
      brand: v.string(), // shop / house label
      category: categoryValidator, // kurtas | sarees | sets | dresses
      subcategory: v.string(), // e.g. "Cotton Kurtas", "Banarasi"
      price: v.number(), // selling price in whole rupees
      mrp: v.number(), // list price; strike-through when higher than price
      rating: v.number(), // 3.5–5.0
      ratingCount: v.number(), // number of ratings
      colors: v.array(v.string()), // e.g. ["Maroon", "Ivory"]
      sizes: v.array(v.string()), // e.g. ["S", "M", "L"] or ["Free Size"]
      tags: v.array(v.string()), // "new", "bestseller", "trending"
      photoId: v.optional(v.string()), // Unsplash photo id
      photoUrl: v.optional(v.string()), // any image URL pasted by the owner
      notes: v.string(), // short description (English)
      notesTa: v.optional(v.string()), // short description (Tamil)
      active: v.optional(v.boolean()), // hidden from storefront when false
    })
      .index("by_category", ["category"])
      .index("by_subcategory", ["subcategory"]),

    // Single-row shop settings the owner edits at /admin: order contact
    // numbers, bilingual announcement + delivery messaging, and the passcode.
    settings: defineTable({
      whatsappNumber: v.string(), // digits only, with country code
      phoneDisplay: v.string(), // number as shown to shoppers
      announcementEn: v.string(),
      announcementTa: v.string(),
      deliveryInfoEn: v.string(),
      deliveryInfoTa: v.string(),
      freeDeliveryAbove: v.number(), // rupees; 0 = always free
      passcode: v.string(), // owner passcode for /admin actions
    }),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
