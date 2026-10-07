import Image from "next/image";
import { site } from "@/data/site";
import { tryResolveImage } from "@/lib/content/images";
import { cn } from "@/lib/utils";

/**
 * Editorial portrait with restrained crop marks.
 * Falls back to a monogram plate if the photo file is missing.
 */
export function Portrait({
  className,
  sizes = "(min-width: 1024px) 30vw, 40vw",
  priority = false,
  caption,
  aspect = "aspect-[4/5]",
}: {
  className?: string;
  sizes?: string;
  priority?: boolean;
  caption?: string;
  aspect?: string;
}) {
  const img = tryResolveImage(site.portrait);
  const initials = site.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <figure className={cn("w-full", className)}>
      <div className={cn("crop-marks", aspect)}>
        <div className="relative size-full overflow-hidden bg-paper-3">
          {img ? (
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover grayscale-[15%] contrast-[1.02]"
              style={{ objectPosition: site.portrait.focus }}
            />
          ) : (
            <div className="drafting-grid flex size-full items-center justify-center" role="img" aria-label={site.name}>
              <span className="font-mono text-2xl tracking-[0.1em] text-ink-3">{initials}</span>
            </div>
          )}
        </div>
      </div>
      {caption && <figcaption className="t-label mt-4">{caption}</figcaption>}
    </figure>
  );
}
