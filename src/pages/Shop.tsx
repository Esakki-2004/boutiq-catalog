import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { ChevronDown, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";

const CATEGORIES = [
  { id: "women", label: "Women" },
  { id: "men", label: "Men" },
  { id: "kids", label: "Kids" },
] as const;

const SORTS = [
  { id: "relevance", label: "Popularity" },
  { id: "priceAsc", label: "Price -- Low to High" },
  { id: "priceDesc", label: "Price -- High to Low" },
  { id: "newest", label: "Newest First" },
  { id: "rating", label: "Customer Rating" },
] as const;

const PRICE_BANDS = [
  { id: "all", label: "All prices", min: 0, max: Number.POSITIVE_INFINITY },
  { id: "under500", label: "Under ₹500", min: 0, max: 499 },
  { id: "500to1000", label: "₹500 – ₹1000", min: 500, max: 1000 },
  { id: "1000to2000", label: "₹1001 – ₹2000", min: 1001, max: 2000 },
  { id: "over2000", label: "Over ₹2000", min: 2001, max: Number.POSITIVE_INFINITY },
] as const;

type SortId = (typeof SORTS)[number]["id"];

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-fk-line py-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-sm font-semibold uppercase tracking-wide text-fk-ink"
      >
        {title}
        <ChevronDown
          className={cn("size-4 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="mt-3 space-y-2.5">{children}</div>}
    </div>
  );
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category");
  const subcategoryParam = searchParams.get("subcategory");
  const qParam = searchParams.get("q") ?? "";
  const sortParam = (searchParams.get("sort") ?? "relevance") as SortId;
  const priceParam = searchParams.get("price") ?? "all";
  const minRatingParam = Number(searchParams.get("rating") ?? "0");

  const [searchInput, setSearchInput] = useState(qParam);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const catalogue = useQuery(api.products.list, {
    category:
      categoryParam === "women" || categoryParam === "men" || categoryParam === "kids"
        ? categoryParam
        : undefined,
    subcategory: subcategoryParam ?? undefined,
    search: qParam || undefined,
  });
  const facetData = useQuery(api.products.facets, {
    category:
      categoryParam === "women" || categoryParam === "men" || categoryParam === "kids"
        ? categoryParam
        : undefined,
  });

  const items = useMemo(() => {
    const all = catalogue?.items ?? [];
    const band = PRICE_BANDS.find((b) => b.id === priceParam) ?? PRICE_BANDS[0];
    return all
      .filter((p) => p.price >= band.min && p.price <= band.max)
      .filter((p) => p.rating >= minRatingParam);
  }, [catalogue?.items, priceParam, minRatingParam]);

  // Sorting handled client-side over the small curated catalogue so the price
  // and rating filters and the sort dropdown stay perfectly in sync.
  const sorted = useMemo(() => {
    const arr = [...items];
    if (sortParam === "priceAsc") arr.sort((a, b) => a.price - b.price);
    else if (sortParam === "priceDesc") arr.sort((a, b) => b.price - a.price);
    else if (sortParam === "newest") arr.sort((a, b) => b._creationTime - a._creationTime);
    else if (sortParam === "rating")
      arr.sort((a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount);
    else arr.sort((a, b) => b.ratingCount - a.ratingCount);
    return arr;
  }, [items, sortParam]);

  function updateParams(fn: (sp: URLSearchParams) => void) {
    const next = new URLSearchParams(searchParams);
    fn(next);
    setSearchParams(next, { replace: false });
  }

  function toggleCategory(id: string) {
    updateParams((sp) => {
      if (sp.get("category") === id) sp.delete("category");
      else sp.set("category", id);
      sp.delete("subcategory");
    });
  }

  function heading() {
    if (qParam) return `Results for "${qParam}"`;
    if (subcategoryParam) return subcategoryParam;
    if (categoryParam) {
      const c = CATEGORIES.find((c) => c.id === categoryParam);
      return c ? c.label : "All products";
    }
    return "All products";
  }

  const activeFilterCount =
    (categoryParam ? 1 : 0) +
    (subcategoryParam ? 1 : 0) +
    (priceParam !== "all" ? 1 : 0) +
    (minRatingParam > 0 ? 1 : 0) +
    (qParam ? 1 : 0);

  function clearAll() {
    setSearchInput("");
    setSearchParams({}, { replace: false });
  }

  const filterPanel = (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between py-2">
        <p className="text-base font-bold text-fk-ink">Filters</p>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold uppercase tracking-wide text-fk-header hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Categories">
        {CATEGORIES.map((c) => (
          <div key={c.id} className="flex items-center gap-2.5">
            <Checkbox
              id={`cat-${c.id}`}
              checked={categoryParam === c.id}
              onCheckedChange={() => toggleCategory(c.id)}
              className="size-4 rounded-sm border-muted-foreground/50 data-[state=checked]:border-fk-header data-[state=checked]:bg-fk-header"
            />
            <Label
              htmlFor={`cat-${c.id}`}
              className="cursor-pointer text-sm text-fk-ink"
            >
              {c.label}
            </Label>
          </div>
        ))}
      </FilterSection>

      {categoryParam && facetData && facetData.subcategories.length > 0 && (
        <FilterSection title="Refine">
          {facetData!.subcategories.map((s) => (
            <div key={s.label} className="flex items-center gap-2.5">
              <Checkbox
                id={`sub-${s.label}`}
                checked={subcategoryParam === s.label}
                onCheckedChange={() =>
                  updateParams((sp) => {
                    if (sp.get("subcategory") === s.label) sp.delete("subcategory");
                    else sp.set("subcategory", s.label);
                  })
                }
                className="size-4 rounded-sm border-muted-foreground/50 data-[state=checked]:border-fk-header data-[state=checked]:bg-fk-header"
              />
              <Label
                htmlFor={`sub-${s.label}`}
                className="flex cursor-pointer items-center gap-1.5 text-sm text-fk-ink"
              >
                {s.label}
                <span className="text-xs text-muted-foreground">({s.count})</span>
              </Label>
            </div>
          ))}
        </FilterSection>
      )}

      <FilterSection title="Price">
        <RadioGroup
          value={priceParam}
          onValueChange={(v) => updateParams((sp) => sp.set("price", v))}
          className="gap-2.5"
        >
          {PRICE_BANDS.map((b) => (
            <div key={b.id} className="flex items-center gap-2.5">
              <RadioGroupItem
                value={b.id}
                id={`price-${b.id}`}
                className="size-4 border-muted-foreground/50 text-fk-header"
              />
              <Label
                htmlFor={`price-${b.id}`}
                className="cursor-pointer text-sm text-fk-ink"
              >
                {b.label}
              </Label>
            </div>
          ))}
      </RadioGroup>
      </FilterSection>

      <FilterSection title="Customer Rating">
        {[4, 3].map((r) => (
          <div key={r} className="flex items-center gap-2.5">
            <Checkbox
              id={`rating-${r}`}
              checked={minRatingParam === r}
              onCheckedChange={() =>
                updateParams((sp) => {
                  if (Number(sp.get("rating") ?? "0") === r) sp.delete("rating");
                  else sp.set("rating", String(r));
                })
              }
              className="size-4 rounded-sm border-muted-foreground/50 data-[state=checked]:border-fk-header data-[state=checked]:bg-fk-header"
            />
            <Label
              htmlFor={`rating-${r}`}
              className="flex cursor-pointer items-center gap-1.5 text-sm text-fk-ink"
            >
              {r}
              <svg viewBox="0 0 24 24" className="size-3.5 fill-fk-accent" aria-hidden="true">
                <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" />
              </svg>
              <span className="text-muted-foreground">&amp; above</span>
            </Label>
          </div>
        ))}
      </FilterSection>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StoreHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-0 py-4 lg:px-6">
        <div className="flex gap-4">
          {/* Sidebar (desktop) */}
          <aside className="hidden w-60 shrink-0 self-start bg-card shadow-fk lg:block">
            {filterPanel}
          </aside>

          {/* Listing column */}
          <div className="min-w-0 flex-1">
            {/* Sort bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-card px-4 py-2.5 shadow-fk">
              <p className="text-sm text-fk-ink">
                <span className="font-semibold">
                  {sorted.length > 0 ? `${sorted.length} items` : "No items"}
                </span>
                <span className="hidden sm:inline"> in {heading()}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex items-center gap-1.5 border border-border px-3 py-1.5 text-sm font-medium text-fk-ink lg:hidden"
                >
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-fk-header px-1.5 text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <div className="flex items-center gap-2 text-sm">
                  <span className="hidden text-muted-foreground sm:inline">Sort by</span>
                  <select
                    value={sortParam}
                    onChange={(e) =>
                      updateParams((sp) => sp.set("sort", e.target.value))
                    }
                    className="border border-border bg-card px-2 py-1.5 text-sm font-medium text-fk-ink outline-none focus:border-fk-header"
                  >
                    {SORTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Active search pill */}
            {qParam && (
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-secondary px-3 py-1 text-sm font-medium text-fk-header">
                  {qParam}
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      setSearchInput("");
                      updateParams((sp) => sp.delete("q"));
                    }}
                  >
                    <X className="size-3.5" />
                  </button>
                </span>
              </div>
            )}

            {/* Mobile search field */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateParams((sp) => {
                  const v = searchInput.trim();
                  if (v) sp.set("q", v);
                  else sp.delete("q");
                });
              }}
              className="relative mt-3 lg:hidden"
            >
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products, brands…"
                className="h-10 w-full border border-border bg-card pl-9 pr-3 text-sm text-fk-ink outline-none focus:border-fk-header"
              />
            </form>

            {/* Product grid */}
            {catalogue === undefined ? (
              <div className="grid grid-cols-2 gap-px bg-fk-line sm:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-card p-3">
                    <div className="aspect-[3/4] w-full animate-pulse bg-fk-soft" />
                    <div className="mt-3 h-4 w-2/3 animate-pulse bg-fk-soft" />
                    <div className="mt-2 h-3 w-full animate-pulse bg-fk-soft" />
                    <div className="mt-2 h-4 w-1/2 animate-pulse bg-fk-soft" />
                  </div>
                ))}
              </div>
            ) : sorted.length > 0 ? (
              <div className="mt-3 grid grid-cols-2 gap-px bg-fk-line sm:grid-cols-3 xl:grid-cols-4">
                {sorted.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <div className="mt-3 flex flex-col items-center bg-card px-6 py-16 text-center shadow-fk">
                <Search className="size-10 text-muted-foreground/40" />
                <p className="mt-4 text-lg font-semibold text-fk-ink">
                  Sorry, no results found!
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Please check the spelling or try removing some filters.
                </p>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-5 rounded-sm bg-fk-header px-5 py-2 text-sm font-semibold text-white hover:bg-fk-header-soft"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <StoreFooter />

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-card shadow-xl">
            <div className="sticky top-0 flex items-center justify-between bg-fk-header px-4 py-3">
              <p className="text-sm font-semibold text-white">Filters</p>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <X className="size-5 text-white" />
              </button>
            </div>
            {filterPanel}
            <div className="sticky bottom-0 border-t border-fk-line bg-card p-3">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-fk-accent py-2.5 text-sm font-bold text-fk-ink"
              >
                Show {sorted.length} results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
