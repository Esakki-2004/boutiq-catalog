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

    // add other tables here

    // Product catalogue for the boutique storefront.
    products: defineTable({
      name: v.string(), // product name, e.g. "Rouge Aura Slip Dress"
      brand: v.string(), // boutique house label, e.g. "Anouk", "Sereia"
      category: categoryValidator, // women | men | kids
      subcategory: v.string(), // e.g. "Dresses", "Tees", "Sherwanis"
      price: v.number(), // selling price in whole rupees
      mrp: v.number(), // list price; price < mrp renders the strike-through + % off
      rating: v.number(), // 3.5–5.0
      ratingCount: v.number(), // number of ratings/reviews
      colors: v.array(v.string()), // color names, e.g. ["Maroon", "Black"]
      sizes: v.array(v.string()), // apparel sizes, e.g. ["S", "M", "L", "XL", "XXL"]
      tags: v.array(v.string()), // merchandising tags: "new", "bestseller", "trending"
      photoId: v.optional(v.string()), // Unsplash photo id for the product image
      notes: v.string(), // short merchandising line used on cards/PDPs
      active: v.optional(v.boolean()), // defaults to true when omitted
    })
      .index("by_category", ["category"])
      .index("by_subcategory", ["subcategory"]),

    // tableName: defineTable({
    //   ...
    //   // table fields
    // }).index("by_field", ["field"])
  },
  {
    schemaValidation: false,
  },
);

export default schema;
