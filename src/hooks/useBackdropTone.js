"use client";

import { useEffect, useState } from "react";

// Hysteresis so the glass doesn't flicker while content straddles the line
// (sRGB luma; black and white text have equal contrast at about 0.46)
const TO_LIGHT = 0.5;
const TO_DARK = 0.4;
const GRID = 32;
// Once scrolling has been still this long, one exact pass corrects the
// fast estimate used while it moves
const SETTLE_MS = 160;
// Height of the page bands the fast-pass index is bucketed into
const BUCKET = 256;
// Elements indexed per idle slice, at minimum
const MIN_BATCH = 40;

// Per-image brightness grid, keyed by the URL actually loaded
const imageGrids = new Map();
const pendingGrids = new Set();

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

function gridFrom(source) {
  const canvas = document.createElement("canvas");
  canvas.width = GRID;
  canvas.height = GRID;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(source, 0, 0, GRID, GRID);
  const { data } = ctx.getImageData(0, 0, GRID, GRID);
  const grid = new Float32Array(GRID * GRID);
  for (let i = 0; i < grid.length; i++) grid[i] = luma(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
  return grid;
}

/**
 * A 32px-wide copy of an optimised (next/image) image: the brightness grid
 * only needs a thumbnail, and decoding that is nearly free, where decoding
 * the full-size image to read it cost a visible hitch on slow phones.
 */
function thumbnailUrl(img) {
  try {
    const url = new URL(img.currentSrc || img.src, location.href);
    if (url.pathname !== "/_next/image") return null;
    url.searchParams.set("w", "32");
    return url.href;
  } catch {
    return null;
  }
}

/**
 * The image's brightness grid, or null while it's still being built
 * (asynchronously, from a thumbnail). `onReady` fires once it exists.
 */
function imageGrid(img, onReady) {
  const key = img.currentSrc || img.src;
  if (imageGrids.has(key)) return imageGrids.get(key);
  if (pendingGrids.has(key)) return null;
  pendingGrids.add(key);

  const thumb = thumbnailUrl(img);
  const source = thumb
    ? Object.assign(new Image(), { decoding: "async", src: thumb })
    : img;
  (thumb ? source.decode() : Promise.resolve())
    .then(() => imageGrids.set(key, gridFrom(source)))
    // Undecodable, or a cross-origin image that taints the canvas: unknown
    .catch(() => imageGrids.set(key, null))
    .finally(() => {
      pendingGrids.delete(key);
      onReady();
    });
  return null;
}

function percent(value) {
  if (value === "left" || value === "top") return 0;
  if (value === "right" || value === "bottom") return 1;
  return value?.endsWith("%") ? parseFloat(value) / 100 : 0.5;
}

/** How an <img> maps its pixels into its box (object-fit: cover aware). */
function imageFit(img, style = getComputedStyle(img)) {
  const [posX, posY] = style.objectPosition.split(" ");
  return {
    cover: style.objectFit === "cover",
    posX: percent(posX),
    posY: percent(posY),
    ratio: img.naturalWidth / img.naturalHeight,
  };
}

/** Brightness of an image's grid at a point inside its box. */
function gridLuma(grid, fit, box, x, y) {
  let u = (x - box.left) / (box.right - box.left);
  let v = (y - box.top) / (box.bottom - box.top);
  if (fit.cover) {
    const boxRatio = (box.right - box.left) / (box.bottom - box.top);
    if (fit.ratio > boxRatio) {
      const visible = boxRatio / fit.ratio;
      u = fit.posX * (1 - visible) + u * visible;
    } else {
      const visible = fit.ratio / boxRatio;
      v = fit.posY * (1 - visible) + v * visible;
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

const pageLuma = () => (document.documentElement.dataset.theme === "light" ? 0.95 : 0.04);

function decide(current, value) {
  if (current === "light") return value < TO_DARK ? "dark" : "light";
  return value > TO_LIGHT ? "light" : "dark";
}

/* ── Exact pass (once scrolling settles) ───────────────────────────────── */

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
 * Brightness of what is painted under a point: the topmost element there,
 * then down through its ancestors, composited front to back through
 * translucent layers until something opaque is reached. The glass is
 * click-through apart from its buttons, and points are taken in its
 * padding, so the hit lands on the page.
 */
function exactLumaAt(x, y, styles, onReady) {
  let lum = 0;
  let remaining = 1;

  for (let el = document.elementFromPoint(x, y); el; el = el.parentElement) {
    const { bg, opacity } = styles(el);
    if (opacity < 0.02) continue;

    let value = null;
    let alpha = 0;
    if (el.tagName === "IMG") {
      const grid = el.complete && el.naturalWidth ? imageGrid(el, onReady) : null;
      if (grid) {
        value = gridLuma(grid, imageFit(el), el.getBoundingClientRect(), x, y);
        alpha = opacity;
      }
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
  return lum + remaining * pageLuma();
}

/* ── Fast pass (while scrolling) ───────────────────────────────────────── */

/**
 * A map of everything that can show behind the glass — images and boxes
 * with a background — in page coordinates and paint (DOM) order, built
 * when the browser is idle. While scrolling, the tone is worked out from
 * it with arithmetic alone: no hit tests, no style or layout reads.
 *
 * Boxes inside a <Parallax> move with scroll; that motion is a pure
 * function of scroll position (see .parallax in globals.css), so it's
 * recomputed here instead of being read back from the page.
 *
 * Built incrementally: `step(deadline)` works through the page until the
 * idle period runs out and returns the index once it has seen everything,
 * so building it never blocks the page for long.
 */
function createIndexBuilder(skip, onReady) {
  const vh = window.innerHeight;
  const parallaxOn =
    CSS.supports?.("animation-timeline: view()") &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const parallaxes = new Map();

  const describeParallax = (node) => {
    if (!parallaxOn || !node) return null;
    if (parallaxes.has(node)) return parallaxes.get(node);
    let desc = null;
    if (node.dataset.axis !== "x") {
      let top = 0;
      for (let el = node; el; el = el.offsetParent) top += el.offsetTop;
      const vars = getComputedStyle(node);
      desc = {
        top,
        height: node.offsetHeight,
        from: parseFloat(vars.getPropertyValue("--px-from")) || 0,
        to: parseFloat(vars.getPropertyValue("--px-to")) || 0,
        k: mobile ? parseFloat(vars.getPropertyValue("--px-mobile")) || 0.4 : 1,
      };
    }
    parallaxes.set(node, desc);
    return desc;
  };
  const offsetAt = (desc, scrollY) => {
    if (!desc) return 0;
    const p = Math.min(1, Math.max(0, (scrollY + vh - desc.top) / (vh + desc.height)));
    return (desc.from + (desc.to - desc.from) * p) * desc.k;
  };

  // Overlays (fixed) and hidden subtrees never sit behind the glass
  let style = null;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
    acceptNode(el) {
      if (el === skip) return NodeFilter.FILTER_REJECT;
      style = getComputedStyle(el);
      return style.position === "fixed" || style.display === "none"
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT;
    },
  });

  const page = pageLuma();
  const entries = [];

  const visit = (el) => {
    const sx = window.scrollX;
    const sy = window.scrollY;
    const isImg = el.tagName === "IMG";
    const bg = isImg ? null : parseColor(style.backgroundColor);
    if (isImg) {
      if (!(el.complete && el.naturalWidth)) return;
    } else if (
      !bg ||
      // Too faint to move the result (e.g. the 4% tint on the skill pills)
      bg.alpha < 0.08 ||
      // Opaque and the page's own colour: same answer as the fallback
      (bg.alpha === 1 && Math.abs(bg.lum - page) < 0.02)
    ) {
      return;
    }

    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;

    const parallax = describeParallax(el.closest(".parallax"));
    const shift = offsetAt(parallax, sy);
    const box = { left: r.left + sx, right: r.right + sx, top: r.top + sy - shift, bottom: r.bottom + sy - shift };

    if (isImg) {
      // Clip to the frame it sits in (artwork overhangs its frame to drift)
      const frame = el.closest(".drift-frame");
      let clip = null;
      if (frame) {
        const f = frame.getBoundingClientRect();
        clip = { left: f.left + sx, right: f.right + sx, top: f.top + sy - shift, bottom: f.bottom + sy - shift };
      }
      imageGrid(el, onReady);
      entries.push({ key: el.currentSrc || el.src, fit: imageFit(el, style), box, clip, parallax });
    } else {
      entries.push({ lum: bg.lum, alpha: bg.alpha, box, parallax });
    }
  };

  const finish = () => {
    // Bucket by page height, so a sample only checks what's near it. Boxes
    // under a parallax are filed under every band they can drift through.
    const buckets = new Map();
    entries.forEach((e) => {
      const area = e.clip ?? e.box;
      const reach = e.parallax ? Math.max(Math.abs(e.parallax.from), Math.abs(e.parallax.to)) * e.parallax.k : 0;
      const first = Math.floor((area.top - reach) / BUCKET);
      const last = Math.floor((area.bottom + reach) / BUCKET);
      for (let b = first; b <= last; b++) {
        if (!buckets.has(b)) buckets.set(b, []);
        buckets.get(b).push(e);
      }
    });

    return { buckets, offsetAt };
  };

  let node = walker.nextNode();
  return {
    step(deadline) {
      // At least a small batch per call, so a timed-out (busy) callback
      // still makes progress
      for (let done = 0; node; done++) {
        visit(node);
        node = walker.nextNode();
        if (done >= MIN_BATCH && deadline.timeRemaining() < 1) return null;
      }
      return finish();
    },
  };
}

function indexLumaAt(index, x, y) {
  const docX = x + window.scrollX;
  const sy = window.scrollY;
  const nearby = index.buckets.get(Math.floor((y + sy) / BUCKET));
  let lum = 0;
  let remaining = 1;

  // Buckets keep DOM order, and last in DOM order paints on top
  for (let i = (nearby?.length ?? 0) - 1; i >= 0; i--) {
    const e = nearby[i];
    const docY = y + sy - index.offsetAt(e.parallax, sy);
    const area = e.clip ?? e.box;
    if (docX < area.left || docX > area.right || docY < area.top || docY > area.bottom) continue;

    let value;
    let alpha;
    if (e.key) {
      const grid = imageGrids.get(e.key);
      if (!grid) continue;
      value = gridLuma(grid, e.fit, e.box, docX, docY);
      alpha = 1;
    } else {
      value = e.lum;
      alpha = e.alpha;
    }
    lum += remaining * alpha * value;
    remaining *= 1 - alpha;
    if (remaining < 0.04) break;
  }
  return lum + remaining * pageLuma();
}

/**
 * Watches the content behind the glass at `ref` so it can adapt the way
 * iOS Liquid Glass does. Returns the tone for the glass as a whole (drives
 * the tint), and writes `data-tone` onto every `[data-glass-sample]`
 * element inside it, so each icon picks the colour that reads best over
 * whatever is directly behind *it* — a bar half over a white screenshot
 * keeps both halves legible. Attributes are set directly rather than via
 * state so scrolling never re-renders the nav.
 *
 * Cost model: while scrolling, a per-frame estimate from an idle-built
 * index (arithmetic only); once scrolling settles, one exact hit-tested
 * pass. Hit-testing every frame was once the single biggest cost of
 * scrolling the site.
 */
export function useBackdropTone(ref) {
  const [tone, setTone] = useState("dark");

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;

    let current = "dark";
    let index = null;
    let frame = 0;
    let settleTimer = 0;
    let rebuildTimer = 0;
    let idleHandle = 0;
    // Safari has no requestIdleCallback: stand in with short time slices
    const idle =
      window.requestIdleCallback ??
      ((cb) => setTimeout(() => {
        const start = performance.now();
        cb({ timeRemaining: () => Math.max(0, 8 - (performance.now() - start)) });
      }, 60));
    const cancelIdle = window.cancelIdleCallback ?? clearTimeout;

    // Each sample point relative to the bar, re-measured when its size
    // changes. Points sit in the bar's top padding, above each icon: the
    // icons are clickable and would block the hit test, the padding isn't.
    let points = [];
    let measuredWidth = 0;
    const measure = () => {
      const box = bar.getBoundingClientRect();
      measuredWidth = box.width;
      points = [...bar.querySelectorAll("[data-glass-sample]")].map((target) => {
        const r = target.getBoundingClientRect();
        return { target, dx: r.left + r.width / 2 - box.left, dy: Math.max(1, (r.top - box.top) / 2) };
      });
    };

    // The bar is fixed, so its box only changes on resize or while it
    // animates; the exact pass refreshes it, the per-frame pass reuses it
    let barBox = null;
    const apply = (lumaAt, fresh) => {
      if (fresh || !barBox) barBox = bar.getBoundingClientRect();
      const box = barBox;
      if (!box.width) return;
      if (!points.length || Math.abs(box.width - measuredWidth) > 1) measure();
      let total = 0;
      for (const { target, dx, dy } of points) {
        const value = lumaAt(box.left + dx, box.top + dy);
        total += value;
        const next = decide(target.dataset.tone || "dark", value);
        if (target.dataset.tone !== next) target.dataset.tone = next;
      }
      const next = decide(current, points.length ? total / points.length : 0);
      if (next !== current) {
        current = next;
        setTone(next);
      }
    };

    const exact = () => {
      frame = 0;
      const styles = createStyleCache();
      apply((x, y) => exactLumaAt(x, y, styles, scheduleExact), true);
    };
    const fast = () => {
      frame = 0;
      if (index) apply((x, y) => indexLumaAt(index, x, y));
    };

    function scheduleExact() {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(exact);
      }, SETTLE_MS);
    }

    const rebuild = () => {
      clearTimeout(rebuildTimer);
      rebuildTimer = setTimeout(() => {
        cancelIdle(idleHandle);
        const builder = createIndexBuilder(bar.closest("nav") ?? bar, scheduleExact);
        const work = (deadline) => {
          const built = builder.step(deadline);
          if (!built) {
            idleHandle = idle(work, { timeout: 2000 });
            return;
          }
          index = built;
          barBox = null;
          scheduleExact();
        };
        idleHandle = idle(work, { timeout: 2000 });
      }, 200);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(fast);
      scheduleExact();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Layout changes: resizes, an accordion opening, the bar's own size
    const resizeObserver = new ResizeObserver(rebuild);
    resizeObserver.observe(document.body);
    resizeObserver.observe(bar);
    // Images finishing loading (load doesn't bubble: capture phase)
    document.addEventListener("load", rebuild, true);
    // Switching between light and dark mode
    const themeObserver = new MutationObserver(() => {
      rebuild();
      scheduleExact();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    rebuild();
    scheduleExact();

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("load", rebuild, true);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(settleTimer);
      clearTimeout(rebuildTimer);
      cancelIdle(idleHandle);
    };
  }, [ref]);

  return tone;
}
