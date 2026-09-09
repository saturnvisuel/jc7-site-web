"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@/lib/content";

const AUTOPLAY_DELAY = 5000;

export function GalleryCarousel({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = images.length;

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const previous = useCallback(() => goTo(index - 1), [goTo, index]);

  // Défilement automatique, suspendu au survol / focus ou si une seule image.
  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = window.setTimeout(next, AUTOPLAY_DELAY);
    return () => window.clearTimeout(timer);
  }, [next, paused, total, index]);

  if (total === 0) return null;

  const handleTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null) return;

    const delta = event.changedTouches[0].clientX - start;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) next();
    else previous();
  };

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carrousel"
      aria-label="Photos du club"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") next();
        if (event.key === "ArrowLeft") previous();
      }}
      tabIndex={0}
    >
      <div
        className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100 shadow-xl sm:rounded-3xl"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
        }}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, position) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              position === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={position !== index}
          >
            <Image
              src={image.url}
              alt={image.title ?? "Photo du club JC7"}
              fill
              sizes="(max-width: 768px) 100vw, 1024px"
              priority={position === 0}
              className="object-cover"
            />

            {(image.title || image.caption) && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
                {image.title && (
                  <p className="text-base font-bold text-white sm:text-xl">{image.title}</p>
                )}
                {image.caption && (
                  <p className="mt-1 text-sm text-white/90 sm:text-base">{image.caption}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={previous}
            aria-label="Photo précédente"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-900 shadow-lg transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 sm:left-4 sm:p-3"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Photo suivante"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-900 shadow-lg transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 sm:right-4 sm:p-3"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <div className="mt-4 flex justify-center gap-2">
            {images.map((image, position) => (
              <button
                key={image.id}
                type="button"
                onClick={() => goTo(position)}
                aria-label={`Aller à la photo ${position + 1}`}
                aria-current={position === index}
                className={`h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  position === index ? "w-8 bg-red-600" : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
