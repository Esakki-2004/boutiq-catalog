import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useLang, type Lang } from "@/lib/i18n";

/**
 * Live shop contact + delivery settings, with safe fallbacks for first load.
 * The owner edits the underlying values at /admin.
 */
export function useContact() {
  const settings = useQuery(api.settings.get, {});
  const { lang } = useLang();

  const whatsappNumber = settings?.whatsappNumber || "919845012345";
  const phoneDisplay = settings?.phoneDisplay || "+91 98450 12345";
  const phoneTel = `tel:${phoneDisplay.replace(/[^+\d]/g, "")}`;

  const announcement =
    (lang === "ta" ? settings?.announcementTa : settings?.announcementEn) ??
    "";
  const deliveryInfo =
    (lang === "ta" ? settings?.deliveryInfoTa : settings?.deliveryInfoEn) ?? "";
  const freeDeliveryAbove = settings?.freeDeliveryAbove ?? 2000;

  return {
    settings,
    whatsappNumber,
    phoneDisplay,
    phoneTel,
    announcement,
    deliveryInfo,
    freeDeliveryAbove,
  };
}

/** Build a wa.me deep link with a pre-filled message. */
export function waLink(whatsappNumber: string, message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

const MSG = {
  intro: {
    en: "Namaste Boutiq! I would like to order:",
    ta: "வணக்கம் பூட்டிக்! நான் ஆர்டர் செய்ய விரும்புகிறேன்:",
  },
  piece: { en: "Piece", ta: "பொருள்" },
  size: { en: "Size", ta: "அளவு" },
  sizeChat: { en: "will confirm on chat", ta: "அரட்டையில் உறுதிசெய்வேன்" },
  colour: { en: "Colour", ta: "நிறம்" },
  price: { en: "Price", ta: "விலை" },
  general: {
    en: "Namaste Boutiq! I would like to place an order — please guide me.",
    ta: "வணக்கம் பூட்டிக்! நான் ஆர்டர் செய்ய விரும்புகிறேன் — வழிகாட்டுங்கள்.",
  },
} as const;

function pick(l: Lang, pair: { en: string; ta: string }) {
  return l === "ta" ? pair.ta : pair.en;
}

/** Compose the order enquiry message for a specific piece, in the shopper's language. */
export function buildOrderMessage(
  lang: Lang,
  opts: {
    name: string;
    nameTa?: string;
    brand: string;
    price: number;
    size?: string | null;
    color?: string | null;
  },
) {
  const title =
    lang === "ta" && opts.nameTa ? `${opts.nameTa} — ${opts.brand}` : `${opts.name} — ${opts.brand}`;
  const lines = [
    pick(lang, MSG.intro),
    `${pick(lang, MSG.piece)}: ${title}`,
    `${pick(lang, MSG.size)}: ${opts.size || pick(lang, MSG.sizeChat)}`,
    opts.color ? `${pick(lang, MSG.colour)}: ${opts.color}` : null,
    `${pick(lang, MSG.price)}: ₹${opts.price.toLocaleString("en-IN")}`,
  ];
  return lines.filter((l): l is string => l !== null).join("\n");
}

/** General enquiry message (floating button, footer). */
export function generalMessage(lang: Lang) {
  return pick(lang, MSG.general);
}
