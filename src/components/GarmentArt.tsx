/**
 * Inline SVG garment illustrations — the offline-safe fallback for product
 * imagery. Each returns an <svg> that fills its parent box.
 */

type ArtProps = { className?: string };

const CAT = "#2874f0";
const INK = "#212121";

function KurtaArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <g fill="none" stroke={CAT} strokeWidth="3" strokeLinecap="round">
        <path d="M38 30 L48 22 L60 32 L72 22 L82 30 L86 52 L78 56 L76 46 L76 118 L44 118 L44 46 L42 56 L34 52 Z" fill="#ffffff" />
        <path d="M60 32 L60 60" />
        <path d="M52 34 L60 44 L68 34" />
        <path d="M44 62 L76 62 M44 70 L76 70" strokeOpacity="0.35" />
        <path d="M44 118 L44 126 M76 118 L76 126" />
      </g>
    </svg>
  );
}

function DressArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <g fill="none" stroke={CAT} strokeWidth="3" strokeLinecap="round">
        <path d="M46 24 L60 34 L74 24 L76 44 L70 50 L84 122 L36 122 L50 50 L44 44 Z" fill="#ffffff" />
        <path d="M46 24 L44 34 M74 24 L76 34" />
        <path d="M52 52 Q60 58 68 52" strokeOpacity="0.4" />
      </g>
    </svg>
  );
}

function TeeArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <g fill="none" stroke={CAT} strokeWidth="3" strokeLinecap="round">
        <path d="M40 28 L52 22 L60 30 L68 22 L80 28 L94 40 L84 52 L78 46 L78 112 L42 112 L42 46 L36 52 L26 40 Z" fill="#ffffff" />
        <circle cx="60" cy="62" r="12" strokeOpacity="0.45" />
        <path d="M54 62 L60 68 L66 56" strokeOpacity="0.45" />
      </g>
    </svg>
  );
}

function JeansArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <g fill="none" stroke={CAT} strokeWidth="3" strokeLinecap="round">
        <path d="M42 26 L78 26 L82 44 L76 122 L64 122 L60 64 L56 122 L44 122 L38 44 Z" fill="#ffffff" />
        <path d="M42 40 L78 40" strokeOpacity="0.4" />
        <path d="M58 40 L54 46 M62 40 L66 46" strokeOpacity="0.5" />
      </g>
    </svg>
  );
}

function SareeArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <g fill="none" stroke={CAT} strokeWidth="3" strokeLinecap="round">
        <path d="M44 26 L60 36 L76 26 L84 58 L74 62 L80 122 L40 122 L46 62 L36 58 Z" fill="#ffffff" />
        <path d="M40 108 Q60 116 80 108" strokeOpacity="0.5" />
        <path d="M40 114 Q60 122 80 114" strokeOpacity="0.5" />
        <path d="M52 26 L60 44 L68 26" strokeOpacity="0.4" />
      </g>
    </svg>
  );
}

function SherwaniArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <g fill="none" stroke={CAT} strokeWidth="3" strokeLinecap="round">
        <path d="M38 30 L50 22 L60 34 L70 22 L82 30 L88 54 L80 58 L78 48 L78 118 L42 118 L42 48 L40 58 L32 54 Z" fill="#ffffff" />
        <path d="M60 34 L60 118" strokeOpacity="0.6" />
        <circle cx="60" cy="52" r="1.6" fill={INK} />
        <circle cx="60" cy="66" r="1.6" fill={INK} />
        <circle cx="60" cy="80" r="1.6" fill={INK} />
        <path d="M42 96 L78 96" strokeOpacity="0.3" />
      </g>
    </svg>
  );
}

const MAP: Record<string, (props: ArtProps) => React.JSX.Element> = {
  Kurta: KurtaArt,
  Dresses: DressArt,
  "T-Shirts": TeeArt,
  Jeans: JeansArt,
  Bottomwear: JeansArt,
  Sarees: SareeArt,
  Shirts: SherwaniArt,
  Trousers: JeansArt,
  "Kurta Sets": SherwaniArt,
  Jackets: SherwaniArt,
  Dungarees: SherwaniArt,
  Frocks: DressArt,
  Shorts: TeeArt,
};

/** Deterministic garment art for a subcategory. */
export function GarmentArt({
  subcategory,
  className,
}: {
  subcategory: string;
  className?: string;
}) {
  const Art = MAP[subcategory] ?? KurtaArt;
  return <Art className={className} />;
}
