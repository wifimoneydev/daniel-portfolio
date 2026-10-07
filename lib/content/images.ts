import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

/**
 * Reads image dimensions from /public at build time so next/image
 * never needs hand-typed width/height and never causes layout shift.
 */

export type ResolvedImage = {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
};

const PUBLIC_DIR = path.join(process.cwd(), "public");
const cache = new Map<string, { width: number; height: number }>();

export function publicFileExists(publicPath: string): boolean {
  if (!publicPath.startsWith("/")) return false;
  const full = path.join(PUBLIC_DIR, decodeURI(publicPath));
  // Guard against paths escaping /public
  if (!full.startsWith(PUBLIC_DIR)) return false;
  return fs.existsSync(full) && fs.statSync(full).isFile();
}

export function getImageDimensions(publicPath: string) {
  const cached = cache.get(publicPath);
  if (cached) return cached;
  const full = path.join(PUBLIC_DIR, decodeURI(publicPath));
  const size = imageSize(fs.readFileSync(full));
  const rotated = size.orientation && size.orientation >= 5;
  const dims = {
    width: (rotated ? size.height : size.width) ?? 1600,
    height: (rotated ? size.width : size.height) ?? 1000,
  };
  cache.set(publicPath, dims);
  return dims;
}

export function resolveImage<T extends { src: string; alt: string; caption?: string }>(
  img: T,
  context: string,
): T & ResolvedImage {
  if (!publicFileExists(img.src)) {
    throw new Error(
      `[content] ${context}: image not found at "public${img.src}". ` +
        `Check the file name (it is case-sensitive) or remove the reference.`,
    );
  }
  return { ...img, ...getImageDimensions(img.src) };
}

/** Like resolveImage, but returns null instead of throwing (used for optional assets like the portrait). */
export function tryResolveImage(img: { src: string; alt: string }): ResolvedImage | null {
  return publicFileExists(img.src) ? { ...img, ...getImageDimensions(img.src) } : null;
}
