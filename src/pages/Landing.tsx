import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { FloatingWhatsApp } from "@/components/OrderButtons";
import { api } from "@/convex/_generated/api";
import { useContact } from "@/lib/useContact";
import { useLang } from "@/lib/i18n";
import { useQuery } from "convex/react";
import { Link } from "react-router";

const CATEGORIES = [
  {
    id: "kurtas",
    labelKey: "navKurtas",
    photoId: "photo-1583394838336-acd977736f90",
    subKey: "valueSilk",
  },
  {
    id: "sarees",
    labelKey: "navSarees",
    photoId: "photo-1583496661160-fb5886a0aaaa",
    subKey: "valueHand",
  },
  {
    id: "sets",
    labelKey: "navSets",
    photoId: "photo-1572804013309-59a88b7e92f1",
    subKey: "valueFree",
  },
  {
    id: "dresses",
    labelKey: "navDresses",
    photoId: "photo-1509631179647-0177331693ae",
    subKey: "valueReturns",
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
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  link?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-10 text-center">
      <p className="eyebrow text-gold">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
        {title}
      </h2>
      <div className="mt-4">
        <Ornament />
      </div>
      {link && linkLabel && (
        <Link
          to={link}
          className="mt-4 inline-flex items-center gap-1.5 font-body text-[13px] font-medium uppercase tracking-[0.18em] text-maroon hover:underline"
        >
          {linkLabel}
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}

export default function Landing() {
  const { t } = useLang();
  const { deliveryInfo } = useContact();
  const newest = useQuery(api.products.list, { sort: "newest" });
  const loved = useQuery(api.products.list, { sort: "rating" });

  const newItems = newest?.items.slice(0, 4) ?? [];
  const lovedItems = loved?.items.slice(0, 4) ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <StoreHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-maroon-deep">
          <div className="bg-jaali-dark absolute inset-0" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div className="text-center lg:text-left">
              <p className="eyebrow bg-gold-gradient bg-clip-text text-transparent">
                {t("heroEyebrow")}
              </p>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.12] text-[#faf7f2] sm:text-5xl lg:text-6xl">
                {t("heroTitle1")}
                <span className="text-gold-gradient block italic">
                  {t("heroTitle2")}
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-md font-body text-base leading-7 text-[#f0e6d8]/85 lg:mx-0">
                {t("heroBody")}
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Link to="/shop">
                  <button className="sheen bg-gold-gradient px-9 py-4 font-body text-sm font-semibold uppercase tracking-[0.18em] text-maroon-deep shadow-[0_10px_30px_rgba(185,138,47,0.35)] transition-transform hover:-translate-y-0.5">
                    {t("heroCta")}
                  </button>
                </Link>
                <Link to="/shop?category=sarees">
                  <button className="border border-gold-soft/50 px-9 py-4 font-body text-sm font-medium uppercase tracking-[0.18em] text-gold-soft transition-colors hover:bg-gold-soft/10">
                    {t("heroCta2")}
                  </button>
                </Link>
              </div>
              <div className="mt-10 lg:mt-12">
                <Ornament light />
              </div>
            </div>

            {/* Arch image trio */}
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
          <div className="bg-gold-gradient relative h-1.5" />
        </section>

        {/* Value strip — delivery info from shop settings */}
        <section className="border-b border-line bg-card">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-4 px-4 py-5 text-center sm:grid-cols-4 lg:px-8">
            {[
              deliveryInfo || t("valueFree"),
              t("valueHand"),
              t("valueReturns"),
              t("valueSilk"),
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
          <SectionHead eyebrow={t("catEyebrow")} title={t("catTitle")} />
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
                    alt={t(cat.labelKey)}
                    loading="lazy"
                    className="size-full object-cover img-zoom"
                  />
                  <div className="arch pointer-events-none absolute inset-x-6 inset-y-5 border border-gold-soft/50" />
                </div>
                <p className="mt-4 font-display text-2xl text-ink">
                  {t(cat.labelKey)}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* New in */}
        <section className="bg-jaali relative bg-sand/60 py-16">
          <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
            <SectionHead
              eyebrow={t("newEyebrow")}
              title={t("newTitle")}
              link="/shop?sort=newest"
              linkLabel={t("viewAllNew")}
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
              <p className="eyebrow text-gold">{t("craftEyebrow")}</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
                {t("craftTitle1")}
                <span className="block italic text-maroon">{t("craftTitle2")}</span>
              </h2>
              <p className="mt-5 max-w-lg font-body text-base leading-7 text-muted-foreground">
                {t("craftBody")}
              </p>
              <div className="mt-8 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
                {[
                  ["12", t("craftStat1")],
                  ["48h", t("craftStat2")],
                  ["100%", t("craftStat3")],
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
              eyebrow={t("lovedEyebrow")}
              title={t("lovedTitle")}
              link="/shop?sort=rating"
              linkLabel={t("viewAll")}
            />
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {lovedItems.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <StoreFooter />
      <FloatingWhatsApp />
    </div>
  );
}
