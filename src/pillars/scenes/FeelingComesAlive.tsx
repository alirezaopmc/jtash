import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { type ReactNode, useState } from "react";
import { useMotionPrefs } from "../../lib/useMotionPrefs";
import { type SceneProps, useProgress } from "./shared";

const LAYERS = [
  { key: "type", at: 0.1, note: "words people can scan" },
  { key: "space", at: 0.28, note: "room to breathe" },
  { key: "color", at: 0.46, note: "warmth, used once" },
  { key: "motion", at: 0.64, note: "it answers your hand" },
  { key: "care", at: 0.82, note: "says what you're thinking" },
] as const;

type LayerKey = (typeof LAYERS)[number]["key"];

/** Text that is a grey wireframe bar until the `type` layer turns on. */
function Txt({
  on,
  w,
  children,
  className = "",
}: {
  on: boolean;
  w: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`relative block ${className}`}>
      <span
        className={`block transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0"}`}
      >
        {children}
      </span>
      <span
        aria-hidden
        className={`absolute top-1/2 left-0 h-[0.62em] -translate-y-1/2 rounded-[2px] bg-white/10 transition-opacity duration-500 ${on ? "opacity-0" : "opacity-100"}`}
        style={{ width: w }}
      />
    </span>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 48 48" className="size-12" aria-hidden>
      <motion.circle
        cx="24"
        cy="24"
        r="21"
        fill="none"
        stroke="var(--color-feeling)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.path
        d="M15 24.5l6 6 12-13"
        fill="none"
        stroke="var(--color-feeling)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      />
    </svg>
  );
}

/**
 * Feeling A: the same cancel screen as the Trust card, built up from a wireframe one
 * decision at a time — type, space, color, motion, care — until it responds to you.
 */
export function FeelingComesAlive({ t: tv, narrow }: SceneProps) {
  const t = useProgress(tv);
  const { reduced } = useMotionPrefs();
  const on = (k: LayerKey) => t >= LAYERS.find((l) => l.key === k)!.at;
  const type = on("type");
  const space = on("space");
  const color = on("color");
  const moves = on("motion") && !reduced;
  const care = on("care");
  const [confirmed, setConfirmed] = useState(false);

  // pointer tilt — only once the "motion" layer is on
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), {
    stiffness: 180,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), {
    stiffness: 180,
    damping: 18,
  });
  const glowX = useTransform(mx, [-0.5, 0.5], ["10%", "90%"]);
  const glowY = useTransform(my, [-0.5, 0.5], ["0%", "100%"]);
  const tiltOn = moves && !narrow;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tiltOn) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const btnMotion = moves
    ? {
        whileHover: { y: -2 },
        whileTap: { scale: 0.96, y: 0 },
        transition: { type: "spring" as const, stiffness: 500, damping: 22 },
      }
    : {};

  const card = (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={
        tiltOn
          ? { rotateX: rx, rotateY: ry, transformPerspective: 900 }
          : undefined
      }
      className={`relative w-full max-w-[420px] overflow-hidden border transition-[padding,border-radius,background-color,border-color,box-shadow] duration-500 ${
        space ? "rounded-[18px] p-7 md:p-8" : "rounded-[4px] p-3"
      } ${color ? "border-feeling/25 bg-[#1d1716] shadow-[0_30px_80px_-30px_rgba(231,154,140,0.35)]" : "border-dashed border-white/15 bg-transparent"}`}
    >
      {moves && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-feeling/10 blur-3xl"
          style={{ left: glowX, top: glowY }}
        />
      )}
      <AnimatePresence mode="wait" initial={false}>
        {confirmed ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex flex-col items-start gap-4 py-4"
          >
            <Check />
            <div>
              <p className="font-sans text-[22px] font-semibold tracking-tight text-fg">
                Cancelled.
              </p>
              <p className="mt-1 font-sans text-[14px] text-muted">
                Refund on its way · €18.40
              </p>
            </div>
            <button
              type="button"
              onClick={() => setConfirmed(false)}
              className="cursor-pointer text-[13px] text-feeling underline-offset-4 hover:underline"
            >
              undo
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="ask"
            exit={{ opacity: 0 }}
            className={`relative flex flex-col font-sans transition-[gap] duration-500 ${space ? "gap-5" : "gap-1.5"}`}
          >
            <div
              className={`flex items-center justify-between text-[12px] ${type ? "text-muted" : ""}`}
            >
              <Txt on={type} w="9.5rem">
                Order #4821 · Pad Thai ×2
              </Txt>
              {care && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1.5 rounded-full bg-trust/10 px-2 py-0.5 text-[11px] text-trust"
                >
                  <span className="size-1.5 rounded-full bg-trust" /> not picked
                  up
                </motion.span>
              )}
            </div>
            <div
              className={`flex flex-col transition-[gap] duration-500 ${space ? "gap-2.5" : "gap-1"}`}
            >
              <Txt
                on={type}
                w="11rem"
                className={
                  type
                    ? "text-[24px] leading-tight font-semibold tracking-tight text-fg"
                    : "text-[24px]"
                }
              >
                {care ? "Changed your mind? No problem." : "Cancel order"}
              </Txt>
              <Txt
                on={type}
                w="85%"
                className={
                  type
                    ? "text-[14px] leading-relaxed text-muted"
                    : "text-[14px]"
                }
              >
                {care
                  ? "Ali hasn't picked it up yet, so it's free. €18.40 goes back to your card in 2–3 days."
                  : "Cancellation may be subject to fees. Refund processing times vary."}
              </Txt>
            </div>
            <div
              className={`flex transition-[gap] duration-500 ${space ? "mt-1 gap-3" : "gap-1.5"}`}
            >
              <motion.button
                type="button"
                onClick={() => setConfirmed(true)}
                {...btnMotion}
                className={`cursor-pointer px-4 text-[14px] font-medium transition-[height,border-radius,background-color,color] duration-500 ${space ? "h-12 flex-1 rounded-xl" : "h-8 flex-1 rounded-[3px]"} ${
                  color ? "bg-feeling text-[#2a1512]" : "bg-white/10 text-fg/70"
                }`}
              >
                {type ? (
                  care ? (
                    "Cancel order"
                  ) : (
                    "CONFIRM CANCELLATION"
                  )
                ) : (
                  <span className="inline-block h-[0.6em] w-24 rounded-[2px] bg-white/15" />
                )}
              </motion.button>
              <motion.button
                type="button"
                {...btnMotion}
                className={`cursor-pointer px-4 text-[14px] transition-[height,border-radius] duration-500 ${space ? "h-12 rounded-xl" : "h-8 rounded-[3px]"} ${
                  color ? "text-fg/80 hover:bg-white/5" : "text-fg/60"
                } border border-white/10`}
              >
                {type ? (
                  care ? (
                    "Keep my order"
                  ) : (
                    "Back"
                  )
                ) : (
                  <span className="inline-block h-[0.6em] w-10 rounded-[2px] bg-white/15" />
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const doneCount = LAYERS.filter((l) => t >= l.at).length;
  return (
    <div className="flex h-full w-full max-w-[1000px] flex-col items-center justify-center gap-6 md:flex-row md:justify-between md:gap-16">
      <ol
        className={`flex shrink-0 gap-x-4 gap-y-1 text-[12px] md:flex-col md:gap-3.5 md:text-[14px] ${narrow ? "flex-wrap justify-center" : ""}`}
      >
        {LAYERS.map((l) => {
          const lit = t >= l.at;
          return (
            <li
              key={l.key}
              className={`flex items-baseline gap-3 transition-colors duration-500 ${lit ? "text-fg" : "text-dim"}`}
            >
              <span className={lit ? "text-feeling" : ""}>
                {lit ? "[✓]" : "[ ]"}
              </span>
              <span className="md:w-16">{l.key}</span>
              <span className="hidden text-muted md:inline">{l.note}</span>
            </li>
          );
        })}
        <li
          className={`mt-2 hidden text-[13px] text-feeling transition-opacity duration-700 md:block ${doneCount === LAYERS.length ? "opacity-100" : "opacity-0"}`}
        >
          → go on, press it
        </li>
      </ol>
      <div className="flex w-full max-w-[420px] justify-center [perspective:900px]">
        {card}
      </div>
    </div>
  );
}
