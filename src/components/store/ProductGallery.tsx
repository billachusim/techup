import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StoreImage } from "@/data/storeProducts";

interface ProductGalleryProps {
  images: StoreImage[];
  className?: string;
}

const ProductGallery = ({ images, className }: ProductGalleryProps) => {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const go = (next: number) => {
    if (images.length < 2) return;
    setIndex(((next % images.length) + images.length) % images.length);
  };

  const onTouchEnd = (endX: number) => {
    if (touchStart === null) return;
    const delta = touchStart - endX;
    if (Math.abs(delta) > 40) go(delta > 0 ? index + 1 : index - 1);
    setTouchStart(null);
  };

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg bg-secondary/30", className)}
      onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
      onTouchEnd={(e) => onTouchEnd(e.changedTouches[0].clientX)}
    >
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((image) => (
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            loading="lazy"
            width={1024}
            height={1024}
            className="h-full w-full shrink-0 object-contain"
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous product image"
            onClick={() => go(index - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-foreground shadow-sm transition hover:bg-background"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Next product image"
            onClick={() => go(index + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-foreground shadow-sm transition hover:bg-background"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((image, i) => (
              <button
                key={image.src}
                type="button"
                aria-label={`Show image ${i + 1}`}
                onClick={() => go(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/50",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductGallery;
