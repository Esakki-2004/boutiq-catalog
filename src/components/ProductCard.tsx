import type { Doc } from "@/convex/_generated/dataModel";
import { useLang } from "@/lib/i18n";
import { Link } from "react-router";
import { ProductPhoto } from "./ProductPhoto";

function formatINR(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

/**
 * Nool product card — tall flat imagery, serif product name in the
 * shopper's language (Tamil falls back to English when the owner hasn't
 * filled it in), quiet price line, gold frame.
 */
export function ProductCard({
  product,
  className,
}: {
  product: Doc<"products">;
  className?: string;
}) {
  const { lang, t } = useLang();
  const displayName =
    lang === "ta" && product.nameTa ? product.nameTa : product.name;

  return (
    <Link to={`/product/${product._id}`} className={`group block ${className ?? ""}`}>
      <div className="relative aspect-[3/4] w-full overflow-hidden border border-gold/25 bg-sand transition-all duration-500 group-hover:border-gold/70 group-hover:shadow-[0_0_0_1px_rgba(185,138,47,0.2),0_10px_32px_rgba(185,138,47,0.16)]">
        <ProductPhoto
          photoId={product.photoId}
          photoUrl={product.photoUrl}
          category={product.category}
          alt={displayName}
          width={520}
          className="img-zoom"
        />
        {product.tags.includes("new") && (
          <span className="bg-gold-gradient absolute left-3 top-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-maroon-deep shadow-btq">
            {t("newTag")}
          </span>
        )}
      </div>
      <div className="pt-3.5">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
          {product.brand}
        </p>
        <p className="mt-1 font-display text-lg leading-snug text-ink decoration-gold decoration-1 underline-offset-4 group-hover:underline">
          {displayName}
        </p>
        <p className="mt-1.5 flex items-baseline gap-2 font-body text-sm">
          <span className="font-medium text-ink">{formatINR(product.price)}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatINR(product.mrp)}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
