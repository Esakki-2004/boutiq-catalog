import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

function BrandLogo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-baseline gap-1">
      <span
        className={`text-2xl font-bold italic tracking-tight ${
          light ? "text-white" : "text-fk-header"
        }`}
      >
        Boutiq
      </span>
      <span
        className={`hidden text-[11px] font-medium leading-none sm:inline ${
          light ? "text-fk-accent" : "text-fk-header/70"
        }`}
      >
        Explore
        <span className="block text-[9px] font-normal opacity-80">
          Plus ✦
        </span>
      </span>
    </span>
  );
}

/**
 * Storefront masthead — Flipkart-style: blue band, white italic logo with
 * yellow "Explore Plus", search input with yellow button, account menu.
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
      <div className="bg-fk-header shadow-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:gap-6 lg:px-6">
          <Link to="/" aria-label="Boutiq home" className="shrink-0">
            <BrandLogo light />
          </Link>

          <form
            onSubmit={submitSearch}
            className="relative hidden flex-1 sm:block"
            role="search"
          >
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, brands and more"
              className="h-9 rounded-sm border-none bg-white pl-3 pr-24 text-sm text-fk-ink shadow-sm placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-0.5 top-1/2 h-7 -translate-y-1/2 bg-fk-accent px-4 text-xs font-semibold text-fk-ink hover:bg-fk-accent/90"
            >
              <Search className="mr-1 size-3.5" />
              Search
            </Button>
          </form>

          <div className="ml-auto flex items-center gap-2 sm:ml-0 sm:gap-5">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 gap-1.5 rounded-sm bg-white px-3 text-sm font-semibold text-fk-header hover:bg-white/90"
                  >
                    <User className="size-4" />
                    <span className="max-w-24 truncate">
                      {user?.name ?? user?.email ?? "Account"}
                    </span>
                    <ChevronDown className="size-3.5 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 rounded-sm">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/shop")}
                  >
                    Shop
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth?returnTo=%2Fshop">
                <Button className="h-8 rounded-sm bg-white px-6 text-sm font-semibold text-fk-header hover:bg-white/90">
                  Login
                </Button>
              </Link>
            )}

            <button
              type="button"
              aria-label="Cart (coming later)"
              className="relative hidden items-center gap-1.5 text-sm font-semibold text-white opacity-90 sm:flex"
              title="Cart arrives in a future version"
            >
              <ShoppingCart className="size-5" />
              Cart
            </button>
          </div>
        </div>
      </div>

      {/* Category bar */}
      <nav className="border-b border-black/5 bg-fk-header-soft">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-2 lg:gap-8 lg:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link to="/shop" className="fk-cat whitespace-nowrap">
            All
          </Link>
          <Link
            to="/shop?category=women"
            className="fk-cat whitespace-nowrap transition-opacity hover:opacity-100"
          >
            Women
          </Link>
          <Link
            to="/shop?category=men"
            className="fk-cat whitespace-nowrap"
          >
            Men
          </Link>
          <Link
            to="/shop?category=kids"
            className="fk-cat whitespace-nowrap"
          >
            Kids
          </Link>
          <span className="fk-cat ml-auto hidden whitespace-nowrap opacity-70 lg:inline">
            Free shipping · 7-day returns
          </span>
        </div>
      </nav>
    </header>
  );
}
