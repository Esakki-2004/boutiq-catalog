import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, User } from "lucide-react";
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
      {/* Announcement strip */}
      <div className="bg-maroon-deep">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center font-body text-[11px] tracking-[0.22em] text-[#e6d3ae] uppercase lg:px-8">
          Complimentary shipping across India
        </p>
      </div>

      <div className="border-b border-line bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
          <Link to="/" aria-label="Boutiq home" className="shrink-0">
            <Wordmark />
          </Link>

          {/* Center nav (desktop) */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/shop"
              className="font-body text-[13px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-maroon"
            >
              All
            </Link>
            <Link
              to="/shop?category=kurtas"
              className="font-body text-[13px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-maroon"
            >
              Kurtas
            </Link>
            <Link
              to="/shop?category=sarees"
              className="font-body text-[13px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-maroon"
            >
              Sarees
            </Link>
            <Link
              to="/shop?category=sets"
              className="font-body text-[13px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-maroon"
            >
              Sets
            </Link>
            <Link
              to="/shop?category=dresses"
              className="font-body text-[13px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-maroon"
            >
              Dresses
            </Link>
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
