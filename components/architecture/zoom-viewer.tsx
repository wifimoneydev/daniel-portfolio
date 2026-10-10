"use client";

import Image from "next/image";
import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

/**
 * Zoomable, pannable image viewer for architectural drawings.
 *
 * Gesture handling is delegated to react-zoom-pan-pinch (touch pinch, drag-pan, trackpad
 * pinch reported as ctrl+wheel, trackpad two-finger panning, bounds). This component adds:
 *  - mouse-wheel zoom at the cursor (the library would otherwise treat every wheel as zoom,
 *    which breaks two-finger trackpad panning);
 *  - Safari's trackpad pinch, which arrives as `gesture*` events instead of ctrl+wheel;
 *  - double-click / double-tap toggling between the fitted view and a close-up.
 *
 * The image is laid out at its full pixel size and scaled down to fit, so zooming in
 * always draws from the original file's pixels — nothing is upscaled or re-encoded.
 */

export type ZoomViewerHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
};

type ViewerImage = { src: string; alt: string; width: number; height: number };

const ZOOM_STEP = 1.5;
const ANIMATION_MS = 200;
const motionMs = (ms: number) =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : ms;
/** Furthest zoom, in image pixels per CSS pixel. 3 = each drawing pixel shown 3× its size. */
const MAX_NATURAL_SCALE = 3;

export function ZoomViewer({
  image,
  onZoomChange,
  handleRef,
}: {
  image: ViewerImage;
  /** Called with the zoom relative to the fitted view (1 = fitted). */
  onZoomChange?: (relative: number) => void;
  /** Exposes zoomIn / zoomOut / reset for external buttons and keyboard shortcuts. */
  handleRef?: Ref<ZoomViewerHandle>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<ReactZoomPanPinchRef | null>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  // Measure the available space; re-fit when it changes (e.g. rotating a phone).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) setBox({ w: Math.round(width), h: Math.round(height) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Fitted scale: the whole drawing visible, never enlarged beyond its own pixels.
  const fit = box ? Math.min(1, box.w / image.width, box.h / image.height) : 1;
  const maxScale = Math.max(MAX_NATURAL_SCALE, fit * 2);
  const clamp = useCallback((s: number) => Math.min(maxScale, Math.max(fit, s)), [fit, maxScale]);

  const zoomAt = useCallback(
    (scale: number, clientX: number, clientY: number, ms = ANIMATION_MS) => {
      apiRef.current?.zoomToPoint(clamp(scale), clientX, clientY, motionMs(ms));
    },
    [clamp],
  );
  const zoomAtCentre = useCallback(
    (factor: number) => {
      const api = apiRef.current;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!api || !rect) return;
      zoomAt(api.instance.state.scale * factor, rect.left + rect.width / 2, rect.top + rect.height / 2);
    },
    [zoomAt],
  );
  const reset = useCallback(() => apiRef.current?.centerView(fit, motionMs(ANIMATION_MS)), [fit]);
  const toggleAt = useCallback(
    (clientX: number, clientY: number) => {
      const scale = apiRef.current?.instance.state.scale ?? fit;
      if (scale > fit * 1.05) reset();
      else zoomAt(fit * 2.5, clientX, clientY);
    },
    [fit, reset, zoomAt],
  );

  useImperativeHandle(handleRef, () => ({ zoomIn: () => zoomAtCentre(ZOOM_STEP), zoomOut: () => zoomAtCentre(1 / ZOOM_STEP), reset }), [
    zoomAtCentre,
    reset,
  ]);

  // Native listeners: wheel and Safari gestures need { passive: false } to preventDefault.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let touches = 0;
    let gestureStartScale = 1;
    let gestureActive = false;
    let tapStart: { x: number; y: number; t: number; multi: boolean } | null = null;
    let lastTap: { x: number; y: number; t: number } | null = null;

    // Mouse wheel → zoom at the cursor. Trackpad scrolls fall through to the library's panning;
    // trackpad pinch (ctrlKey) falls through to the library's zoom.
    const onWheel = (e: WheelEvent) => {
      if (gestureActive) {
        // Safari is already zooming via gesture events; don't let a ctrl+wheel double it.
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.ctrlKey || !isMouseWheel(e)) return;
      e.preventDefault();
      e.stopPropagation();
      const api = apiRef.current;
      if (!api) return;
      const delta = e.deltaY * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 400 : 1);
      zoomAt(api.instance.state.scale * Math.exp(-delta * 0.0015), e.clientX, e.clientY, 80);
    };

    // Safari (macOS) trackpad pinch. On touch devices the library handles the pinch itself,
    // so there we only stop Safari's own page zoom.
    type GestureEvent = UIEvent & { scale: number; clientX: number; clientY: number };
    const onGestureStart = (e: Event) => {
      e.preventDefault();
      gestureActive = touches === 0;
      gestureStartScale = apiRef.current?.instance.state.scale ?? fit;
    };
    const onGestureChange = (e: Event) => {
      e.preventDefault();
      if (touches > 0) return;
      const g = e as GestureEvent;
      zoomAt(gestureStartScale * g.scale, g.clientX, g.clientY, 0);
    };
    const onGestureEnd = (e: Event) => {
      e.preventDefault();
      gestureActive = false;
    };

    // Double-tap detection (the library's own double-tap assumes a fitted scale of 1).
    const onTouchStart = (e: TouchEvent) => {
      touches = e.touches.length;
      const t = e.touches[0];
      if (e.touches.length === 1 && t) tapStart = { x: t.clientX, y: t.clientY, t: Date.now(), multi: false };
      else if (tapStart) tapStart.multi = true;
    };
    const onTouchEnd = (e: TouchEvent) => {
      touches = e.touches.length;
      const t = e.changedTouches[0];
      if (e.touches.length > 0 || !tapStart || tapStart.multi || !t) return;
      const moved = Math.hypot(t.clientX - tapStart.x, t.clientY - tapStart.y) > 10;
      const quick = Date.now() - tapStart.t < 300;
      tapStart = null;
      if (moved || !quick) {
        lastTap = null;
        return;
      }
      const now = Date.now();
      if (lastTap && now - lastTap.t < 300 && Math.hypot(t.clientX - lastTap.x, t.clientY - lastTap.y) < 30) {
        e.preventDefault(); // suppress the emulated dblclick
        lastTap = null;
        toggleAt(t.clientX, t.clientY);
      } else {
        lastTap = { x: t.clientX, y: t.clientY, t: now };
      }
    };
    const onDoubleClick = (e: MouseEvent) => {
      e.preventDefault();
      toggleAt(e.clientX, e.clientY);
    };

    el.addEventListener("wheel", onWheel, { passive: false, capture: true });
    el.addEventListener("gesturestart", onGestureStart, { passive: false });
    el.addEventListener("gesturechange", onGestureChange, { passive: false });
    el.addEventListener("gestureend", onGestureEnd, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: false });
    el.addEventListener("dblclick", onDoubleClick);
    return () => {
      el.removeEventListener("wheel", onWheel, { capture: true });
      el.removeEventListener("gesturestart", onGestureStart);
      el.removeEventListener("gesturechange", onGestureChange);
      el.removeEventListener("gestureend", onGestureEnd);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("dblclick", onDoubleClick);
    };
  }, [fit, toggleAt, zoomAt]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 cursor-grab touch-none select-none overscroll-contain active:cursor-grabbing"
    >
      {box && (
        <TransformWrapper
          key={`${box.w}x${box.h}`}
          ref={apiRef}
          initialScale={fit}
          minScale={fit}
          maxScale={maxScale}
          centerOnInit
          centerZoomedOut
          limitToBounds
          wheel={{ wheelDisabled: true, step: 0.08 }}
          trackPadPanning={{ disabled: false }}
          pinch={{ step: 5 }}
          doubleClick={{ disabled: true }}
          panning={{ velocityDisabled: false }}
          onInit={(r) => onZoomChange?.(r.state.scale / fit)}
          onTransform={(_r, s) => onZoomChange?.(s.scale / fit)}
        >
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: image.width, height: image.height }}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              unoptimized
              priority
              draggable={false}
              className="anim-fade block h-full w-full max-w-none"
            />
          </TransformComponent>
        </TransformWrapper>
      )}
    </div>
  );
}

/**
 * Distinguish a mouse wheel from a trackpad scroll. Trackpads report
 * wheelDeltaY === -3 × deltaY in Chrome and Safari; mice don't. Firefox
 * mice report line units (deltaMode 1).
 */
function isMouseWheel(e: WheelEvent) {
  if (e.deltaMode !== 0) return true;
  const legacy = (e as WheelEvent & { wheelDeltaY?: number }).wheelDeltaY;
  if (typeof legacy === "number" && legacy !== 0) return legacy !== -3 * e.deltaY;
  return false;
}
