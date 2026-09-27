/**
 * Boutiq order contact points.
 *
 * Update the numbers here and every call/WhatsApp order button across the
 * storefront updates with them.
 */
export const BOUTIQ_CONTACT = {
  /** How the number is displayed to shoppers */
  phoneDisplay: "+91 98450 12345",
  /** Used for tel: links */
  phoneTel: "tel:+919845012345",
  /** WhatsApp number: country code + number, digits only (no "+") */
  whatsappNumber: "919845012345",
  /** Shown as the reply-time promise */
  whatsappHours: "Mon–Sat · 10am–7pm IST",
} as const;

/** Build a wa.me deep link with a pre-filled message. */
export function waLink(message: string) {
  return `https://wa.me/${BOUTIQ_CONTACT.whatsappNumber}?text=${encodeURIComponent(
    message,
  )}`;
}

/** Compose the order enquiry message for a specific piece. */
export function buildOrderMessage({
  name,
  brand,
  price,
  size,
  color,
  url,
}: {
  name: string;
  brand: string;
  price: number;
  size?: string | null;
  color?: string | null;
  url?: string;
}) {
  const lines = [
    "Namaste Boutiq! I would like to order:",
    `• Piece: ${name} — ${brand}`,
    size ? `• Size: ${size}` : "• Size: will confirm on chat",
    color ? `• Colour: ${color}` : null,
    `• Price: ₹${price.toLocaleString("en-IN")}`,
  ];
  if (url) lines.push("", url);
  return lines.filter((l) => l !== null).join("\n");
}
