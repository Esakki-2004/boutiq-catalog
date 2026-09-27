import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ArrowRight } from "lucide-react";
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

function SectionHead({
  eyebrow,
  title,
  link,
}: {
  eyebrow: string;
  title: string;
  link?: { to: string; label: string };
}) {
  return (
    <div className="mb-8 text-center">
      <p className="eyebrow text-gold">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
        {title}
      </h2>
      <div className="rule-gold mx-auto mt-4 h-px w-24" />
      {link && (
        <Link
          to={link.to}
          className="mt-4 inline-flex items-center gap-1.5 font-body text-[13px] font-medium uppercase tracking-[0.18em] text-maroon hover:underline"
        >
          {link.label}
          <ArrowRight className="size-4" />
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
        {/* Hero */}
        <section className="relative overflow-hidden bg-maroon">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #e6d3ae 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div className="text-center lg:text-left">
              <p className="eyebrow text-gold-soft">New Season · Chanderi & Silk</p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] text-[#faf7f2] sm:text-5xl lg:text-6xl">
                Woven slowly,
                <span className="block italic text-gold-soft">
                  worn everyday.
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-md font-body text-base leading-7 text-[#f0e6d8]/85 lg:mx-0">
                Kurtas, sarees and co-ord sets from our atelier — hand-finished
                in small batches, priced honestly, made to be lived in.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link to="/shop">
                  <button className="bg-[#faf7f2] px-8 py-3.5 font-body text-sm font-medium uppercase tracking-[0.18em] text-maroon transition-colors hover:bg-gold-soft">
                    Shop the Collection
                  </button>
                </Link>
                <Link to="/shop?category=sarees">
                  <button className="border border-[#e6d3ae]/40 px-8 py-3.5 font-body text-sm font-medium uppercase tracking-[0.18em] text-[#f0e6d8] transition-colors hover:bg-white/10">
                    The Saree Edit
                  </button>
                </Link>
              </div>
            </div>

            {/* Arch image trio */}
            <div className="flex items-end justify-center gap-4">
              <div className="arch w-1/3 overflow-hidden border border-gold-soft/30 bg-sand">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=420&q=70"
                  alt="Chanderi kurta"
                  className="aspect-[3/4.6] w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="arch w-2/5 overflow-hidden border border-gold-soft/40 shadow-btq">
                <img
                  src="https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=520&q=70"
                  alt="Banarasi saree"
                  className="aspect-[3/4.6] w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="arch w-1/3 overflow-hidden border border-gold-soft/30 bg-sand">
                <img
                  src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=420&q=70"
                  alt="Lounge set"
                  className="aspect-[3/4.6] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Value strip */}
        <section className="border-b border-line bg-card">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-4 px-4 py-5 text-center sm:grid-cols-4 lg:px-8">
            {[
              "Free shipping over ₹2,000",
              "Hand-finished, small batch",
              "7-day easy returns",
              "Silk-mark certified silks",
            ].map((line) => (
              <p
                key={line}
                className="font-body text-[12px] uppercase tracking-[0.16em] text-muted-foreground"
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
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="group text-center"
              >
                <div className="arch mx-auto aspect-[3/4] w-full overflow-hidden border border-line bg-sand">
                  <img
                    src={`https://images.unsplash.com/${cat.photoId}?auto=format&fit=crop&w=460&q=70`}
                    alt={cat.label}
                    loading="lazy"
                    className="size-full object-cover img-zoom"
                  />
                </div>
                <p className="mt-4 font-display text-2xl text-ink">{cat.label}</p>
                <p className="mt-0.5 font-body text-xs text-muted-foreground">
                  {cat.sub}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* New in */}
        <section className="bg-sand/50 py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
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
            <div className="arch mx-auto aspect-[3/4] w-full max-w-md overflow-hidden border border-line">
              <img
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=640&q=70"
                alt="Atelier craft"
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
            <div>
              <p className="eyebrow text-gold">Our Craft</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
                Cut in small batches,
                <span className="block italic text-maroon">
                  finished by hand.
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
                    <p className="font-display text-3xl font-semibold text-maroon">
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
        <section className="bg-sand/50 py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
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

        {/* Newsletter CTA */}
        <section className="border-t border-line bg-card py-16">
          <div className="mx-auto max-w-xl px-4 text-center">
            <p className="eyebrow text-gold">The Boutiq Letter</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink">
              First to know, first to wear
            </h2>
            <p className="mt-3 font-body text-sm leading-6 text-muted-foreground">
              New drops, fabric stories and private previews — once a fortnight,
              never more.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="h-12 flex-1 rounded-none border border-line bg-ivory px-4 font-body text-sm text-ink outline-none placeholder:text-muted-foreground focus:border-maroon"
              />
              <button className="bg-maroon px-8 py-3 font-body text-sm font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-maroon-deep">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
