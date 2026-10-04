import { useAction } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";

type EnquiryItem = {
  id: string;
  productName: string;
  nameTa?: string;
  brand?: string;
  price?: number;
  size?: string;
  color?: string;
  lang?: string;
  source?: string;
  createdAt?: string;
};

function money(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function sourceLabel(s?: string) {
  if (s === "call") return "Call";
  if (s === "chat") return "Chat";
  return "WhatsApp";
}

/** Admin panel tab: MongoDB connection status + recent order enquiries. */
export function OrdersPanel() {
  const checkConnection = useAction(api.mongo.checkConnection);
  const listRecent = useAction(api.mongo.listRecentEnquiries);

  const [statusOk, setStatusOk] = useState<boolean | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [items, setItems] = useState<EnquiryItem[] | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setBusy(true);
    try {
      const ping = await checkConnection({});
      if (ping.ok) {
        setStatusOk(true);
        setStatus("Connected — enquiry log lives in the “nool” database on Atlas.");
      } else {
        setStatusOk(false);
        setStatus(ping.reason || "Connection failed.");
      }
      const list = await listRecent({ limit: 25 });
      setItems(list.ok ? list.items : []);
    } catch (e) {
      setStatusOk(false);
      setStatus(e instanceof Error ? e.message : "Something went wrong.");
      setItems(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="border border-line bg-card p-6 shadow-btq">
      <h2 className="font-display text-xl text-ink">Order enquiries</h2>
      <p className="mt-1 font-body text-sm text-muted-foreground">
        Every gold order button on the storefront logs a lead here, stored
        safely in MongoDB Atlas.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={load}
          disabled={busy}
          className="sheen bg-gold-gradient px-6 py-2.5 font-body text-sm font-semibold uppercase tracking-[0.18em] text-maroon-deep disabled:opacity-60"
        >
          {busy ? "Checking…" : items === null ? "Connect & load" : "Refresh"}
        </button>
        {status && (
          <p
            className={`font-body text-sm ${
              statusOk ? "text-emerald-700" : "text-terra"
            }`}
          >
            {statusOk ? "✓ " : ""}
            {status}
          </p>
        )}
      </div>

      {items !== null &&
        (items.length === 0 ? (
          <p className="mt-6 font-body text-sm text-muted-foreground">
            No enquiries logged yet. When a shopper taps “Order on WhatsApp” or
            “Call to Order”, the lead appears here.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-line border-t border-line">
            {items.map((it) => (
              <li
                key={it.id}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3"
              >
                <span className="font-body text-sm font-medium text-ink">
                  {it.nameTa || it.productName}
                </span>
                <span className="font-body text-xs uppercase tracking-[0.14em] text-gold">
                  {sourceLabel(it.source)}
                </span>
                {it.brand && (
                  <span className="font-body text-xs text-muted-foreground">
                    {it.brand}
                  </span>
                )}
                {typeof it.price === "number" && (
                  <span className="font-body text-xs text-muted-foreground">
                    {money(it.price)}
                  </span>
                )}
                {it.size && (
                  <span className="font-body text-xs text-muted-foreground">
                    Size {it.size}
                  </span>
                )}
                {it.color && (
                  <span className="font-body text-xs text-muted-foreground">
                    {it.color}
                  </span>
                )}
                <span className="ml-auto font-body text-xs text-muted-foreground">
                  {it.createdAt
                    ? new Date(it.createdAt).toLocaleString()
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        ))}
    </section>
  );
}
