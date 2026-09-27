import { GarmentArt } from "@/components/GarmentArt";
import { cn } from "@/lib/utils";
import { useState } from "react";

/**
 * Product imagery: an Unsplash garment photo with a deterministic inline-SVG
 * garment illustration as fallback. The fallback keeps every card intact when
 * a photo is missing or the network is unavailable.
 */
export function ProductPhoto({
  photoId,
  category,
  alt,
  className,
  width = 600,
}: {
  photoId?: string;
  category: string;
  alt: string;
  className?: string;
  width?: number;
}) {
  const [failed, setFailed] = useState(false);

  // Re-allow the photo when a different image is requested. Adjusting tracked
  // state during render (React-recommended) instead of an effect keeps the
  // fallback logic free of cascading renders.
  const [lastPhotoId, setLastPhotoId] = useState(photoId);
  if (photoId !== lastPhotoId) {
    setLastPhotoId(photoId);
    setFailed(false);
  }

  const src = photoId
    ? `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=70`
    : null;

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
