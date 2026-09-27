import { useContact, generalMessage, waLink } from "@/lib/useContact";
import { useLang } from "@/lib/i18n";
import { Link } from "react-router";

/**
 * Noolue footer — deep maroon with gold trim, bilingual labels, live order
 * contact points from shop settings, and the discreet owner link to /admin.
 */
export function StoreFooter() {
  const { lang, t } = useLang();
  const { phoneTel, phoneDisplay, whatsappNumber, deliveryInfo } = useContact();

  const cols: { title: string; links: { label: string; to?: string }[] }[] = [
    {
      title: t("footerCol1"),
      links: [
        { label: t("footerLinks1"), to: "/" },
        { label: t("footerLinks2") },
        { label: t("footerLinks3") },
      ],
    },
    {
      title: t("footerCol2"),
      links: [
        { label: deliveryInfo || t("footerLinks4") },
        { label: t("footerLinks5") },
        { label: t("footerLinks6") },
      ],
    },
    {
      title: t("footerCol3"),
      links: [{ label: t("footerLinks7") }, { label: t("letterEyebrow") }],
    },
  ];

  return (
    <footer className="mt-16 bg-maroon-deep text-[#f0e6d8]">
      <div className="bg-gold-gradient h-1 w-full" />
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-display text-3xl font-semibold text-[#faf7f2]">
              Nool
            </p>
            <p className="mt-3 max-w-xs font-body text-sm leading-6 text-[#f0e6d8]/75">
              {t("footerAbout")}
            </p>
            <div className="mt-6 flex items-center gap-2" aria-hidden="true">
              <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold-soft/80" />
              <svg viewBox="0 0 24 24" className="size-3 fill-gold-soft">
                <path d="M12 1l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z" />
              </svg>
              <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold-soft/80" />
            </div>

            {/* Order contact points */}
            <div className="mt-6 space-y-2.5">
              <a
                href={phoneTel}
                className="flex items-center gap-2.5 font-body text-sm text-[#f0e6d8]/85 transition-colors hover:text-gold-soft"
              >
                <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                {phoneDisplay}
              </a>
              <a
                href={waLink(whatsappNumber, generalMessage(lang))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 font-body text-sm text-[#f0e6d8]/85 transition-colors hover:text-gold-soft"
              >
                <svg viewBox="0 0 24 24" className="size-4 shrink-0 fill-current" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.298.347-.497.116-.198.058-.371-.058-.52-.116-.148-.66-1.59-.905-2.178-.237-.57-.48-.494-.66-.503-.174-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp {phoneDisplay}
              </a>
              <p className="font-body text-xs text-[#f0e6d8]/55">
                {t("footerOrderLine")}
              </p>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-[#e6d3ae]/70">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <a
                        href={link.to}
                        className="font-body text-sm text-[#f0e6d8]/80 transition-colors hover:text-[#faf7f2]"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <span className="cursor-default font-body text-sm text-[#f0e6d8]/80">
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 font-body text-xs text-[#f0e6d8]/60 sm:flex-row lg:px-8">
          <span>© 2024–2026 Nool</span>
          <span>{t("footerCrafted")}</span>
        </div>
      </div>

      {/* Discreet owner entry — no subscription, no customer accounts */}
      <Link
        to="/admin"
        className="block border-t border-white/10 py-3 text-center font-body text-[11px] uppercase tracking-[0.2em] text-[#f0e6d8]/45 transition-colors hover:text-gold-soft"
      >
        {t("footerOwnerLink")}
      </Link>
    </footer>
  );
}
