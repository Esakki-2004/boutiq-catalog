import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-4 text-center">
      <p className="eyebrow text-gold">Page not found</p>
      <p className="mt-4 font-display text-6xl font-semibold text-maroon sm:text-7xl">
        404
      </p>
      <p className="mt-4 max-w-sm font-body text-sm leading-6 text-muted-foreground">
        The page you are looking for has been moved, or perhaps it never
        existed — either way, the collection is waiting.
      </p>
      <Link
        to="/shop"
        className="mt-8 inline-block bg-maroon px-8 py-3.5 font-body text-sm font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-maroon-deep"
      >
        Continue shopping
      </Link>
    </div>
  );
}
