/**
 * Text whose words light up one by one as it scrolls through the viewport.
 *
 * Pure CSS (a scroll-driven animation, see .scroll-words in globals.css):
 * each word fades in over its own slice of the paragraph's journey, on the
 * compositor, with no JavaScript while scrolling. Without scroll-timeline
 * support (or with reduced motion) the words are simply fully lit.
 */
export default function ScrollWords({ text, className = "" }) {
  const words = text.split(" ");

  return (
    <p className={`scroll-words ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true">
          <span
            className="scroll-word inline-block"
            style={{ "--w0": `${(i / words.length) * 100}%`, "--w1": `${((i + 1) / words.length) * 100}%` }}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
