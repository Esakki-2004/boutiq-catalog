import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, User } from "lucide-react";
import { BOUTIQ_CONTACT } from "@/lib/contact";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span
        className={`font-display text-3xl font-semibold tracking-wide ${
          light ? "text-[#faf7f2]" : "text-maroon"
        }`}
      >
        Boutiq
      </span>
      <span className="hidden text-[10px] font-medium uppercase tracking-[0.3em] text-gold sm:inline">
        Est. 2024
      </span>
    </span>
  );
}

/**
 * Boutique masthead — announcement strip, ivory bar with serif wordmark and
 * centered category nav, gold hairline underneath. Quiet, not marketplace-loud.
 */
export function StoreHeader() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Gold announcement strip */}
      <div className="sheen bg-gold-gradient">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-maroon-deep lg:px-8">
          ✦ Complimentary shipping across India ✦
        </p>
      </div>

      <div className="border-b border-line bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
          <Link to="/" aria-label="Boutiq home" className="shrink-0">
            <Wordmark />
          </Link>

          {/* Center nav (desktop) */}
          <nav className="hidden items-center gap-8 md:flex">
            {[
              { to: "/shop", label: "All" },
              { to: "/shop?category=kurtas", label: "Kurtas" },
              { to: "/shop?category=sarees", label: "Sarees" },
              { to: "/shop?category=sets", label: "Sets" },
              { to: "/shop?category=dresses", label: "Dresses" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="group relative font-body text-[13px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-maroon"
              >
                {item.label}
                <span className="bg-gold-gradient absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <form onSubmit={submitSearch} role="search" className="hidden lg:block">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the atelier"
                  className="h-9 w-52 rounded-none border-line bg-ivory pl-8 font-body text-sm text-ink focus-visible:ring-maroon/30"
                />
              </div>
            </form>

            <a
              href={BOUTIQ_CONTACT.phoneTel}
              className="hidden items-center gap-1.5 font-body text-sm text-ink transition-colors hover:text-maroon lg:flex"
              title="Call to order"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              {BOUTIQ_CONTACT.phoneDisplay}
            </a>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 font-body text-sm text-ink transition-colors hover:text-maroon"
                  >
                    <User className="size-5" strokeWidth={1.5} />
                    <span className="hidden max-w-24 truncate sm:inline">
                      {user?.name ?? user?.email ?? "Account"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-40 rounded-none border-line"
                >
                  <DropdownMenuItem
                    className="cursor-pointer font-body text-sm"
                    onClick={() => navigate("/shop")}
                  >
                    Shop
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth?returnTo=%2Fshop">
                <button
                  type="button"
                  className="font-body text-sm text-ink transition-colors hover:text-maroon"
                >
                  Sign in
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
