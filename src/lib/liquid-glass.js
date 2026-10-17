/**
 * Liquid-glass helpers for the bottom nav.
 *
 * Refraction is done with an SVG displacement filter used as a
 * `backdrop-filter`. Only Chromium renders SVG filters there — Safari and
 * Firefox get a plain blur instead, so callers must check support first.
 */

export function supportsBackdropRefraction() {
  if (typeof window === "undefined") return false;
  // Touch devices get the plain frosted lens: re-running an SVG
  // displacement over the backdrop on every scroll frame is heavy for phone
  // GPUs, and on a phone-sized bar the bent rim is barely visible anyway
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return false;
  const ua = navigator.userAgent;
  // Every iOS browser is WebKit underneath, whatever its name says
  if (/iPhone|iPad|iPod|Firefox|FxiOS/.test(ua)) return false;
  return "chrome" in window && /Chrome\/|Chromium\/|Edg\//.test(ua);
}

/**
 * Builds the displacement map for a capsule (radius = height / 2) as a data
 * URL. Red/green encode the x/y offset, 128 = no offset. Pixels within
 * `bezel` px of the rim sample the backdrop from further inside, so the
 * content behind bends around the edge like light through a lens; the
 * centre stays flat and undistorted.
 */
export function createDisplacementMap(width, height, bezel) {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const image = ctx.createImageData(w, h);
  const data = image.data;
  const r = h / 2;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      // Nearest point on the capsule's centre line gives the edge normal
      const cx = Math.min(Math.max(px, r), w - r);
      const vx = px - cx;
      const vy = py - r;
      const dist = Math.hypot(vx, vy);
      const inset = r - dist;

      let dx = 0;
      let dy = 0;
      if (inset > 0 && inset < bezel && dist > 0) {
        const t = 1 - inset / bezel; // 1 at the rim, 0 where the bezel ends
        const strength = t * t;
        dx = -(vx / dist) * strength;
        dy = -(vy / dist) * strength;
      }

      const i = (y * w + x) * 4;
      data[i] = 128 + dx * 127;
      data[i + 1] = 128 + dy * 127;
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL();
}
