import { ProductPhoto } from "@/components/ProductPhoto";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import {
  Banknote,
  BadgeCheck,
  ChevronRight,
  RefreshCcw,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

function formatINR(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function StarRating({ rating, large = false }: { rating: number; large?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm bg-[#388e3c] font-bold text-white",
        large ? "px-2 py-1 text-sm" : "px-1.5 py-0.5 text-xs",
      )}
    >
      {rating.toFixed(1)}
      <svg viewBox="0 0 24 24" className={large ? "size-3.5 fill-white" : "size-3 fill-white"} aria-hidden="true">
        <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" />
      </svg>
    </span>
  );
}

function PriceBlock({ product }: { product: Doc<"products"> }) {
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-2xl font-bold text-fk-ink">
          {formatINR(product.price)}
        </span>
        <span className="text-sm text-muted-foreground line-through">
          {formatINR(product.mrp)}
        </span>
        <span className="text-sm font-bold text-fk-green">{discount}% off</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Inclusive of all taxes · Extra {discount}% off applied
      </p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 text-sm">
      <span className="w-24 shrink-0 text-muted-foreground">{label}</span>
      <span className="text-fk-ink">{value}</span>
    </div>
  );
}

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const product = useQuery(api.products.get, {
    id: productId as Id<"products">,
  });
  const similar = useQuery(
    api.products.similar,
    product ? { id: product._id, limit: 5 } : "skip",
  );

  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    setSize(null);
    setColor(null);
  }, [productId]);

  if (product === undefined) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <StoreHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4">
          <p className="text-sm text-muted-foreground">Loading product…</p>
        </main>
        <StoreFooter />
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <StoreHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
          <p className="text-lg font-semibold text-fk-ink">
            This product isn&apos;t available.
          </p>
          <Link to="/shop" className="text-sm font-semibold text-fk-header hover:underline">
            Back to the catalogue
          </Link>
        </main>
        <StoreFooter />
      </div>
    );
  }

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StoreHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-0 py-4 lg:px-6">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1 px-4 text-xs text-muted-foreground lg:px-0"
        >
          <Link to="/" className="hover:text-fk-header">Home</Link>
          <ChevronRight className="size-3" />
          <Link
            to={`/shop?category=${product.category}`}
            className="capitalize hover:text-fk-header"
          >
            {product.category}
          </Link>
          <ChevronRight className="size-3" />
          <Link
            to={`/shop?category=${product.category}&subcategory=${encodeURIComponent(product.subcategory)}`}
            className="hover:text-fk-header"
          >
            {product.subcategory}
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-fk-ink">{product.name}</span>
        </nav>

        <div className="mt-3 flex flex-col gap-4 lg:flex-row">
          {/* Image panel */}
          <div className="w-full shrink-0 self-start bg-card p-4 shadow-fk lg:sticky lg:top-32 lg:w-[42%]">
            <div className="aspect-[3/4] w-full overflow-hidden bg-[#f5f7fa]">
              <ProductPhoto
                photoId={product.photoId}
                subcategory={product.subcategory}
                alt={product.name}
                width={900}
              />
            </div>
            {discount >= 40 && (
              <p className="mt-3 inline-block bg-fk-accent px-2 py-1 text-xs font-bold text-fk-ink">
                {discount}% OFF — Big Boutique Days
              </p>
            )}
          </div>

          {/* Details panel */}
          <div className="min-w-0 flex-1 bg-card p-5 shadow-fk sm:p-6">
            <p className="text-base text-muted-foreground">{product.brand}</p>
            <h1 className="mt-1 text-xl font-semibold text-fk-ink sm:text-2xl">
              {product.name}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StarRating rating={product.rating} large />
              <span className="text-sm text-muted-foreground">
                {product.ratingCount.toLocaleString("en-IN")} ratings
              </span>
              {product.tags.includes("bestseller") && (
                <span className="bg-secondary px-2 py-0.5 text-xs font-bold text-fk-header">
                  Bestseller
                </span>
              )}
            </div>

            <Separator className="my-4" />

            <PriceBlock product={product} />

            {product.sizes.length > 1 && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold text-fk-ink">
                  Select size
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(size === s ? null : s)}
                      className={cn(
                        "flex h-9 min-w-11 items-center justify-center border px-3 text-sm font-medium transition-colors",
                        size === s
                          ? "border-fk-header bg-secondary text-fk-header"
                          : "border-border bg-white text-fk-ink hover:border-fk-header/60",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold text-fk-ink">
                  Colour:{" "}
                  <span className="font-normal text-muted-foreground">
                    {color ?? product.colors[0]}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(color === c ? null : c)}
                      className={cn(
                        "border px-3 py-1.5 text-sm transition-colors",
                        color === c
                          ? "border-fk-header bg-secondary font-medium text-fk-header"
                          : "border-border bg-white text-fk-ink hover:border-fk-header/60",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-5" />

            <p className="text-sm font-semibold uppercase tracking-wide text-fk-ink">
              Product details
            </p>
            <div className="mt-3 space-y-2">
              <DetailRow label="Description" value={product.notes} />
              <DetailRow
                label="Category"
                value={`${product.category} · ${product.subcategory}`}
              />
              <DetailRow label="Fabric care" value="Machine wash as per label" />
              <DetailRow label="Country of origin" value="India" />
            </div>

            <Separator className="my-5" />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Truck, label: "Free delivery" },
                { icon: RefreshCcw, label: "7-day returns" },
                { icon: Banknote, label: "Cash on delivery" },
                { icon: BadgeCheck, label: "100% genuine" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 border border-fk-line p-3 text-center"
                >
                  <Icon className="size-5 text-fk-header" />
                  <span className="text-xs font-medium text-fk-ink">{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                className="h-12 flex-1 rounded-sm bg-fk-accent text-base font-bold text-fk-ink shadow-sm hover:bg-fk-accent/90"
                title="Cart and checkout arrive in a future version"
              >
                Add to Cart
              </Button>
              <Button
                className="h-12 flex-1 rounded-sm bg-fk-header text-base font-semibold hover:bg-fk-header-soft"
                title="Cart and checkout arrive in a future version"
              >
                Buy Now
              </Button>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground sm:text-left">
              Cart &amp; checkout are planned for the next version of Boutiq.
            </p>
          </div>
        </div>

        {/* Similar products */}
        {similar && similar.length > 0 && (
          <section className="mt-4 bg-card shadow-fk">
            <div className="border-b border-fk-line px-4 py-3 lg:px-6">
              <h2 className="text-lg font-semibold text-fk-ink">Similar products</h2>
            </div>
            <div className="grid grid-cols-2 gap-px bg-fk-line sm:grid-cols-3 lg:grid-cols-5">
              {similar.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <StoreFooter />
    </div>
  );
}
