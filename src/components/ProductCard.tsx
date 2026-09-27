import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Doc } from "@/convex/_generated/dataModel";
import { Link } from "react-router";
import { ProductPhoto } from "./ProductPhoto";

function formatINR(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-sm bg-[#388e3c] px-1.5 py-0.5 text-xs font-bold text-white">
      {rating.toFixed(1)}
      <svg viewBox="0 0 24 24" className="size-3 fill-white" aria-hidden="true">
        <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" />
      </svg>
    </span>
  );
}

/**
 * Catalogue product card — Flipkart listing style: white tile, centered
 * garment photo, brand line, green rating chip, price block with % off.
 */
export function ProductCard({
  product,
  className,
}: {
  product: Doc<"products">;
  className?: string;
}) {
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <Link
      to={`/product/${product._id}`}
      className={cn(
        "group flex h-full flex-col border border-transparent bg-card p-3 transition-shadow hover:shadow-fk hover:outline hover:outline-border/60",
        className,
      )}
    >
      <div className="relative mb-3 aspect-[3/4] w-full overflow-hidden bg-[#f5f7fa]">
        <ProductPhoto
          photoId={product.photoId}
          subcategory={product.subcategory}
          alt={product.name}
          width={500}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {discount >= 40 && (
          <span className="absolute left-0 top-2 bg-fk-accent px-1.5 py-0.5 text-[11px] font-semibold text-fk-ink">
            {discount}% OFF
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <p className="truncate text-sm font-medium text-fk-ink">{product.brand}</p>
        <p className="mt-0.5 line-clamp-2 min-h-9 text-xs leading-4 text-muted-foreground">
          {product.notes}
        </p>
        <div className="mt-2">
          <StarRating rating={product.rating} />
          <span className="ml-1.5 align-middle text-xs text-muted-foreground">
            ({product.ratingCount.toLocaleString("en-IN")})
          </span>
        </div>
        <div className="mt-auto pt-2">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-base font-bold text-fk-ink">
              {formatINR(product.price)}
            </span>
            <span className="text-xs text-muted-foreground line-through">
              {formatINR(product.mrp)}
            </span>
            <span className="text-xs font-semibold text-fk-green">
              {discount}% off
            </span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-fk-green">
            Free delivery
          </p>
        </div>
      </div>
      {product.tags.includes("bestseller") && (
        <Badge
          variant="outline"
          className="mt-2 w-fit border-border/70 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Bestseller
        </Badge>
      )}
    </Link>
  );
}
