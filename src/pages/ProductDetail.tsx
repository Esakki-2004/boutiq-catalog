import { ProductPhoto } from "@/components/ProductPhoto";
import { ProductCard } from "@/components/ProductCard";
import { OrderButtons, FloatingWhatsApp } from "@/components/OrderButtons";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { useQuery } from "convex/react";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";

function formatINR(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-6 border-b border-line py-3 font-body text-sm last:border-0">
      <span className="w-28 shrink-0 text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="text-ink">{value}</span>
    </div>
  );
}

export default function ProductDetail() {
  const { lang, t } = useLang();
  const { productId } = useParams<{ productId: string }>();
  const product = useQuery(api.products.get, {
    id: productId as Id<"products">,
  });
  const similar = useQuery(
    api.products.similar,
    product ? { id: product._id, limit: 4 } : "skip",
  );

  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);

  // Reset selections when navigating between products.
  const [lastProductId, setLastProductId] = useState(productId);
  if (productId !== lastProductId) {
    setLastProductId(productId);
    setSize(null);
    setColor(null);
  }

  if (product === undefined) {
    return (
      <div className="flex min-h-screen flex-col bg-ivory">
        <StoreHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4">
          <p className="font-body text-sm text-muted-foreground">
            {t("loadingPiece")}
          </p>
        </main>
        <StoreFooter />
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="flex min-h-screen flex-col bg-ivory">
        <StoreHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
          <p className="font-display text-3xl text-ink">{t("goneTitle")}</p>
          <Link
            to="/shop"
            className="font-body text-sm text-maroon underline underline-offset-4 hover:text-maroon-deep"
          >
            {t("backToCollection")}
          </Link>
        </main>
        <StoreFooter />
      </div>
    );
  }

  const displayName =
    lang === "ta" && product.nameTa ? product.nameTa : product.name;
  const displayNotes =
    lang === "ta" && product.notesTa ? product.notesTa : product.notes;
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <StoreHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1 font-body text-xs text-muted-foreground"
        >
          <Link to="/" className="hover:text-maroon">Nool</Link>
          <ChevronRight className="size-3" />
          <Link
            to={`/shop?category=${product.category}`}
            className="capitalize hover:text-maroon"
          >
            {product.category}
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-ink">{displayName}</span>
        </nav>

        <div className="mt-6 flex flex-col gap-10 lg:flex-row lg:gap-14">
          {/* Image */}
          <div className="w-full shrink-0 lg:w-[46%]">
            <div className="gold-glow relative aspect-[3/4] w-full overflow-hidden border-2 border-gold/60 bg-sand">
              <ProductPhoto
                photoId={product.photoId}
                photoUrl={product.photoUrl}
                category={product.category}
                alt={displayName}
                width={900}
              />
              <div className="arch pointer-events-none absolute inset-x-6 inset-y-4 border border-gold-soft/40" />
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold">
              {product.brand}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              {displayName}
            </h1>

            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-body text-xl font-medium text-ink">
                {formatINR(product.price)}
              </span>
              {product.mrp > product.price && (
                <>
                  <span className="font-body text-sm text-muted-foreground line-through">
                    {formatINR(product.mrp)}
                  </span>
                  {discount >= 20 && (
                    <span className="font-body text-sm font-medium text-terra">
                      {discount}% {t("off")}
                    </span>
                  )}
                </>
              )}
            </div>
            <p className="mt-1 font-body text-xs text-muted-foreground">
              {t("inclusiveTaxes")}
            </p>

            <div className="rule-gold my-6 h-px" />

            {/* Rating line */}
            <p className="flex items-center gap-2 font-body text-sm text-muted-foreground">
              <svg viewBox="0 0 24 24" className="size-4 fill-gold" aria-hidden="true">
                <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" />
              </svg>
              <span className="font-medium text-ink">{product.rating.toFixed(1)}</span>
              {product.ratingCount > 0 && (
                <>
                  · {product.ratingCount.toLocaleString("en-IN")} {t("reviews")}
                </>
              )}
            </p>

            {/* Colours */}
            {product.colors.length > 0 && (
              <div className="mt-6">
                <p className="font-body text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                  {t("colour")} —{" "}
                  <span className="text-ink">{color ?? product.colors[0]}</span>
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(color === c ? null : c)}
                      className={cn(
                        "border px-4 py-2 font-body text-sm transition-colors",
                        color === c
                          ? "border-maroon bg-maroon text-primary-foreground"
                          : "border-line bg-card text-ink hover:border-maroon/50",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 1 && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="font-body text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                    {t("selectSize")}
                  </p>
                  <button
                    type="button"
                    className="font-body text-xs text-maroon underline underline-offset-4"
                  >
                    {t("sizeGuide")}
                  </button>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(size === s ? null : s)}
                      className={cn(
                        "flex h-10 min-w-11 items-center justify-center border px-3 font-body text-sm transition-colors",
                        size === s
                          ? "border-maroon bg-maroon text-primary-foreground"
                          : "border-line bg-card text-ink hover:border-maroon/50",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Special order CTAs — WhatsApp or call */}
            <div className="mt-8">
              <OrderButtons
                name={product.name}
                nameTa={product.nameTa}
                brand={product.brand}
                price={product.price}
                size={size}
                color={color ?? product.colors[0]}
              />
              <p className="mt-3 flex items-start gap-2 font-body text-xs leading-5 text-muted-foreground">
                <span className="mt-[7px] size-1 shrink-0 rounded-full bg-gold" />
                {t("orderNote")}
              </p>
            </div>

            {/* Details */}
            <div className="mt-8">
              <p className="font-display text-2xl text-ink">{t("detailsTitle")}</p>
              <div className="mt-3 border-t-2 border-gold/30">
                <DetailRow label={t("descLabel")} value={displayNotes} />
                <DetailRow
                  label={t("silLabel")}
                  value={`${product.subcategory} · ${product.category}`}
                />
                <DetailRow label={t("careLabel")} value={t("careValue")} />
                <DetailRow label={t("madeLabel")} value={t("madeValue")} />
              </div>
            </div>
          </div>
        </div>

        {/* Similar products */}
        {similar && similar.length > 0 && (
          <section className="mt-16">
            <div className="mb-8 text-center">
              <p className="eyebrow text-gold">{t("alsoLoveEyebrow")}</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
                {t("alsoLoveTitle")}
              </h2>
              <div className="rule-gold mx-auto mt-4 h-px w-24" />
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {(similar as Doc<"products">[]).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <StoreFooter />
      <FloatingWhatsApp />
    </div>
  );
}
