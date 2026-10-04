"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { MongoClient, type Document, type WithId } from "mongodb";

/**
 * MongoDB Atlas integration (order-enquiry lead log).
 *
 * The connection string is read from the MONGODB_URI environment variable
 * (managed in the project's Keys tab). Until it is set, every action here
 * degrades gracefully: logging becomes a no-op and the admin panel reports
 * "not configured" — the storefront never breaks because of this module.
 */

const DB_NAME = "nool";
const ENQUIRIES = "enquiries";

function uri(): string | undefined {
  return process.env.MONGODB_URI;
}

// Cache the client across warm action invocations (standard serverless pattern).
let clientPromise: Promise<MongoClient> | null = null;

function getClient(): Promise<MongoClient> {
  const u = uri();
  if (!u) throw new Error("MONGODB_URI_NOT_SET");
  if (!clientPromise) {
    const client = new MongoClient(u, {
      serverSelectionTimeoutMS: 8_000,
    });
    clientPromise = client.connect();
  }
  return clientPromise;
}

function dropClient() {
  clientPromise = null;
}

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

/** Connectivity check used by the admin panel. */
export const checkConnection = action({
  args: {},
  handler: async () => {
    if (!uri()) {
      return { ok: false, reason: "MONGODB_URI is not set — add it in the Keys tab." };
    }
    try {
      const client = await getClient();
      await client.db("admin").command({ ping: 1 });
      return { ok: true, db: DB_NAME };
    } catch (e) {
      dropClient();
      return { ok: false, reason: errMsg(e) };
    }
  },
});

/** One order-enquiry lead, written when a shopper taps a gold order button. */
export const logEnquiry = action({
  args: {
    productName: v.string(),
    nameTa: v.optional(v.string()),
    brand: v.optional(v.string()),
    price: v.optional(v.number()),
    size: v.optional(v.string()),
    color: v.optional(v.string()),
    lang: v.union(v.literal("en"), v.literal("ta")),
    source: v.union(v.literal("whatsapp"), v.literal("call"), v.literal("chat")),
  },
  handler: async (_ctx, a) => {
    if (!uri()) return { ok: false, reason: "not_configured" };
    try {
      const client = await getClient();
      await client.db(DB_NAME).collection(ENQUIRIES).insertOne({
        ...a,
        createdAt: new Date().toISOString(),
      });
      return { ok: true };
    } catch (e) {
      dropClient();
      console.error("[mongo] logEnquiry failed:", errMsg(e));
      return { ok: false, reason: "insert_failed" };
    }
  },
});

/** Recent enquiries for the admin panel, newest first. */
export const listRecentEnquiries = action({
  args: { limit: v.optional(v.number()) },
  handler: async (_ctx, a) => {
    if (!uri()) {
      return { ok: false, reason: "not_configured", items: [] };
    }
    try {
      const client = await getClient();
      const docs: WithId<Document>[] = await client
        .db(DB_NAME)
        .collection(ENQUIRIES)
        .find({})
        .sort({ createdAt: -1 })
        .limit(Math.min(Math.max(a.limit ?? 25, 1), 100))
        .toArray();
      const items = docs.map((d) => ({
        id: String(d._id),
        productName: typeof d.productName === "string" ? d.productName : "—",
        nameTa: typeof d.nameTa === "string" ? d.nameTa : undefined,
        brand: typeof d.brand === "string" ? d.brand : undefined,
        price: typeof d.price === "number" ? d.price : undefined,
        size: typeof d.size === "string" ? d.size : undefined,
        color: typeof d.color === "string" ? d.color : undefined,
        lang: typeof d.lang === "string" ? d.lang : undefined,
        source: typeof d.source === "string" ? d.source : undefined,
        createdAt: typeof d.createdAt === "string" ? d.createdAt : undefined,
      }));
      return { ok: true, items };
    } catch (e) {
      dropClient();
      return { ok: false, reason: errMsg(e), items: [] };
    }
  },
});
