import type { Doc } from "@/convex/_generated/dataModel";
import { Link } from "react-router";
import { ProductPhoto } from "./ProductPhoto";

function formatINR(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

/**
 * Boutique product card — tall flat imagery, serif product name, quiet price
 * line. Hover: slow zoom and a maroon underline on the name.
 */
export function ProductCard({
  product,
  className,
}: {
  product: Doc<"products">;
  className?: string;
}) {
  return (
    <Link to={`/product/${product._id}`} className={`group block ${className ?? ""}`}>
      <div className="relative aspect-[3/4] w-full overflow-hidden border border-gold/25 bg-sand transition-all duration-500 group-hover:border-gold/70 group-hover:shadow-[0_0_0_1px_rgba(185,138,47,0.2),0_10px_32px_rgba(185,138,47,0.16)]">
        <ProductPhoto
          photoId={product.photoId}
          category={product.category}
          alt={product.name}
          width={520}
          className="img-zoom"
        />
        {product.tags.includes("new") && (
          <span className="bg-gold-gradient absolute left-3 top-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-maroon-deep shadow-btq">
            New
          </span>
        )}
      </div>
      <div className="pt-3.5">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
          {product.brand}
        </p>
        <p className="mt-1 font-display text-lg leading-snug text-ink decoration-gold decoration-1 underline-offset-4 group-hover:underline">
          {product.name}
        </p>
        <p className="mt-1.5 flex items-baseline gap-2 font-body text-sm">
          <span className="font-medium text-ink">{formatINR(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">
            {formatINR(product.mrp)}
          </span>
        </p>
      </div>
    </Link>
  );
}
