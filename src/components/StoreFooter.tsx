const COLUMNS: { title: string; links: string[] }[] = [
  {
    title: "About",
    links: ["Contact Us", "About Us", "Careers", "Boutiq Stories", "Press"],
  },
  {
    title: "Help",
    links: ["Payments", "Shipping", "Cancellation & Returns", "FAQ"],
  },
  {
    title: "Consumer Policy",
    links: ["Cancellation & Returns", "Terms Of Use", "Security", "Privacy", "Sitemap"],
  },
  {
    title: "Shop",
    links: ["Women", "Men", "Kids", "New Arrivals", "Offers"],
  },
];

/**
 * Storefront footer — Flipkart-style: deep blue band with pale link columns,
 * divider, descriptor row and copyright line.
 */
export function StoreFooter() {
  return (
    <footer className="mt-10 bg-fk-header-soft text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
              {col.title}
            </p>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <span className="cursor-default text-sm text-white/85 transition-colors hover:text-white">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-white/70 sm:flex-row lg:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <span>Become a Seller</span>
            <span>Advertise</span>
            <span>Gift Cards</span>
            <span>Help Center</span>
          </div>
          <span>© 2007–2026 Boutiq.com</span>
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold italic text-fk-accent">B</span>
            <span>Explore Plus</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
