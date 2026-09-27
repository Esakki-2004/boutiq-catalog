import { BOUTIQ_CONTACT, buildOrderMessage, waLink } from "@/lib/contact";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.298.347-.497.116-.198.058-.371-.058-.52-.116-.148-.66-1.59-.905-2.178-.237-.57-.48-.494-.66-.503-.174-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

/**
 * The special order buttons for the product page: a gold WhatsApp
 * "Order on WhatsApp" action carrying a pre-filled message (piece, size,
 * colour, price) and an outline "Call to Order" action.
 */
export function OrderButtons({
  name,
  brand,
  price,
  size,
  color,
}: {
  name: string;
  brand: string;
  price: number;
  size?: string | null;
  color?: string | null;
}) {
  const message = buildOrderMessage({ name, brand, price, size, color });

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={waLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Order ${name} on WhatsApp`}
        className="sheen bg-gold-gradient flex flex-1 items-center justify-center gap-2.5 py-4 font-body text-sm font-semibold uppercase tracking-[0.18em] text-maroon-deep shadow-[0_10px_30px_rgba(185,138,47,0.3)] transition-transform hover:-translate-y-0.5"
      >
        <WhatsAppIcon className="size-5" />
        Order on WhatsApp
      </a>
      <a
        href={BOUTIQ_CONTACT.phoneTel}
        aria-label={`Call ${BOUTIQ_CONTACT.phoneDisplay} to order ${name}`}
        className="flex flex-1 items-center justify-center gap-2.5 border border-maroon py-4 font-body text-sm font-medium uppercase tracking-[0.18em] text-maroon transition-colors hover:bg-maroon hover:text-primary-foreground"
      >
        <PhoneIcon className="size-5" />
        Call to Order
      </a>
    </div>
  );
}

/**
 * Floating WhatsApp bubble shown on every storefront page — the
 * always-visible special button for ordering through a message.
 */
export function FloatingWhatsApp() {
  return (
    <a
      href={waLink(
        "Namaste Boutiq! I would like to place an order — please guide me.",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Boutiq on WhatsApp to order"
      className="sheen bg-gold-gradient fixed bottom-5 right-5 z-[70] flex items-center gap-2.5 rounded-full py-3.5 pl-5 pr-6 shadow-[0_12px_36px_rgba(74,28,28,0.35)] transition-transform hover:-translate-y-0.5"
    >
      <WhatsAppIcon className="size-6 text-maroon-deep" />
      <span className="hidden font-body text-sm font-semibold uppercase tracking-[0.14em] text-maroon-deep sm:inline">
        Order on WhatsApp
      </span>
    </a>
  );
}
