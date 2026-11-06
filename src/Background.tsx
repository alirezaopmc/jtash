const TINTS = [
  "var(--color-claude)",
  "var(--color-trust)",
  "var(--color-clarity)",
  "var(--color-feeling)",
];

/**
 * The page is the terminal: a faint grid of character cells (2 cols × 1 row per dot).
 * The light underneath warms toward whichever section you're in.
 */
export function Background({ active }: { active: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void"
    >
      {TINTS.map((c, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
          style={{
            opacity: active + 1 === i ? 1 : 0,
            background: `radial-gradient(60% 50% at 50% 62%, color-mix(in oklab, ${c} 11%, transparent), transparent 70%)`,
          }}
        />
      ))}
      {
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(255,255,255,0.07) 0.8px, transparent 1.3px)",
            backgroundSize: "19.2px 36px",
            maskImage:
              "radial-gradient(90% 80% at 50% 55%, black, transparent)",
          }}
        />
      }
    </div>
  );
}
