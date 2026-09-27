import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { FloatingWhatsApp } from "@/components/OrderButtons";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { ChevronDown, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

const CATEGORIES = [
  { id: "kurtas", label: "Kurtas & Kurtis" },
  { id: "sarees", label: "Sarees" },
  { id: "sets", label: "Co-ord Sets" },
  { id: "dresses", label: "Dresses" },
] as const;

const SORTS = [
  { id: "relevance", label: "Featured" },
  { id: "priceAsc", label: "Price — Low to High" },
  { id: "priceDesc", label: "Price — High to Low" },
  { id: "newest", label: "New Arrivals" },
  { id: "rating", label: "Most Loved" },
] as const;

const PRICE_BANDS = [
  { id: "all", label: "All prices", min: 0, max: Number.POSITIVE_INFINITY },
  { id: "under2500", label: "Under ₹2,500", min: 0, max: 2499 },
  { id: "2500to4000", label: "₹2,500 – ₹4,000", min: 2500, max: 4000 },
  { id: "4000to6000", label: "₹4,000 – ₹6,000", min: 4001, max: 6000 },
  { id: "over6000", label: "Above ₹6,000", min: 6001, max: Number.POSITIVE_INFINITY },
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
    <div className="border-b border-line py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between font-body text-[13px] font-medium uppercase tracking-[0.18em] text-ink"
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

  const cat =
    categoryParam === "kurtas" ||
    categoryParam === "sarees" ||
    categoryParam === "sets" ||
    categoryParam === "dresses"
      ? categoryParam
      : undefined;

  const catalogue = useQuery(api.products.list, {
    category: cat,
    subcategory: subcategoryParam ?? undefined,
    search: qParam || undefined,
  });
  const facetData = useQuery(api.products.facets, { category: cat });

  const items = useMemo(() => {
    const all = catalogue?.items ?? [];
    const band = PRICE_BANDS.find((b) => b.id === priceParam) ?? PRICE_BANDS[0];
    return all
      .filter((p) => p.price >= band.min && p.price <= band.max)
      .filter((p) => p.rating >= minRatingParam);
  }, [catalogue?.items, priceParam, minRatingParam]);

  // Sorting happens client-side over the small curated catalogue so the price
  // and rating filters and the sort dropdown stay perfectly in sync.
  const sorted = useMemo(() => {
    const arr = [...items];
    if (sortParam === "priceAsc") arr.sort((a, b) => a.price - b.price);
    else if (sortParam === "priceDesc") arr.sort((a, b) => b.price - a.price);
    else if (sortParam === "newest")
      arr.sort((a, b) => b._creationTime - a._creationTime);
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
    if (qParam) return `“${qParam}”`;
    if (subcategoryParam) return subcategoryParam;
    if (categoryParam) {
      const c = CATEGORIES.find((c) => c.id === categoryParam);
      return c ? c.label : "The Collection";
    }
    return "The Collection";
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
    <div className="px-5 py-2">
      <div className="flex items-center justify-between py-3">
        <p className="font-display text-xl font-semibold text-ink">Refine</p>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-maroon hover:underline"
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
              className="size-4 rounded-[2px] border-line data-[state=checked]:border-maroon data-[state=checked]:bg-maroon"
            />
            <Label
              htmlFor={`cat-${c.id}`}
              className="cursor-pointer font-body text-sm text-ink"
            >
              {c.label}
            </Label>
          </div>
        ))}
      </FilterSection>

      {cat && facetData && facetData.subcategories.length > 0 && (
        <FilterSection title="Silhouette">
          {facetData.subcategories.map((s) => (
            <div key={s.label} className="flex items-center gap-2.5">
              <Checkbox
                id={`sub-${s.label}`}
                checked={subcategoryParam === s.label}
                onCheckedChange={() =>
                  updateParams((sp) => {
                    if (sp.get("subcategory") === s.label)
                      sp.delete("subcategory");
                    else sp.set("subcategory", s.label);
                  })
                }
                className="size-4 rounded-[2px] border-line data-[state=checked]:border-maroon data-[state=checked]:bg-maroon"
              />
              <Label
                htmlFor={`sub-${s.label}`}
                className="flex cursor-pointer items-center gap-1.5 font-body text-sm text-ink"
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
                className="size-4 border-line text-maroon"
              />
              <Label
                htmlFor={`price-${b.id}`}
                className="cursor-pointer font-body text-sm text-ink"
              >
                {b.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </FilterSection>

      <FilterSection title="Loved by">
        {[4.5, 4].map((r) => (
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
              className="size-4 rounded-[2px] border-line data-[state=checked]:border-maroon data-[state=checked]:bg-maroon"
            />
            <Label
              htmlFor={`rating-${r}`}
              className="flex cursor-pointer items-center gap-1.5 font-body text-sm text-ink"
            >
              {r}
              <svg viewBox="0 0 24 24" className="size-3 fill-gold" aria-hidden="true">
                <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" />
              </svg>
              <span className="text-muted-foreground">&amp; up</span>
            </Label>
          </div>
        ))}
      </FilterSection>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <StoreHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-0 lg:px-8">
        {/* Editorial page head */}
        <div className="px-5 pb-6 pt-8 text-center lg:px-0">
          <p className="eyebrow text-gold">Boutiq Atelier</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
            {heading()}
          </h1>
          <div className="mt-4 flex items-center justify-center gap-3" aria-hidden="true">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
            <svg viewBox="0 0 24 24" className="size-3.5 fill-gold">
              <path d="M12 1l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z" />
            </svg>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar (desktop) */}
          <aside className="hidden w-64 shrink-0 self-start bg-card shadow-btq lg:block">
            {filterPanel}
          </aside>

          {/* Listing column */}
          <div className="min-w-0 flex-1">
            {/* Sort bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-card/70 px-4 py-3">
              <p className="font-body text-sm text-muted-foreground">
                <span className="font-medium text-ink">{sorted.length}</span>{" "}
                {sorted.length === 1 ? "piece" : "pieces"}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex items-center gap-1.5 border border-gold/40 bg-card px-3 py-1.5 font-body text-sm text-ink lg:hidden"
                >
                  Refine
                  {activeFilterCount > 0 && (
                    <span className="bg-gold-gradient px-1.5 text-[10px] font-semibold text-maroon-deep">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <div className="flex items-center gap-2 font-body text-sm">
                  <span className="hidden text-muted-foreground sm:inline">
                    Sort
                  </span>
                  <select
                    value={sortParam}
                    onChange={(e) =>
                      updateParams((sp) => sp.set("sort", e.target.value))
                    }
                    className="border border-line bg-card px-2 py-1.5 font-body text-sm text-ink outline-none focus:border-maroon"
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
              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-sand px-3 py-1 font-body text-sm text-maroon">
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
              className="relative mt-4 lg:hidden"
            >
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search kurtas, sarees, sets…"
                className="h-10 w-full border border-line bg-card pl-9 pr-3 font-body text-sm text-ink outline-none focus:border-maroon"
              />
            </form>

            {/* Product grid */}
            {catalogue === undefined ? (
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <div className="aspect-[3/4] w-full animate-pulse bg-sand" />
                    <div className="mt-3 h-4 w-2/3 animate-pulse bg-sand" />
                    <div className="mt-2 h-3 w-1/2 animate-pulse bg-sand" />
                  </div>
                ))}
              </div>
            ) : sorted.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
                {sorted.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-center bg-card px-6 py-16 text-center shadow-btq">
                <Search className="size-8 text-gold/50" />
                <p className="mt-4 font-display text-2xl text-ink">
                  Nothing here yet
                </p>
                <p className="mt-1 max-w-sm font-body text-sm text-muted-foreground">
                  Try a different spelling, or clear a filter to see more of the
                  collection.
                </p>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="sheen bg-gold-gradient mt-6 px-6 py-2.5 font-body text-sm font-semibold uppercase tracking-[0.14em] text-maroon-deep"
                  >
                    Clear refinements
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <StoreFooter />
      <FloatingWhatsApp />

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-maroon-deep/30 backdrop-blur-[2px]"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-card">
            <div className="sticky top-0 flex items-center justify-between border-b border-line bg-card px-5 py-4">
              <p className="font-display text-xl text-ink">Refine</p>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <X className="size-5 text-ink" />
              </button>
            </div>
            {filterPanel}
            <div className="sticky bottom-0 border-t border-line bg-card p-4">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="sheen bg-gold-gradient w-full py-3 font-body text-sm font-semibold uppercase tracking-[0.14em] text-maroon-deep"
              >
                Show {sorted.length} {sorted.length === 1 ? "piece" : "pieces"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
