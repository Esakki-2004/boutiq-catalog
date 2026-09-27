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
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand">
        <ProductPhoto
          photoId={product.photoId}
          category={product.category}
          alt={product.name}
          width={520}
          className="img-zoom"
        />
        {product.tags.includes("new") && (
          <span className="absolute left-3 top-3 bg-card px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-maroon shadow-btq">
            New
          </span>
        )}
      </div>
      <div className="pt-3.5">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {product.brand}
        </p>
        <p className="mt-1 font-display text-lg leading-snug text-ink decoration-maroon/40 decoration-1 underline-offset-4 group-hover:underline">
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
