/**
 * Inline SVG garment illustrations — the offline-safe fallback for product
 * imagery, drawn in the boutique's hairline style.
 */

type ArtProps = { className?: string };

const STROKE = "#7a2e2e";
const GOLD = "#b98a2f";

function KurtaArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <g fill="none" stroke={STROKE} strokeWidth="2" strokeLinecap="round">
        <path
          d="M40 28 L52 22 L60 32 L68 22 L80 28 L84 50 L76 54 L74 46 L74 116 L46 116 L46 46 L44 54 L36 50 Z"
          fill="#ffffff"
        />
        <path d="M60 32 L60 58" />
        <circle cx="60" cy="40" r="1.4" fill={GOLD} stroke="none" />
        <circle cx="60" cy="50" r="1.4" fill={GOLD} stroke="none" />
        <path d="M46 64 Q60 70 74 64" stroke={GOLD} strokeOpacity="0.7" />
        <path d="M46 72 Q60 78 74 72" stroke={GOLD} strokeOpacity="0.4" />
      </g>
    </svg>
  );
}

function SareeArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <g fill="none" stroke={STROKE} strokeWidth="2" strokeLinecap="round">
        <path
          d="M46 24 L60 34 L74 24 L82 56 L72 60 L78 120 L42 120 L48 60 L38 56 Z"
          fill="#ffffff"
        />
        <path d="M42 108 Q60 116 78 108" stroke={GOLD} strokeWidth="2.5" />
        <path d="M42 114 Q60 122 78 114" stroke={GOLD} strokeOpacity="0.6" />
        <path d="M52 26 L60 42 L68 26" stroke={GOLD} strokeOpacity="0.7" />
      </g>
    </svg>
  );
}

function SetArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <g fill="none" stroke={STROKE} strokeWidth="2" strokeLinecap="round">
        <path
          d="M42 26 L52 20 L60 30 L68 20 L78 26 L82 46 L74 50 L72 42 L72 66 L48 66 L48 42 L46 50 L38 46 Z"
          fill="#ffffff"
        />
        <path d="M50 66 L46 116 M70 66 L74 116" />
        <path d="M46 116 L74 116" />
        <path d="M60 30 L60 46" strokeOpacity="0.6" />
        <path d="M40 122 Q60 128 80 122" stroke={GOLD} strokeOpacity="0.6" />
      </g>
    </svg>
  );
}

function DressArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <g fill="none" stroke={STROKE} strokeWidth="2" strokeLinecap="round">
        <path
          d="M48 24 L60 34 L72 24 L74 44 L68 50 L80 118 L40 118 L52 50 L46 44 Z"
          fill="#ffffff"
        />
        <path d="M48 24 L46 34 M72 24 L74 34" />
        <path d="M52 54 Q60 60 68 54" stroke={GOLD} strokeOpacity="0.7" />
        <path d="M44 100 Q60 108 76 100" stroke={GOLD} strokeOpacity="0.5" />
      </g>
    </svg>
  );
}

const MAP: Record<string, (props: ArtProps) => React.JSX.Element> = {
  Kurtas: KurtaArt,
  Sarees: SareeArt,
  Sets: SetArt,
  Dresses: DressArt,
};

/** Deterministic garment art for a category. */
export function GarmentArt({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const Art = MAP[category] ?? KurtaArt;
  return <Art className={className} />;
}
