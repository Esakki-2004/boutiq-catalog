import { GarmentArt } from "@/components/GarmentArt";
import { cn } from "@/lib/utils";
import { useState } from "react";

/**
 * Product imagery resolution order:
 *   1. photoUrl — any image link the shop owner pasted in /admin
 *   2. photoId  — curated Unsplash photo from the seed catalogue
 *   3. inline SVG garment illustration — offline-safe fallback
 */
export function ProductPhoto({
  photoId,
  photoUrl,
  category,
  alt,
  className,
  width = 600,
}: {
  photoId?: string;
  photoUrl?: string;
  category: string;
  alt: string;
  className?: string;
  width?: number;
}) {
  const [failed, setFailed] = useState(false);

  const key = photoUrl ?? photoId ?? "none";
  // Re-allow the photo when a different image is requested; adjusting tracked
  // state during render avoids the cascading render an effect would cause.
  const [lastKey, setLastKey] = useState(key);
  if (key !== lastKey) {
    setLastKey(key);
    setFailed(false);
  }

  const src =
    photoUrl ??
    (photoId
      ? `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=70`
      : null);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-sand",
          className,
        )}
      >
        <GarmentArt category={category} className="h-2/3 w-2/3" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
