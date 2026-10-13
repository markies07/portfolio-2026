// Deterministic abstract art-direction placeholders — no external image assets.
// Swap the panel content for real photography / project captures when available.

const PALETTES = [
  ["#2c2c2c", "#0f0f0f"],
  ["#33241a", "#0f0f0f"],
  ["#242424", "#0f0f0f"],
  ["#2e291f", "#0f0f0f"],
  ["#272727", "#0f0f0f"],
];

function seededAngle(seed) {
  return 118 + ((seed * 47) % 90);
}

export default function PlaceholderArt({
  seed = 0,
  label = "",
  mark = "",
  className = "",
}) {
  const [from, to] = PALETTES[seed % PALETTES.length];
  const angle = seededAngle(seed);

  return (
    <div
      className={`relative overflow-hidden border border-paper/10 ${className}`}
      style={{
        background: `linear-gradient(${angle}deg, ${from} 0%, ${to} 65%)`,
      }}
      role="img"
      aria-label={label || "Decorative visual"}
    >
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent 0px, transparent 46px, var(--color-paper) 46px, var(--color-paper) 47px)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-[6%] -right-[2%] select-none font-display font-semibold leading-none text-paper/[0.07]"
        style={{ fontSize: "clamp(6rem, 22vw, 16rem)" }}
        aria-hidden="true"
      >
        {mark}
      </div>
      <div
        className="absolute inset-0"
        style={{
          boxShadow: "inset 0 0 120px 20px rgba(0,0,0,0.55)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
