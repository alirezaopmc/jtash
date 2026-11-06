import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useMotionPrefs } from "../../lib/useMotionPrefs";
import { type SceneProps, useProgress } from "./shared";

const LAYERS = [
  { key: "type", at: 0.12, note: "words people can scan" },
  { key: "space", at: 0.36, note: "room to breathe" },
  { key: "color", at: 0.6, note: "warmth, used once" },
  { key: "motion", at: 0.82, note: "it answers your hand" },
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
 * decision at a time — type, space, color, motion — until it responds to you.
 */
export function FeelingComesAlive({
  t: tv,
  narrow,
  onJumpToLayer,
}: SceneProps) {
  const t = useProgress(tv);
  const { reduced } = useMotionPrefs();
  const on = (k: LayerKey) => t >= LAYERS.find((l) => l.key === k)!.at;
  const type = on("type");
  const space = on("space");
  const color = on("color");
  const moves = on("motion") && !reduced;
  const [confirmed, setConfirmed] = useState(false);

  // Hold-to-confirm cancellation state
  const holdStartRef = useRef<number>(0);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const triggerWarningToast = () => {
    setShowWarningToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setShowWarningToast(false);
      toastTimerRef.current = null;
    }, 2500);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    holdStartRef.current = performance.now();
    setIsHolding(true);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      setIsHolding(false);
      setShowWarningToast(false);
      setConfirmed(true);
      holdTimerRef.current = null;
    }, 1000);
  };

  const handlePointerUpOrLeave = () => {
    if (!isHolding && !holdTimerRef.current) return;
    const elapsed = performance.now() - holdStartRef.current;
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHolding(false);

    if (elapsed < 250) {
      triggerWarningToast();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      if (e.repeat) return;
      holdStartRef.current = performance.now();
      setIsHolding(true);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      holdTimerRef.current = setTimeout(() => {
        setIsHolding(false);
        setShowWarningToast(false);
        setConfirmed(true);
        holdTimerRef.current = null;
      }, 1000);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      handlePointerUpOrLeave();
    }
  };

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
        whileTap: { scale: 0.98, y: 0 },
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
      className={`relative w-full max-w-[420px] overflow-hidden border backdrop-blur-xl transition-[padding,border-radius,background-color,border-color,box-shadow] duration-500 ${
        space ? "rounded-[20px] p-7 md:p-8" : "rounded-[4px] p-3"
      } ${
        color
          ? "border-feeling/25 bg-gradient-to-b from-[#211a18]/95 to-[#161211]/95 ring-1 ring-inset ring-white/10 shadow-[0_30px_90px_-25px_rgba(231,154,140,0.35)]"
          : "border-dashed border-white/15 bg-transparent ring-0"
      }`}
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
              onClick={() => {
                setConfirmed(false);
                setShowWarningToast(false);
              }}
              className="cursor-pointer font-mono text-[13px] text-feeling underline-offset-4 hover:underline"
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
              className={`flex items-center justify-between text-[12px] ${type ? "text-muted/90" : ""}`}
            >
              <Txt on={type} w="9.5rem" className="font-mono">
                Order #4821 · Pad Thai ×2
              </Txt>
              <Txt on={type} w="3.5rem" className="font-mono text-muted/80">
                €18.40
              </Txt>
            </div>

            <div
              className={`h-px w-full transition-opacity duration-500 ${
                color ? "bg-white/10" : "bg-white/5"
              }`}
            />

            <div
              className={`flex flex-col transition-[gap] duration-500 ${space ? "gap-2" : "gap-1"}`}
            >
              <Txt
                on={type}
                w="9rem"
                className={
                  type
                    ? "text-[22px] md:text-[24px] font-semibold leading-tight tracking-tight text-fg"
                    : "text-[22px]"
                }
              >
                Cancel order
              </Txt>
              <Txt
                on={type}
                w="90%"
                className={
                  type
                    ? "text-[13.5px] md:text-[14px] leading-relaxed text-muted"
                    : "text-[14px]"
                }
              >
                €18.40 will be refunded to your card within 2–3 business days.
              </Txt>
            </div>

            <div
              className={`flex transition-[gap] duration-500 ${space ? "mt-1 gap-3" : "gap-1.5"}`}
            >
              <motion.button
                type="button"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUpOrLeave}
                onPointerLeave={handlePointerUpOrLeave}
                onPointerCancel={handlePointerUpOrLeave}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                {...btnMotion}
                className={`relative overflow-hidden cursor-pointer select-none px-4 text-[14px] font-medium transition-[height,border-radius,background-color,color,box-shadow] duration-500 ${
                  space ? "h-12 flex-1 rounded-xl" : "h-8 flex-1 rounded-[3px]"
                } ${
                  color
                    ? "bg-feeling text-[#1b1413] shadow-[0_4px_16px_-4px_rgba(231,154,140,0.4)]"
                    : "bg-white/10 text-fg/70"
                }`}
              >
                <motion.div
                  aria-hidden
                  className={`absolute inset-0 origin-left ${
                    color ? "bg-black/20" : "bg-white/20"
                  }`}
                  initial={false}
                  animate={{ scaleX: isHolding ? 1 : 0 }}
                  transition={{
                    duration: isHolding ? 1.0 : 0.2,
                    ease: isHolding ? "linear" : "easeOut",
                  }}
                />
                <span className="relative z-10 flex items-center justify-center font-semibold">
                  {type ? (
                    "Hold to cancel"
                  ) : (
                    <span className="inline-block h-[0.6em] w-24 rounded-[2px] bg-white/15" />
                  )}
                </span>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setShowWarningToast(false)}
                {...btnMotion}
                className={`cursor-pointer px-4 text-[14px] font-medium transition-[height,border-radius,color,background-color] duration-500 ${
                  space ? "h-12 rounded-xl" : "h-8 rounded-[3px]"
                } ${
                  color
                    ? "border border-white/15 text-fg/80 hover:bg-white/5 hover:text-fg"
                    : "border border-white/10 text-fg/60"
                }`}
              >
                {type ? (
                  "Keep order"
                ) : (
                  <span className="inline-block h-[0.6em] w-12 rounded-[2px] bg-white/15" />
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
            <li key={l.key}>
              <button
                type="button"
                onClick={() => onJumpToLayer?.(l.at)}
                className={`group flex items-baseline gap-3 cursor-pointer text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-feeling/60 rounded px-1.5 py-0.5 -mx-1.5 -my-0.5 ${
                  lit ? "text-fg hover:text-white" : "text-dim hover:text-muted"
                }`}
                title={`Jump to ${l.key} layer`}
              >
                <span
                  className={`font-mono transition-colors duration-300 ${
                    lit ? "text-feeling" : "group-hover:text-muted"
                  }`}
                >
                  {lit ? "[✓]" : "[ ]"}
                </span>
                <span className="font-mono md:w-16">{l.key}</span>
                <span className="hidden font-mono text-muted transition-colors group-hover:text-fg/70 md:inline">
                  {l.note}
                </span>
              </button>
            </li>
          );
        })}
        <li
          className={`mt-2 hidden text-[13px] text-feeling transition-opacity duration-700 md:block ${doneCount === LAYERS.length ? "opacity-100" : "opacity-0"}`}
        >
          → go on, press it
        </li>
      </ol>
      <div className="relative flex w-full max-w-[420px] justify-center [perspective:900px]">
        {card}
        <AnimatePresence>
          {showWarningToast && (
            <motion.div
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-none absolute -bottom-11 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap flex items-center gap-2 rounded-full border border-amber/35 bg-[#1b1514]/95 px-3.5 py-1 text-[12px] font-medium text-amber shadow-[0_12px_28px_rgba(0,0,0,0.6)] backdrop-blur-md"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-amber animate-pulse" />
              <span>Hold button to confirm cancellation</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
