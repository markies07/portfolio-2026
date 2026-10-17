/**
 * Scroll-linked parallax. While the element travels through the viewport it
 * drifts from `from` px to `to` px on top of normal scrolling (0 at the
 * middle if they're symmetrical). Positive-to-negative reads as "moves
 * faster than the page"; negative-to-positive as "lags behind".
 * Offsets are scaled down on small screens so nothing crowds the layout.
 *
 * Pure CSS (a scroll-driven animation, see .parallax in globals.css): it runs
 * on the compositor and costs no JavaScript while scrolling. Any box between
 * this and the page must not be overflow: hidden — use overflow: clip.
 */
export default function Parallax({
  children,
  from = 60,
  to = -60,
  axis = "y",
  mobileFactor = 0.4,
  className = "",
}) {
  return (
    <div
      className={`parallax ${className}`}
      data-axis={axis === "x" ? "x" : undefined}
      style={{ "--px-from": `${from}px`, "--px-to": `${to}px`, "--px-mobile": mobileFactor }}
    >
      {children}
    </div>
  );
}
