import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "ta";

/**
 * Noolue dictionary. Tamil comes first in the shop owner's local area, so
 * the site defaults to Tamil; English is one tap away.
 */
const DICT = {
  // Header / announcement
  announcement: { en: "✦ Free delivery in your area ✦", ta: "✦ உங்கள் பகுதியில் இலவச டெலிவரி ✦" },
  navAll: { en: "All", ta: "அனைத்தும்" },
  navKurtas: { en: "Kurtas", ta: "குர்தா" },
  navSarees: { en: "Sarees", ta: "சேலை" },
  navSets: { en: "Sets", ta: "இணை அமைப்பு" },
  navDresses: { en: "Dresses", ta: "கவுன்" },
  searchPlaceholder: { en: "Search the shop", ta: "கடையில் தேடுங்கள்" },
  callToOrder: { en: "Call to order", ta: "அழைத்து ஆர்டர் செய்யுங்கள்" },

  // Landing
  heroEyebrow: { en: "New Season · Chanderi & Silk", ta: "புதிய பருவம் · சாந்தேரி & பட்டு" },
  heroTitle1: { en: "Woven slowly,", ta: "மெதுவாக நெய்யப்பட்டது," },
  heroTitle2: { en: "worn like gold.", ta: "பொன்னைப் போல அணியப்படும்." },
  heroBody: {
    en: "Kurtas, sarees and sets from our shop — hand-finished in small batches, trimmed with real zari, made to be lived in.",
    ta: "நம் கடையின் குர்தா, சேலை, இணை அமைப்புகள் — சிறு தொகுப்புகளாக கைவினையால் முடிக்கப்பட்டவை, உண்மையான ஜரி வேலைப்பாடு.",
  },
  heroCta: { en: "Shop the Collection", ta: "சேகரிப்பைப் பாருங்கள்" },
  heroCta2: { en: "The Saree Edit", ta: "சேலை தொகுப்பு" },
  valueFree: { en: "Free local delivery", ta: "இலவச உள்ளூர் டெலிவரி" },
  valueHand: { en: "Hand-finished, small batch", ta: "கைவினை, சிறு தொகுப்பு" },
  valueReturns: { en: "7-day easy returns", ta: "7 நாள் எளிதான மீட்பு" },
  valueSilk: { en: "Genuine silk, certified", ta: "உண்மையான பட்டு, சான்றிதழ்" },
  catEyebrow: { en: "The Collection", ta: "சேகரிப்பு" },
  catTitle: { en: "Shop by silhouette", ta: "வகைப்படி பாருங்கள்" },
  newEyebrow: { en: "Just Landed", ta: "புதிதாக வந்தவை" },
  newTitle: { en: "New in the shop", ta: "கடையில் புதிது" },
  viewAllNew: { en: "View all new", ta: "புதியவற்றைப் பார்க்க" },
  craftEyebrow: { en: "Our Craft", ta: "நம் கைவினை" },
  craftTitle1: { en: "Zari in every thread,", ta: "ஒவ்வொரு நூலிலும் ஜரி," },
  craftTitle2: { en: "patience in every seam.", ta: "ஒவ்வொரு தையலிலும் பொறுமை." },
  craftBody: {
    en: "Every piece begins with the fabric — mul cotton, chanderi and Katan silk sourced from weaver families. We cut small, finish by hand, and let the handloom's irregularities stay: they are the signature of the hand.",
    ta: "ஒவ்வொரு ஆடையும் துணியிலிருந்து தொடங்குகிறது — நெசவாளர் குடும்பங்களிடமிருந்து பருத்தி, சாந்தேரி, கதான் பட்டு. சிறு தொகுப்புகளாக வெட்டி, கையால் முடிக்கிறோம்; கைத்தறியின் தனித்தன்மை அப்படியே இருக்கட்டும்.",
  },
  craftStat1: { en: "Weaver families", ta: "நெசவாளர் குடும்பங்கள்" },
  craftStat2: { en: "Quality check", ta: "தரச் சோதனை" },
  craftStat3: { en: "Cotton & silk", ta: "பருத்தி & பட்டு" },
  lovedEyebrow: { en: "Customer Favourites", ta: "வாடிக்கையாளர் விருப்பம்" },
  lovedTitle: { en: "Most loved", ta: "அதிகம் விரும்பியவை" },
  viewAll: { en: "View all", ta: "அனைத்தையும் பார்க்க" },
  letterEyebrow: { en: "The Nool Letter", ta: "நூல் கடிதம்" },
  letterTitle: { en: "First to know, first to wear", ta: "முதலில் அறிந்து, முதலில் அணியுங்கள்" },
  letterBody: {
    en: "New pieces, fabric stories and private previews — once a fortnight, never more.",
    ta: "புதிய ஆடைகள், துணி கதைகள், தனிப்பட்ட முன்னோட்டம் — இரு வாரத்திற்கு ஒருமுறை மட்டும்.",
  },
  letterPlaceholder: { en: "Your email address", ta: "உங்கள் மின்னஞ்சல் முகவரி" },
  subscribe: { en: "Subscribe", ta: "பதிவு செய்யுங்கள்" },

  // Shop
  shopEyebrow: { en: "Nool Atelier", ta: "நூல் கடை" },
  refine: { en: "Refine", ta: "வடிகட்டு" },
  clearAll: { en: "Clear all", ta: "அனைத்தையும் நீக்கு" },
  categories: { en: "Categories", ta: "வகைகள்" },
  silhouette: { en: "Silhouette", ta: "வடிவம்" },
  price: { en: "Price", ta: "விலை" },
  lovedBy: { en: "Loved by", ta: "விருப்பம்" },
  andUp: { en: "& up", ta: "& மேல்" },
  sort: { en: "Sort", ta: "வரிசைப்படுத்து" },
  sortFeatured: { en: "Featured", ta: "சிறப்பு" },
  sortPriceAsc: { en: "Price — Low to High", ta: "விலை — குறைவு முதல் அதிகம்" },
  sortPriceDesc: { en: "Price — High to Low", ta: "விலை — அதிகம் முதல் குறைவு" },
  sortNewest: { en: "New Arrivals", ta: "புதியவை" },
  sortRating: { en: "Most Loved", ta: "அதிக விருப்பம்" },
  pieces: { en: "pieces", ta: "பொருட்கள்" },
  piece: { en: "piece", ta: "பொருள்" },
  nothingTitle: { en: "Nothing here yet", ta: "இன்னும் எதுவும் இல்லை" },
  nothingBody: {
    en: "Try a different spelling, or clear a filter to see more of the collection.",
    ta: "வேறு எழுத்துக்களுடன் தேடவும், அல்லது வடிகட்டியை நீக்கி மேலும் பாருங்கள்.",
  },
  clearRefinements: { en: "Clear refinements", ta: "வடிகட்டி நீக்கு" },
  showResults: { en: "Show", ta: "காட்டு" },
  priceAll: { en: "All prices", ta: "அனைத்து விலை" },
  priceUnder2500: { en: "Under ₹2,500", ta: "₹2,500-க்கு கீழ்" },
  price2500to4000: { en: "₹2,500 – ₹4,000", ta: "₹2,500 – ₹4,000" },
  price4000to6000: { en: "₹4,000 – ₹6,000", ta: "₹4,000 – ₹6,000" },
  priceOver6000: { en: "Above ₹6,000", ta: "₹6,000-க்கு மேல்" },
  bandUnder2500: { en: "under2500", ta: "under2500" },
  band2500to4000: { en: "2500to4000", ta: "2500to4000" },
  band4000to6000: { en: "4000to6000", ta: "4000to6000" },
  bandOver6000: { en: "over6000", ta: "over6000" },

  // Product card / PDP
  newTag: { en: "New", ta: "புதியது" },
  selectSize: { en: "Size", ta: "அளவு" },
  sizeGuide: { en: "Size guide", ta: "அளவு வழிகாட்டி" },
  colour: { en: "Colour", ta: "நிறம்" },
  orderWhatsApp: { en: "Order on WhatsApp", ta: "வாட்ஸ்அப்பில் ஆர்டர்" },
  callOrder: { en: "Call to Order", ta: "அழைத்து ஆர்டர்" },
  orderNote: {
    en: "To order, message us on WhatsApp or call — we confirm size, fabric and delivery personally. Pick a size and it's added to your message.",
    ta: "ஆர்டர் செய்ய வாட்ஸ்அப்பில் செய்தி அனுப்பவும் அல்லது அழையுங்கள் — அளவு, துணி, டெலிவரி நாமே உறுதிசெய்கிறோம். அளவைத் தேர்ந்தெடுத்தால் செய்தியில் சேர்க்கப்படும்.",
  },
  detailsTitle: { en: "The details", ta: "விவரங்கள்" },
  descLabel: { en: "Description", ta: "விளக்கம்" },
  silLabel: { en: "Silhouette", ta: "வடிவம்" },
  careLabel: { en: "Care", ta: "பராமரிப்பு" },
  careValue: { en: "Dry clean or gentle hand wash", ta: "டிரை க்ளீன் அல்லது மென்மையான கை வெசற்றல்" },
  madeLabel: { en: "Made in", ta: "தயாரிப்பு இடம்" },
  madeValue: { en: "India", ta: "இந்தியா" },
  alsoLoveEyebrow: { en: "Styled with", ta: "இதனுடன்" },
  alsoLoveTitle: { en: "You may also love", ta: "இதையும் விரும்பலாம்" },
  reviews: { en: "reviews", ta: "மதிப்புரைகள்" },
  inclusiveTaxes: { en: "Inclusive of all taxes", ta: "அனைத்து வரிகள் உட்பட" },
  off: { en: "off", ta: "தள்ளுபடி" },
  backToCollection: { en: "Return to the collection", ta: "சேகரிப்புக்குத் திரும்பு" },
  goneTitle: { en: "This piece has found a home.", ta: "இந்த ஆடை ஒரு வீட்டை அடைந்தது." },
  loadingPiece: { en: "Loading piece…", ta: "பொருள் ஏற்றப்படுகிறது…" },

  // Order message
  orderIntro: { en: "Namaste Nool! I would like to order:", ta: "வணக்கம் நூல்! நான் ஆர்டர் செய்ய விரும்புகிறேன்:" },
  orderPiece: { en: "Piece:", ta: "பொருள்:" },
  orderSize: { en: "Size:", ta: "அளவு:" },
  orderSizeChat: { en: "will confirm on chat", ta: "அரட்டையில் உறுதிசெய்வேன்" },
  orderColour: { en: "Colour:", ta: "நிறம்:" },
  orderPrice: { en: "Price:", ta: "விலை:" },
  orderGeneral: {
    en: "Namaste Nool! I would like to place an order — please guide me.",
    ta: "வணக்கம் நூல்! நான் ஆர்டர் செய்ய விரும்புகிறேன் — வழிகாட்டுங்கள்.",
  },

  // 404
  notFoundEyebrow: { en: "Page not found", ta: "பக்கம் கிடைக்கவில்லை" },
  notFoundTitle: { en: "404", ta: "404" },
  notFoundBody: {
    en: "The page you are looking for has been moved, or perhaps it never existed — either way, the collection is waiting.",
    ta: "நீங்கள் தேடும் பக்கம் நகர்த்தப்பட்டது, அல்லது இல்லை — எப்படியும் சேகரிப்பு காத்திருக்கிறது.",
  },
  notFoundCta: { en: "Continue shopping", ta: "ஷாப்பிங் தொடரவும்" },

  // Footer
  footerAbout: {
    en: "A small shop for Indian women's wear — cottons, silks and chanderi cut in small batches, finished by hand.",
    ta: "இந்திய பெண்கள் ஆடைக்கான சிறு கடை — பருத்தி, பட்டு, சாந்தேரி; சிறு தொகுப்புகளாக கையால் முடிக்கப்படுகிறது.",
  },
  footerOrderLine: { en: "To order — call or message", ta: "ஆர்டருக்கு — அழைப்பு அல்லது செய்தி" },
  footerCol1: { en: "The Shop", ta: "நம் கடை" },
  footerCol2: { en: "Care", ta: "பராமரிப்பு" },
  footerCol3: { en: "Connect", ta: "தொடர்பு" },
  footerLinks1: { en: "Our Craft", ta: "நம் கைவினை" },
  footerLinks2: { en: "Fabrics", ta: "துணிகள்" },
  footerLinks3: { en: "Sizing Guide", ta: "அளவு வழிகாட்டி" },
  footerLinks4: { en: "Shipping", ta: "டெலிவரி" },
  footerLinks5: { en: "Returns & Exchange", ta: "மீட்பு & பரிமாற்றம்" },
  footerLinks6: { en: "Fabric Care", ta: "துணி பராமரிப்பு" },
  footerLinks7: { en: "Instagram", ta: "இன்ஸ்டாகிராம்" },
  footerLinks8: { en: "CRAFTED IN", ta: "இந்தியாவில்" },
  footerCrafted: { en: "Crafted in India, with love", ta: "இந்தியாவில் அன்புடன் தயாரிக்கப்பட்டது" },
  footerOwnerLink: { en: "Shop owner? Manage your shop", ta: "கடை உரிமையாளரா? உங்கள் கடையை நிர்வகிக்கவும்" },
} as const;

export type DictKey = keyof typeof DICT;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;
};

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "ta";
    const saved = window.localStorage.getItem("nool-lang");
    return saved === "en" || saved === "ta" ? saved : "ta";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("nool-lang", l);
  };

  useEffect(() => {
    document.documentElement.lang = lang === "ta" ? "ta" : "en";
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (key) => DICT[key][lang],
    }),
    [lang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
