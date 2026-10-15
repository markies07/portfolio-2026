"use client";

import { useEffect, useState } from "react";

// Hysteresis so the glass doesn't flicker while content straddles the line
// (sRGB luma; black and white text have equal contrast at about 0.46)
const TO_LIGHT = 0.5;
const TO_DARK = 0.4;
const GRID = 32;

// Per-image brightness grid, keyed by the URL actually loaded
const imageGrids = new Map();

function luma(r, g, b) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function parseColor(value) {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
  const [r, g, b, a = 1] = parts;
  return { lum: luma(r, g, b), alpha: a };
}

function imageGrid(img) {
  const key = img.currentSrc || img.src;
  if (imageGrids.has(key)) return imageGrids.get(key);

  let grid = null;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = GRID;
    canvas.height = GRID;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, GRID, GRID);
    const { data } = ctx.getImageData(0, 0, GRID, GRID);
    grid = new Float32Array(GRID * GRID);
    for (let i = 0; i < grid.length; i++) {
      grid[i] = luma(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
    }
  } catch {
    // Cross-origin images taint the canvas — treat them as unknown
  }
  imageGrids.set(key, grid);
  return grid;
}

function percent(value) {
  if (value === "left" || value === "top") return 0;
  if (value === "right" || value === "bottom") return 1;
  return value?.endsWith("%") ? parseFloat(value) / 100 : 0.5;
}

/** Brightness of an <img> at a screen point, honouring object-fit: cover. */
function imageLumaAt(img, x, y) {
  if (!img.complete || !img.naturalWidth) return null;
  const grid = imageGrid(img);
  if (!grid) return null;

  const rect = img.getBoundingClientRect();
  let u = (x - rect.left) / rect.width;
  let v = (y - rect.top) / rect.height;

  const style = getComputedStyle(img);
  if (style.objectFit === "cover") {
    const [posX, posY] = style.objectPosition.split(" ");
    const imageRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = rect.width / rect.height;
    if (imageRatio > boxRatio) {
      const visible = boxRatio / imageRatio;
      u = percent(posX) * (1 - visible) + u * visible;
    } else {
      const visible = imageRatio / boxRatio;
      v = percent(posY) * (1 - visible) + v * visible;
    }
  }

  // Average a small neighbourhood — a single cell is too noisy
  const gx = Math.round(Math.min(Math.max(u, 0), 1) * (GRID - 1));
  const gy = Math.round(Math.min(Math.max(v, 0), 1) * (GRID - 1));
  let sum = 0;
  let count = 0;
  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      const cx = gx + i;
      const cy = gy + j;
      if (cx < 0 || cy < 0 || cx >= GRID || cy >= GRID) continue;
      sum += grid[cy * GRID + cx];
      count++;
    }
  }
  return sum / count;
}

/**
 * Per-pass style lookups. Many sample points hit the same ancestors, so
 * each element is read once; opacity is multiplied down the tree so
 * content that is faded out (e.g. waiting to scroll-reveal) counts as
 * invisible.
 */
function createStyleCache() {
  const cache = new Map();
  const read = (el) => {
    let entry = cache.get(el);
    if (!entry) {
      const style = getComputedStyle(el);
      const parent = el.parentElement;
      entry = {
        bg: parseColor(style.backgroundColor),
        opacity: parseFloat(style.opacity) * (parent ? read(parent).opacity : 1),
      };
      cache.set(el, entry);
    }
    return entry;
  };
  return read;
}

/**
 * Brightness of what is painted under a point, composited front to back
 * through translucent layers until something opaque is reached.
 */
function lumaAt(x, y, ignore, styles) {
  let lum = 0;
  let remaining = 1;

  for (const el of document.elementsFromPoint(x, y)) {
    if (ignore.contains(el)) continue;
    const { bg, opacity } = styles(el);
    if (opacity < 0.02) continue;

    let value = null;
    let alpha = 0;
    if (el.tagName === "IMG") {
      value = imageLumaAt(el, x, y);
      alpha = value == null ? 0 : opacity;
    } else if (bg && bg.alpha > 0) {
      value = bg.lum;
      alpha = bg.alpha * opacity;
    }

    if (alpha > 0) {
      lum += remaining * alpha * value;
      remaining *= 1 - alpha;
      if (remaining < 0.04) break;
    }
  }

  // Whatever is left shows the page background (dark ink)
  return lum + remaining * 0.04;
}

function decide(current, value) {
  if (current === "light") return value < TO_DARK ? "dark" : "light";
  return value > TO_LIGHT ? "light" : "dark";
}

/** Mean brightness under a box, sampled across its middle. */
function lumaUnder(rect, ignore, styles) {
  const y = rect.top + rect.height / 2;
  let sum = 0;
  for (const fx of [0.2, 0.5, 0.8]) {
    sum += lumaAt(rect.left + rect.width * fx, y, ignore, styles);
  }
  return sum / 3;
}

/**
 * Watches the content behind the glass at `ref` so it can adapt the way
 * iOS Liquid Glass does. Returns the tone for the glass as a whole (drives
 * the tint), and writes `data-tone` onto every `[data-glass-sample]`
 * element inside it, so each icon picks the colour that reads best over
 * whatever is directly behind *it* — a bar half over a white screenshot
 * keeps both halves legible. Attributes are set directly rather than via
 * state so scrolling never re-renders the nav.
 */
export function useBackdropTone(ref) {
  const [tone, setTone] = useState("dark");

  useEffect(() => {
    let frame = 0;
    let current = "dark";

    const sample = () => {
      frame = 0;
      const el = ref.current;
      if (!el || !el.getBoundingClientRect().width) return;

      let total = 0;
      const styles = createStyleCache();
      const targets = el.querySelectorAll("[data-glass-sample]");
      targets.forEach((target) => {
        const value = lumaUnder(target.getBoundingClientRect(), el, styles);
        total += value;
        const next = decide(target.dataset.tone || "dark", value);
        if (target.dataset.tone !== next) target.dataset.tone = next;
      });

      const next = decide(current, targets.length ? total / targets.length : 0);
      if (next !== current) {
        current = next;
        setTone(next);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sample);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Catches content that changes without scrolling (carousels, image loads)
    const interval = setInterval(schedule, 400);
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      clearInterval(interval);
      cancelAnimationFrame(frame);
    };
  }, [ref]);

  return tone;
}
