const COLUMNS: { title: string; links: string[] }[] = [
  {
    title: "The Atelier",
    links: ["Our Craft", "Fabrics", "Sizing Guide", "Journal"],
  },
  {
    title: "Care",
    links: ["Shipping", "Returns & Exchange", "Fabric Care", "Contact"],
  },
  {
    title: "Connect",
    links: ["Instagram", "Pinterest", "Stockists", "Newsletter"],
  },
];

/**
 * Boutique footer — deep maroon with pale gold links, serif wordmark and a
 * hand-finished sign-off line.
 */
export function StoreFooter() {
  return (
    <footer className="mt-16 bg-maroon-deep text-[#f0e6d8]">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-display text-3xl font-semibold text-[#faf7f2]">
              Boutiq
            </p>
            <p className="mt-3 max-w-xs font-body text-sm leading-6 text-[#f0e6d8]/75">
              A small atelier for Indian women&apos;s wear — cottons, silks and
              chanderi cut in small batches, finished by hand.
            </p>
            <div className="rule-gold mt-6 h-px w-20 opacity-70" />
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-[#e6d3ae]/70">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <span className="cursor-default font-body text-sm text-[#f0e6d8]/80 transition-colors hover:text-[#faf7f2]">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 font-body text-xs text-[#f0e6d8]/60 sm:flex-row lg:px-8">
          <span>© 2024–2026 Boutiq</span>
          <span>Crafted in India, with love</span>
        </div>
      </div>
    </footer>
  );
}
