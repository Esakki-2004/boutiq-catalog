import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  BadgeCheck,
  Banknote,
  ChevronRight,
  RefreshCcw,
  Truck,
} from "lucide-react";
import { Link } from "react-router";

const CATEGORIES = [
  {
    id: "women",
    label: "Women",
    photoId: "photo-1594633312681-425c7b97ccd1",
    sub: "Kurtas · Dresses · Sarees",
  },
  {
    id: "men",
    label: "Men",
    photoId: "photo-1521572163474-6864f9cf17ab",
    sub: "T-Shirts · Shirts · Jeans",
  },
  {
    id: "kids",
    label: "Kids",
    photoId: "photo-1503919545889-aef636e10ad4",
    sub: "T-Shirts · Frocks · Dungarees",
  },
] as const;

const USPS = [
  { icon: Truck, title: "Free Delivery", desc: "On every order, everywhere" },
  { icon: RefreshCcw, title: "7-Day Returns", desc: "No-questions-asked pickup" },
  { icon: Banknote, title: "Cash on Delivery", desc: "Pay when it arrives" },
  { icon: BadgeCheck, title: "100% Genuine", desc: "Brand-authorised sourcing" },
] as const;

function SectionBand({
  title,
  link,
  children,
}: {
  title: string;
  link?: { to: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card shadow-fk">
      <div className="flex items-center justify-between border-b border-fk-line px-4 py-3 lg:px-6">
        <h2 className="text-lg font-semibold text-fk-ink lg:text-xl">{title}</h2>
        {link && (
          <Link
            to={link.to}
            className="flex items-center gap-0.5 text-sm font-semibold text-fk-header hover:underline"
          >
            {link.label}
            <ChevronRight className="size-4" />
          </Link>
        )}
      </div>
      <div className="px-4 py-4 lg:px-6">{children}</div>
    </section>
  );
}

export default function Landing() {
  const trending = useQuery(api.products.list, { sort: "relevance" });
  const deals = useQuery(api.products.list, { sort: "priceDesc" });

  const trendingItems = trending?.items.slice(0, 5) ?? [];
  const dealItems = deals?.items.slice(0, 5) ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StoreHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-0 py-4 lg:px-6 lg:py-6">
        <div className="flex flex-col gap-4">
          {/* Hero banner */}
          <section className="relative overflow-hidden bg-fk-wash">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-10 text-center sm:py-14">
              <span className="bg-fk-accent px-3 py-1 text-xs font-bold uppercase tracking-widest text-fk-ink">
                Big Boutique Days
              </span>
              <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-fk-ink sm:text-4xl lg:text-5xl">
                Style that ships fast.
                <span className="block text-fk-header">
                  Prices that feel like a steal.
                </span>
              </h1>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                Fresh drops from Anouk, Sereia, Roadster and more — up to 60%
                off, free delivery and 7-day easy returns on everything.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/shop">
                  <Button className="h-11 rounded-sm bg-fk-header px-8 text-base font-semibold shadow-sm hover:bg-fk-header-soft">
                    Shop the Catalogue
                  </Button>
                </Link>
                <Link to="/shop?sort=priceAsc">
                  <Button
                    variant="outline"
                    className="h-11 rounded-sm border-fk-header/30 bg-white px-6 text-base font-semibold text-fk-header hover:bg-secondary hover:text-fk-header"
                  >
                    Best Prices
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">
                No login needed to browse · Sign in only to check out faster
              </p>
            </div>
          </section>

          {/* Category tiles */}
          <section className="bg-card shadow-fk">
            <div className="grid grid-cols-3 divide-x divide-fk-line">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.id}`}
                  className="group flex flex-col items-center gap-2 px-3 py-6 transition-colors hover:bg-fk-soft sm:py-8"
                >
                  <div className="size-20 overflow-hidden rounded-full border border-fk-line bg-fk-soft sm:size-24">
                    <img
                      src={`https://images.unsplash.com/${cat.photoId}?auto=format&fit=crop&w=240&q=70`}
                      alt={`${cat.label} clothing`}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-sm font-semibold text-fk-ink sm:text-base">
                    {cat.label}
                  </p>
                  <p className="hidden text-xs text-muted-foreground sm:block">
                    {cat.sub}
                  </p>
                  <span className="mt-1 text-xs font-semibold text-fk-header">
                    Shop Now
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Deals of the Day strip */}
          <SectionBand
            title="Deals of the Day"
            link={{ to: "/shop?sort=priceDesc", label: "VIEW ALL" }}
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {dealItems.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
              {dealItems.length === 0 && (
                <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                  Loading today&apos;s deals…
                </p>
              )}
            </div>
          </SectionBand>

          {/* Trending strip */}
          <SectionBand
            title="Trending at Boutiq"
            link={{ to: "/shop", label: "VIEW ALL" }}
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {trendingItems.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
              {trendingItems.length === 0 && (
                <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                  Loading trending picks…
                </p>
              )}
            </div>
          </SectionBand>

          {/* USP row */}
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {USPS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-3 bg-card p-4 shadow-fk"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-fk-header">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-fk-ink">{title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Bottom CTA */}
          <section className="bg-card shadow-fk">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-12 text-center">
              <h2 className="text-2xl font-bold text-fk-ink">
                The full catalogue, one tap away
              </h2>
              <p className="text-sm text-muted-foreground">
                {trending?.total ?? "17"} styles across Women, Men and Kids —
                filter by price, rating and more.
              </p>
              <Link to="/shop">
                <Button className="h-11 rounded-sm bg-fk-accent px-10 text-base font-bold text-fk-ink shadow-sm hover:bg-fk-accent/90">
                  Browse Everything
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
