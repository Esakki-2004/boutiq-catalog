import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useContact } from "@/lib/useContact";
import { useLang } from "@/lib/i18n";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

function Wordmark() {
  return (
    <span className="font-display text-3xl font-semibold tracking-wide text-maroon">
      Nool
    </span>
  );
}

/**
 * Nool masthead — live announcement strip in the shopper's language,
 * language toggle, category nav, phone link. No sign-in: shoppers simply
 * browse and order by WhatsApp or call.
 */
export function StoreHeader() {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLang();
  const { announcement, phoneTel, phoneDisplay } = useContact();
  const [query, setQuery] = useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  const nav = [
    { to: "/shop", key: "navAll" as const },
    { to: "/shop?category=kurtas", key: "navKurtas" as const },
    { to: "/shop?category=sarees", key: "navSarees" as const },
    { to: "/shop?category=sets", key: "navSets" as const },
    { to: "/shop?category=dresses", key: "navDresses" as const },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement strip — bilingual, from shop settings */}
      <div className="sheen bg-gold-gradient">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-maroon-deep lg:px-8">
          {announcement || (lang === "ta" ? "✦ உங்கள் பகுதியில் இலவச டெலிவரி ✦" : "✦ Free delivery in your area ✦")}
        </p>
      </div>

      <div className="border-b border-line bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
          <Link to="/" aria-label="Nool home" className="shrink-0">
            <Wordmark />
          </Link>

          {/* Center nav (desktop) */}
          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className="group relative font-body text-[13px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-maroon"
              >
                {t(item.key)}
                <span className="bg-gold-gradient absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language toggle */}
            <div className="flex border border-line" role="group" aria-label="Language">
              <button
                type="button"
                onClick={() => setLang("ta")}
                className={`px-2.5 py-1.5 font-body text-xs font-semibold transition-colors ${
                  lang === "ta" ? "bg-maroon text-primary-foreground" : "bg-card text-ink hover:text-maroon"
                }`}
              >
                தமிழ்
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1.5 font-body text-xs font-semibold transition-colors ${
                  lang === "en" ? "bg-maroon text-primary-foreground" : "bg-card text-ink hover:text-maroon"
                }`}
              >
                EN
              </button>
            </div>

            <form onSubmit={submitSearch} role="search" className="hidden lg:block">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="h-9 w-44 rounded-none border-line bg-ivory pl-8 font-body text-sm text-ink focus-visible:ring-maroon/30 xl:w-52"
                />
              </div>
            </form>

            <a
              href={phoneTel}
              className="hidden items-center gap-1.5 font-body text-sm text-ink transition-colors hover:text-maroon xl:flex"
              title={t("callToOrder")}
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              {phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
