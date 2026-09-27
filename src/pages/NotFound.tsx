import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <p className="text-7xl font-extrabold italic text-fk-header">404</p>
      <p className="mt-3 text-lg font-semibold text-fk-ink">
        This page has walked off the rack.
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        The link may be broken or the page may have been moved.
      </p>
      <Link to="/shop" className="mt-6">
        <Button className="rounded-sm bg-fk-header px-6 font-semibold hover:bg-fk-header-soft">
          Continue shopping
        </Button>
      </Link>
    </div>
  );
}
