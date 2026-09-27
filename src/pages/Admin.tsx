import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useEffect, useState } from "react";
import { Link } from "react-router";

type Product = Doc<"products">;

const CATEGORIES = [
  { id: "kurtas", en: "Kurtas", ta: "குர்தா" },
  { id: "sarees", en: "Sarees", ta: "சேலை" },
  { id: "sets", en: "Co-ord Sets", ta: "இணை அமைப்பு" },
  { id: "dresses", en: "Dresses", ta: "கவுன்" },
] as const;

const inputCls =
  "h-10 w-full border border-line bg-ivory px-3 font-body text-sm text-ink outline-none focus:border-maroon";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-body text-[12px] font-medium uppercase tracking-[0.14em] text-ink">
        {label}
        {hint && (
          <span className="ml-2 font-normal normal-case tracking-normal text-muted-foreground">
            {hint}
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

export default function Admin() {
  const verify = useMutation(api.settings.verifyPasscode);
  const addProduct = useMutation(api.settings.addProduct);
  const hideProduct = useMutation(api.settings.hideProduct);
  const showProduct = useMutation(api.settings.showProduct);
  const deleteProduct = useMutation(api.settings.deleteProduct);
  const updateSettings = useMutation(api.settings.update);
  const seedIfEmpty = useMutation(api.products.seedIfEmpty);

  const settings = useQuery(api.settings.get, {});
  const products = useQuery(api.products.adminList, {});

  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [gateError, setGateError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const [tab, setTab] = useState<"add" | "manage" | "settings">("add");
  const [toast, setToast] = useState<string | null>(null);

  // Add form state
  const [fName, setFName] = useState("");
  const [fNameTa, setFNameTa] = useState("");
  const [fBrand, setFBrand] = useState("");
  const [fCategory, setFCategory] = useState<"kurtas" | "sarees" | "sets" | "dresses">("kurtas");
  const [fSub, setFSub] = useState("");
  const [fPrice, setFPrice] = useState("");
  const [fMrp, setFMrp] = useState("");
  const [fColors, setFColors] = useState("");
  const [fSizes, setFSizes] = useState("Free Size");
  const [fPhoto, setFPhoto] = useState("");
  const [fNotes, setFNotes] = useState("");
  const [fNotesTa, setFNotesTa] = useState("");

  // Settings form state
  const [sWhats, setSWhats] = useState("");
  const [sPhone, setSPhone] = useState("");
  const [sAnnEn, setSAnnEn] = useState("");
  const [sAnnTa, setSAnnTa] = useState("");
  const [sDelEn, setSDelEn] = useState("");
  const [sDelTa, setSDelTa] = useState("");
  const [sFree, setSFree] = useState("");
  const [sNewPass, setSNewPass] = useState("");

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  // Pre-fill settings form once loaded — adjusting tracked state during
  // render (React-recommended) instead of inside an effect.
  const [settingsKey, setSettingsKey] = useState<string | null>(null);
  if (settings && settingsKey !== settings._id + String(settings.passcode === undefined)) {
    setSettingsKey(settings._id + String(settings.passcode === undefined));
    setSWhats(settings.whatsappNumber);
    setSPhone(settings.phoneDisplay);
    setSAnnEn(settings.announcementEn);
    setSAnnTa(settings.announcementTa);
    setSDelEn(settings.deliveryInfoEn);
    setSDelTa(settings.deliveryInfoTa);
    setSFree(String(settings.freeDeliveryAbove));
  }

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setGateError(null);
    try {
      const r = await verify({ passcode });
      if (r.ok) {
        sessionStorage.setItem("nool-admin", passcode);
        setUnlocked(true);
      } else {
        setGateError("Wrong passcode. Please try again.");
      }
    } catch {
      setGateError("Something went wrong. Please try again.");
    } finally {
      setChecking(false);
    }
  }

  function splitList(value: string): string[] {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const pc = sessionStorage.getItem("nool-admin");
    if (!pc) return;
    if (!fName.trim() || !fPrice.trim()) {
      setToast("Name and price are required.");
      return;
    }
    const price = Math.round(Number(fPrice));
    const mrp = fMrp.trim() === "" ? price : Math.round(Number(fMrp));
    try {
      await addProduct({
        passcode: pc,
        name: fName.trim(),
        nameTa: fNameTa.trim() || undefined,
        brand: fBrand.trim() || undefined,
        category: fCategory,
        subcategory: fSub.trim() || undefined,
        price,
        mrp,
        colors: splitList(fColors).length > 0 ? splitList(fColors) : ["As shown"],
        sizes: splitList(fSizes).length > 0 ? splitList(fSizes) : ["Free Size"],
        photoUrl: fPhoto.trim() || undefined,
        notes: fNotes.trim() || undefined,
        notesTa: fNotesTa.trim() || undefined,
      });
      setToast("Product added ✓");
      setFName(""); setFNameTa(""); setFBrand(""); setFSub("");
      setFPrice(""); setFMrp(""); setFColors(""); setFPhoto("");
      setFNotes(""); setFNotesTa("");
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed to add product");
    }
  }

  async function handleToggleActive(p: Product) {
    const pc = sessionStorage.getItem("nool-admin");
    if (!pc) return;
    try {
      if (p.active === false) {
        await showProduct({ passcode: pc, id: p._id });
        setToast("Product is now visible ✓");
      } else {
        await hideProduct({ passcode: pc, id: p._id });
        setToast("Product hidden from the shop ✓");
      }
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Action failed");
    }
  }

  async function handleDelete(p: Product) {
    const pc = sessionStorage.getItem("nool-admin");
    if (!pc) return;
    if (!window.confirm(`Delete "${p.name}" permanently?`)) return;
    try {
      await deleteProduct({ passcode: pc, id: p._id });
      setToast("Product deleted ✓");
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function handleSeedSamples() {
    const pc = sessionStorage.getItem("nool-admin");
    if (!pc) return;
    try {
      const r = await seedIfEmpty({ passcode: pc });
      setToast(
        r.skipped
          ? "Catalogue is not empty — nothing was added."
          : `Added ${r.seeded} sample products ✓`,
      );
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Seed failed");
    }
  }

  async function handleSettings(e: React.FormEvent) {
    e.preventDefault();
    const pc = sessionStorage.getItem("nool-admin");
    if (!pc) return;
    try {
      await updateSettings({
        passcode: pc,
        whatsappNumber: sWhats.trim() || undefined,
        phoneDisplay: sPhone.trim() || undefined,
        announcementEn: sAnnEn.trim() || undefined,
        announcementTa: sAnnTa.trim() || undefined,
        deliveryInfoEn: sDelEn.trim() || undefined,
        deliveryInfoTa: sDelTa.trim() || undefined,
        freeDeliveryAbove: sFree.trim() === "" ? undefined : Math.round(Number(sFree)),
        newPasscode: sNewPass.trim() || undefined,
      });
      setSNewPass("");
      setToast("Shop settings saved ✓");
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Save failed");
    }
  }

  /* ── Passcode gate ─────────────────────────────────────────── */
  if (!unlocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-4">
        <div className="w-full max-w-sm border border-line bg-card p-8 shadow-btq">
          <p className="eyebrow text-gold">Nool Owner Panel</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
            Shop Admin
          </h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">
            Enter your owner passcode to manage products and shop settings.
          </p>
          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Passcode"
              className={inputCls}
              required
            />
            {gateError && (
              <p className="font-body text-sm text-terra">{gateError}</p>
            )}
            <button
              type="submit"
              disabled={checking}
              className="sheen bg-gold-gradient w-full py-3 font-body text-sm font-semibold uppercase tracking-[0.18em] text-maroon-deep disabled:opacity-60"
            >
              {checking ? "Checking…" : "Unlock"}
            </button>
          </form>
          <p className="mt-4 font-body text-xs text-muted-foreground">
            Default passcode: <span className="font-semibold">nool2024</span>{" "}
            — change it in Settings after your first sign-in.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block font-body text-sm text-maroon underline underline-offset-4"
          >
            Back to the shop
          </Link>
        </div>
      </div>
    );
  }

  /* ── Admin panel ───────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <p className="eyebrow text-gold">Nool Owner Panel</p>
            <h1 className="font-display text-2xl font-semibold text-ink">
              Shop Admin
            </h1>
          </div>
          <Link
            to="/shop"
            className="font-body text-sm text-maroon underline underline-offset-4"
          >
            View shop →
          </Link>
        </div>
        <div className="mx-auto flex max-w-5xl gap-1 px-4">
          {(
            [
              ["add", "Add product"],
              ["manage", "Manage products"],
              ["settings", "Shop settings"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`border-b-2 px-4 py-2.5 font-body text-sm font-medium transition-colors ${
                tab === id
                  ? "border-gold text-maroon"
                  : "border-transparent text-muted-foreground hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {tab === "add" && (
          <form
            onSubmit={handleAdd}
            className="border border-line bg-card p-6 shadow-btq"
          >
            <h2 className="font-display text-xl text-ink">Add a new product</h2>
            <p className="mt-1 font-body text-sm text-muted-foreground">
              Tamil fields appear when the shop is viewed in Tamil — fill them
              so local shoppers understand.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Name (English)">
                <input className={inputCls} value={fName} onChange={(e) => setFName(e.target.value)} required />
              </Field>
              <Field label="Name (Tamil)" hint="optional">
                <input className={inputCls} value={fNameTa} onChange={(e) => setFNameTa(e.target.value)} />
              </Field>
              <Field label="Brand / label" hint="optional">
                <input className={inputCls} value={fBrand} onChange={(e) => setFBrand(e.target.value)} />
              </Field>
              <Field label="Category">
                <select className={inputCls} value={fCategory} onChange={(e) => setFCategory(e.target.value as typeof fCategory)}>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.en} · {c.ta}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Type / subcategory" hint="e.g. Cotton Sarees">
                <input className={inputCls} value={fSub} onChange={(e) => setFSub(e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price ₹">
                  <input className={inputCls} type="number" min="1" value={fPrice} onChange={(e) => setFPrice(e.target.value)} required />
                </Field>
                <Field label="MRP ₹" hint="optional">
                  <input className={inputCls} type="number" min="1" value={fMrp} onChange={(e) => setFMrp(e.target.value)} />
                </Field>
              </div>
              <Field label="Colours" hint="comma separated">
                <input className={inputCls} value={fColors} onChange={(e) => setFColors(e.target.value)} placeholder="Maroon, Ivory" />
              </Field>
              <Field label="Sizes" hint="comma separated">
                <input className={inputCls} value={fSizes} onChange={(e) => setFSizes(e.target.value)} />
              </Field>
              <Field label="Photo link (URL)" hint="optional">
                <input className={inputCls} value={fPhoto} onChange={(e) => setFPhoto(e.target.value)} placeholder="https://…" />
              </Field>
              <Field label="Description (English)" hint="optional">
                <input className={inputCls} value={fNotes} onChange={(e) => setFNotes(e.target.value)} />
              </Field>
              <Field label="Description (Tamil)" hint="optional">
                <input className={inputCls} value={fNotesTa} onChange={(e) => setFNotesTa(e.target.value)} />
              </Field>
            </div>
            <button
              type="submit"
              className="sheen bg-gold-gradient mt-6 px-8 py-3 font-body text-sm font-semibold uppercase tracking-[0.18em] text-maroon-deep"
            >
              Add product
            </button>
          </form>
        )}

        {tab === "manage" && (
          <div className="border border-line bg-card shadow-btq">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-6 py-4">
              <h2 className="font-display text-xl text-ink">Your products</h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSeedSamples}
                  className="border border-line px-3 py-1.5 font-body text-xs font-medium text-ink hover:border-maroon hover:text-maroon"
                  title="Fills the shop with 16 sample pieces (only when the catalogue is empty)"
                >
                  Load sample products
                </button>
                <p className="font-body text-sm text-muted-foreground">
                  {products ? `${products.length} total` : "Loading…"}
                </p>
              </div>
            </div>
            {products === undefined ? (
              <p className="px-6 py-8 font-body text-sm text-muted-foreground">
                Loading…
              </p>
            ) : products.length === 0 ? (
              <p className="px-6 py-8 font-body text-sm text-muted-foreground">
                No products yet — add your first one above.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {products.map((p) => (
                  <li key={p._id} className="flex items-center gap-4 px-6 py-4">
                    <div className="size-14 shrink-0 overflow-hidden border border-line bg-sand">
                      {p.photoUrl ? (
                        <img src={p.photoUrl} alt="" className="size-full object-cover" />
                      ) : (
                        <div className="flex size-full items-center justify-center font-display text-lg text-gold">
                          ✦
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-body text-sm font-medium text-ink">
                        {p.name}
                      </p>
                      {p.nameTa && (
                        <p className="truncate font-body text-xs text-muted-foreground">
                          {p.nameTa}
                        </p>
                      )}
                      <p className="font-body text-xs text-muted-foreground">
                        ₹{p.price.toLocaleString("en-IN")} · {p.category}
                        {p.active === false && (
                          <span className="ml-2 font-semibold text-terra">Hidden</span>
                        )}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(p)}
                        className="border border-line px-3 py-1.5 font-body text-xs font-medium text-ink hover:border-maroon hover:text-maroon"
                      >
                        {p.active === false ? "Show" : "Hide"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        className="border border-line px-3 py-1.5 font-body text-xs font-medium text-terra hover:border-terra"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "settings" && (
          <form
            onSubmit={handleSettings}
            className="border border-line bg-card p-6 shadow-btq"
          >
            <h2 className="font-display text-xl text-ink">Shop settings</h2>
            <p className="mt-1 font-body text-sm text-muted-foreground">
              These appear across the shop — announcement strip, footer and
              order buttons.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="WhatsApp number" hint="with country code, digits only">
                <input className={inputCls} value={sWhats} onChange={(e) => setSWhats(e.target.value)} />
              </Field>
              <Field label="Phone shown to shoppers">
                <input className={inputCls} value={sPhone} onChange={(e) => setSPhone(e.target.value)} />
              </Field>
              <Field label="Announcement (English)">
                <input className={inputCls} value={sAnnEn} onChange={(e) => setSAnnEn(e.target.value)} />
              </Field>
              <Field label="Announcement (Tamil)">
                <input className={inputCls} value={sAnnTa} onChange={(e) => setSAnnTa(e.target.value)} />
              </Field>
              <Field label="Delivery info (English)">
                <input className={inputCls} value={sDelEn} onChange={(e) => setSDelEn(e.target.value)} />
              </Field>
              <Field label="Delivery info (Tamil)">
                <input className={inputCls} value={sDelTa} onChange={(e) => setSDelTa(e.target.value)} />
              </Field>
              <Field label="Free delivery above ₹" hint="0 = always free">
                <input className={inputCls} type="number" min="0" value={sFree} onChange={(e) => setSFree(e.target.value)} />
              </Field>
              <Field label="New passcode" hint="leave blank to keep current">
                <input className={inputCls} value={sNewPass} onChange={(e) => setSNewPass(e.target.value)} />
              </Field>
            </div>
            <button
              type="submit"
              className="sheen bg-gold-gradient mt-6 px-8 py-3 font-body text-sm font-semibold uppercase tracking-[0.18em] text-maroon-deep"
            >
              Save settings
            </button>
          </form>
        )}
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 border border-line bg-maroon-deep px-5 py-3 font-body text-sm text-[#faf7f2] shadow-btq">
          {toast}
        </div>
      )}
    </div>
  );
}
