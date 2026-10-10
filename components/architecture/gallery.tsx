"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, X } from "lucide-react";
import type { ZoomViewerHandle } from "./zoom-viewer";
import type { GalleryImage } from "@/lib/content/loader";
import { pad } from "@/lib/utils";

const KIND_LABEL: Record<GalleryImage["kind"], string> = {
  render: "Renders",
  plan: "Plans",
  section: "Sections",
  elevation: "Elevations",
  drawing: "Drawings",
  diagram: "Diagrams",
  model: "Models",
  photo: "Photographs",
  screenshot: "Screenshots",
};
// Loaded on first open, so pages without an open viewer don't ship the zoom library.
const ZoomViewer = dynamic(() => import("./zoom-viewer").then((m) => m.ZoomViewer), { ssr: false });

const KIND_ORDER: GalleryImage["kind"][] = ["render", "plan", "section", "elevation", "drawing", "diagram", "model", "photo", "screenshot"];

/**
 * Image-led gallery grouped by drawing type, with an accessible zoomable viewer
 * (native <dialog>: focus trap + Esc; ←/→ move between figures; +/−/0 zoom and reset).
 */
export function Gallery({ images, figureOffset = 1 }: { images: GalleryImage[]; figureOffset?: number }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const viewerRef = useRef<ZoomViewerHandle | null>(null);

  // Stable, grouped order; figure numbers follow this order.
  const ordered = KIND_ORDER.flatMap((k) => images.filter((i) => i.kind === k));
  const groups = KIND_ORDER.map((k) => ({ kind: k, items: ordered.filter((i) => i.kind === k) })).filter((g) => g.items.length);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const total = images.length;
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + total) % total)), [total]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return; // leave browser shortcuts (e.g. ⌘+ page zoom) alone
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "+" || e.key === "=") viewerRef.current?.zoomIn();
      else if (e.key === "-" || e.key === "_") viewerRef.current?.zoomOut();
      else if (e.key === "0") viewerRef.current?.reset();
      else return;
      e.preventDefault();
    };
    const onClose = () => setIndex(null);
    dlg.addEventListener("keydown", onKey);
    dlg.addEventListener("close", onClose);
    return () => {
      dlg.removeEventListener("keydown", onKey);
      dlg.removeEventListener("close", onClose);
    };
  }, [step]);

  if (!ordered.length) return null;
  const currentImg = index !== null ? ordered[index] : undefined;

  return (
    <div className="space-y-16">
      {groups.map((g) => (
        <section key={g.kind} aria-label={KIND_LABEL[g.kind]}>
          <p className="t-label mb-5 border-t border-rule pt-4">{KIND_LABEL[g.kind]}</p>
          <ul className={g.items.length === 1 ? "grid" : "grid gap-6 md:grid-cols-2 md:gap-8"}>
            {g.items.map((img) => {
              const i = ordered.indexOf(img);
              const wide = g.items.length > 1 && img.width / img.height > 1.9;
              return (
                <li key={img.src} className={wide ? "md:col-span-2" : undefined}>
                  <figure>
                    <button
                      type="button"
                      onClick={() => open(i)}
                      className="group block w-full cursor-zoom-in overflow-hidden bg-paper-2"
                      aria-label={`Enlarge figure ${pad(i + figureOffset)}: ${img.alt}`}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={img.width}
                        height={img.height}
                        sizes={g.items.length === 1 || wide ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                        className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                      />
                    </button>
                    <figcaption className="t-label mt-3">
                      <span className="text-ink-2">Fig. {pad(i + figureOffset)}</span>
                      {img.caption && <> — {img.caption}</>}
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <dialog
        ref={dialogRef}
        aria-label="Image viewer"
        className="lightbox m-0 h-dvh max-h-none w-full max-w-none overscroll-contain bg-[#0f0f0e] p-0 text-[#ebe8e1] backdrop:bg-black/80"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {currentImg && index !== null && (
          <div className="flex h-full flex-col">
            <div className="flex h-14 shrink-0 items-center justify-between px-4 sm:px-6">
              <p className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-[#a9a59c]" aria-live="polite">
                Fig. {pad(index + figureOffset)} · {index + 1} / {ordered.length}
              </p>
              <button type="button" autoFocus onClick={close} className="inline-flex h-10 items-center gap-2 rounded-[3px] px-2 text-sm hover:bg-white/10">
                <X aria-hidden className="size-5" /> Close
              </button>
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden">
              {/* Keyed by image: switching drawings resets zoom and pan. */}
              <ZoomViewer key={currentImg.src} image={currentImg} handleRef={viewerRef} onZoomChange={setZoom} />
              {ordered.length > 1 && (
                <>
                  <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="absolute left-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 sm:left-4">
                    <ChevronLeft aria-hidden className="size-5" />
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label="Next image" className="absolute right-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 sm:right-4">
                    <ChevronRight aria-hidden className="size-5" />
                  </button>
                </>
              )}
            </div>
            <div className="flex shrink-0 flex-col items-center gap-3 px-4 pb-4 pt-3 sm:px-6">
              <div role="group" aria-label="Zoom" className="flex items-center rounded-full border border-white/15 bg-white/5">
                <button type="button" onClick={() => viewerRef.current?.zoomOut()} aria-label="Zoom out" className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white/10">
                  <Minus aria-hidden className="size-4" />
                </button>
                <span className="w-14 text-center font-mono text-[0.75rem] tabular-nums text-[#bcb8ae]">
                  {Math.round(zoom * 100)}%
                </span>
                <button type="button" onClick={() => viewerRef.current?.zoomIn()} aria-label="Zoom in" className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white/10">
                  <Plus aria-hidden className="size-4" />
                </button>
                <span aria-hidden className="h-5 w-px bg-white/15" />
                <button type="button" onClick={() => viewerRef.current?.reset()} aria-label="Reset zoom" className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-40" disabled={zoom <= 1.001}>
                  <RotateCcw aria-hidden className="size-4" />
                </button>
              </div>
              <p className="text-center text-sm text-[#bcb8ae]">{currentImg.caption ?? currentImg.alt}</p>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
