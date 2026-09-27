import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Link } from "react-router";

const CATEGORIES = [
  {
    id: "kurtas",
    label: "Kurtas & Kurtis",
    photoId: "photo-1583394838336-acd977736f90",
    sub: "Cotton · Silk · Chikankari",
  },
  {
    id: "sarees",
    label: "Sarees",
    photoId: "photo-1583496661160-fb5886a0aaaa",
    sub: "Banarasi · Kanjivaram · Chanderi",
  },
  {
    id: "sets",
    label: "Co-ord Sets",
    photoId: "photo-1572804013309-59a88b7e92f1",
    sub: "Kurta · Sharara · Lounge",
  },
  {
    id: "dresses",
    label: "Dresses",
    photoId: "photo-1509631179647-0177331693ae",
    sub: "Midi · Maxi · Wrap",
  },
] as const;

/** Traditional diamond-in-rule ornament, drawn in gold. */
function Ornament({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden="true">
      <span
        className={`h-px w-16 ${
          light
            ? "bg-gradient-to-r from-transparent to-gold-soft/80"
            : "bg-gradient-to-r from-transparent to-gold"
        }`}
      />
      <svg viewBox="0 0 24 24" className="size-3.5 fill-gold">
        <path d="M12 1l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z" />
      </svg>
      <span
        className={`h-px w-16 ${
          light
            ? "bg-gradient-to-l from-transparent to-gold-soft/80"
            : "bg-gradient-to-l from-transparent to-gold"
        }`}
      />
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  link,
  light = false,
}: {
  eyebrow: string;
  title: string;
  link?: { to: string; label: string };
  light?: boolean;
}) {
  return (
    <div className="mb-10 text-center">
      <p className={`eyebrow ${light ? "text-gold-soft" : "text-gold"}`}>
        {eyebrow}
      </p>
      <h2
        className={`mt-3 font-display text-3xl font-semibold sm:text-4xl ${
          light ? "text-[#faf7f2]" : "text-ink"
        }`}
      >
        {title}
      </h2>
      <div className="mt-4">
        <Ornament light={light} />
      </div>
      {link && (
        <Link
          to={link.to}
          className={`mt-4 inline-flex items-center gap-1.5 font-body text-[13px] font-medium uppercase tracking-[0.18em] hover:underline ${
            light ? "text-gold-soft" : "text-maroon"
          }`}
        >
          {link.label}
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}

export default function Landing() {
  const newest = useQuery(api.products.list, { sort: "newest" });
  const loved = useQuery(api.products.list, { sort: "rating" });

  const newItems = newest?.items.slice(0, 4) ?? [];
  const lovedItems = loved?.items.slice(0, 4) ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <StoreHeader />

      <main className="flex-1">
        {/* Hero — deep maroon, jaali lattice, gold arches */}
        <section className="relative overflow-hidden bg-maroon-deep">
          <div className="bg-jaali-dark absolute inset-0" />
          <div
            className="absolute inset-x-0 bottom-0 h-40"
            style={{
              background:
                "linear-gradient(to top, rgba(74,28,28,0.9), transparent)",
            }}
          />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div className="text-center lg:text-left">
              <p className="eyebrow bg-gold-gradient bg-clip-text text-transparent">
                New Season · Chanderi &amp; Silk
              </p>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.12] text-[#faf7f2] sm:text-5xl lg:text-6xl">
                Woven slowly,
                <span className="text-gold-gradient block italic">
                  worn like gold.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-md font-body text-base leading-7 text-[#f0e6d8]/85 lg:mx-0">
                Kurtas, sarees and co-ord sets from our atelier — hand-finished
                in small batches, trimmed with real zari, made to be lived in.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Link to="/shop">
                  <button className="sheen bg-gold-gradient px-9 py-4 font-body text-sm font-semibold uppercase tracking-[0.18em] text-maroon-deep shadow-[0_10px_30px_rgba(185,138,47,0.35)] transition-transform hover:-translate-y-0.5">
                    Shop the Collection
                  </button>
                </Link>
                <Link to="/shop?category=sarees">
                  <button className="border border-gold-soft/50 px-9 py-4 font-body text-sm font-medium uppercase tracking-[0.18em] text-gold-soft transition-colors hover:bg-gold-soft/10">
                    The Saree Edit
                  </button>
                </Link>
              </div>
              <div className="mt-10 lg:mt-12">
                <Ornament light />
              </div>
            </div>

            {/* Arch image trio with gold frames */}
            <div className="flex items-end justify-center gap-4">
              <div className="gold-glow arch w-1/3 overflow-hidden border-2 border-gold/60 bg-sand">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=420&q=70"
                  alt="Chanderi kurta"
                  className="aspect-[3/4.6] w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="gold-glow arch w-2/5 overflow-hidden border-[3px] border-gold bg-sand">
                <img
                  src="https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=520&q=70"
                  alt="Banarasi saree"
                  className="aspect-[3/4.6] w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="gold-glow arch w-1/3 overflow-hidden border-2 border-gold/60 bg-sand">
                <img
                  src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=420&q=70"
                  alt="Lounge set"
                  className="aspect-[3/4.6] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Gold base band under hero */}
          <div className="bg-gold-gradient relative h-1.5" />
        </section>

        {/* Value strip */}
        <section className="border-b border-line bg-card">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-4 px-4 py-5 text-center sm:grid-cols-4 lg:px-8">
            {[
              "Free shipping over ₹2,000",
              "Hand-finished, small batch",
              "7-day easy returns",
              "Silk-mark certified silks",
            ].map((line, i) => (
              <p
                key={line}
                className={`font-body text-[12px] uppercase tracking-[0.16em] text-muted-foreground ${
                  i > 0 ? "sm:border-l sm:border-line" : ""
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </section>

        {/* Category arches */}
        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <SectionHead
            eyebrow="The Collection"
            title="Shop by silhouette"
          />
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-8">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="group text-center"
              >
                <div className="arch relative mx-auto aspect-[3/4] w-full overflow-hidden border-2 border-gold/50 bg-sand transition-all duration-500 group-hover:border-gold group-hover:shadow-[0_0_0_1px_rgba(185,138,47,0.28),0_14px_44px_rgba(185,138,47,0.22)]">
                  <img
                    src={`https://images.unsplash.com/${cat.photoId}?auto=format&fit=crop&w=460&q=70`}
                    alt={cat.label}
                    loading="lazy"
                    className="size-full object-cover img-zoom"
                  />
                  <div className="pointer-events-none absolute inset-x-6 inset-y-5 arch border border-gold-soft/50" />
                </div>
                <p className="mt-4 font-display text-2xl text-ink">
                  {cat.label}
                </p>
                <p className="mt-0.5 font-body text-xs text-muted-foreground">
                  {cat.sub}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* New in */}
        <section className="bg-jaali relative bg-sand/60 py-16">
          <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
            <SectionHead
              eyebrow="Just Landed"
              title="New in the atelier"
              link={{ to: "/shop?sort=newest", label: "View all new" }}
            />
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {newItems.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Craft story band */}
        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="relative">
              <div className="gold-glow arch mx-auto aspect-[3/4] w-full max-w-md overflow-hidden border-2 border-gold/60">
                <img
                  src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=640&q=70"
                  alt="Atelier craft"
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>
              <div className="arch pointer-events-none absolute inset-x-8 inset-y-6 mx-auto max-w-md border border-gold-soft/60" />
            </div>
            <div>
              <p className="eyebrow text-gold">Our Craft</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
                Zari in every thread,
                <span className="block italic text-maroon">
                  patience in every seam.
                </span>
              </h2>
              <p className="mt-5 max-w-lg font-body text-base leading-7 text-muted-foreground">
                Every Boutiq piece begins with the fabric — mul cotton from
                Erode, chanderi from Madhya Pradesh, Katan silk from Varanasi.
                We cut small, embroider in-house, and let the handloom's
                irregularities stay: they are the signature of the hand.
              </p>
              <div className="mt-8 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
                {[
                  ["12", "Weaver clusters"],
                  ["48h", "Quality check"],
                  ["100%", "Cotton & silk"],
                ].map(([num, label]) => (
                  <div key={label}>
                    <p className="text-gold-gradient font-display text-4xl font-semibold">
                      {num}
                    </p>
                    <p className="mt-1 font-body text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Most loved */}
        <section className="bg-jaali relative bg-sand/60 py-16">
          <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
            <SectionHead
              eyebrow="Customer Favourites"
              title="Most loved"
              link={{ to: "/shop?sort=rating", label: "View all" }}
            />
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {lovedItems.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA — maroon band with gold */}
        <section className="relative overflow-hidden bg-maroon-deep py-16">
          <div className="bg-jaali-dark absolute inset-0" />
          <div className="relative mx-auto max-w-xl px-4 text-center">
            <p className="eyebrow text-gold-soft">The Boutiq Letter</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-[#faf7f2]">
              First to know, first to wear
            </h2>
            <p className="mt-3 font-body text-sm leading-6 text-[#f0e6d8]/80">
              New drops, fabric stories and private previews — once a fortnight,
              never more.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 border border-gold-soft/40 bg-white/5 px-4 py-3 font-body text-sm text-[#faf7f2] outline-none placeholder:text-[#f0e6d8]/50 focus:border-gold"
              />
              <button className="sheen bg-gold-gradient px-9 py-3 font-body text-sm font-semibold uppercase tracking-[0.18em] text-maroon-deep">
                Subscribe
              </button>
            </div>
            <div className="mt-8">
              <Ornament light />
            </div>
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
