import {
  type MotionValue,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { type ComponentType, useEffect, useRef, useState } from "react";
import { useMotionPrefs } from "../lib/useMotionPrefs";
import { useNarrow } from "../lib/useNarrow";
import { DockedTitle } from "./DockedTitle";
import { ClarityUntangle } from "./scenes/ClarityUntangle";
import { FeelingComesAlive } from "./scenes/FeelingComesAlive";
import type { SceneProps } from "./scenes/shared";
import { TrustSelfHealing } from "./scenes/TrustSelfHealing";

/** Scroll progress where the title has finished docking. */
const INTRO = 0.07;
/** [start, end] of each pillar in section progress. */
const SEGMENTS: [number, number][] = [
  [INTRO, 0.38],
  [0.38, 0.69],
  [0.69, 1],
];
/** Where each scene's own 0→1 story runs inside its segment (the tail holds the end state). */
const STORY: [number, number][] = [
  [0.085, 0.35],
  [0.4, 0.66],
  [0.71, 0.93],
];

let sectionEl: HTMLElement | null = null;

/** Scrolls so that pillar `i` is at the start of its story. */
export function scrollToPillar(i: number) {
  if (!sectionEl) return;
  const p = STORY[i][0] + 0.005;
  const top = sectionEl.offsetTop + p * (sectionEl.offsetHeight - innerHeight);
  scrollTo({ top, behavior: "smooth" });
}

function Scene({
  index,
  p,
  smooth,
  active,
  reduced,
  narrow,
  Component,
}: {
  index: number;
  p: MotionValue<number>;
  smooth: MotionValue<number>;
  active: number;
  reduced: boolean;
  narrow: boolean;
  Component: ComponentType<SceneProps>;
}) {
  const [a, b] = SEGMENTS[index];
  const [s0, s1] = STORY[index];
  const scrubT = useTransform(smooth, [s0, s1], [0, 1], { clamp: true });
  const fullT = useMotionValue(1);
  const opacity = useTransform(
    p,
    index === 2
      ? [a - 0.025, a + 0.01, 1]
      : [Math.max(0, a - 0.025), a + 0.01, b - 0.01, b + 0.025],
    index === 2 ? [0, 1, 1] : [0, 1, 1, 0],
  );
  const isActive = active === index;
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-3 pb-4 md:px-10 md:pb-8"
      style={
        reduced
          ? { opacity: isActive ? 1 : 0, transition: "opacity 400ms" }
          : { opacity }
      }
      aria-hidden={!isActive}
      inert={!isActive}
    >
      <Component
        t={reduced ? fullT : scrubT}
        active={isActive}
        narrow={narrow}
      />
    </motion.div>
  );
}

export function Pillars({ onActive }: { onActive: (i: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useMotionPrefs();
  const narrow = useNarrow();
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(p, {
    stiffness: 140,
    damping: 32,
    restDelta: 0.0002,
  });
  const [active, setActive] = useState(0);
  const inView = useInView(ref, { amount: 0.25 });

  useMotionValueEvent(p, "change", (v) =>
    setActive(v < SEGMENTS[1][0] ? 0 : v < SEGMENTS[2][0] ? 1 : 2),
  );
  useEffect(() => onActive(inView ? active : -1), [inView, active, onActive]);
  useEffect(() => {
    sectionEl = ref.current;
    return () => {
      sectionEl = null;
    };
  }, []);

  // The title rises from mid-screen (right under where the hero line was) and docks at the top.
  const titleY = useTransform(p, [0, INTRO], ["30svh", "0svh"]);
  const ruleOpacity = useTransform(p, [INTRO * 0.7, INTRO], [0, 1]);

  const scenes: ComponentType<SceneProps>[] = [
    TrustSelfHealing,
    ClarityUntangle,
    FeelingComesAlive,
  ];

  return (
    <section
      ref={ref}
      id="capabilities"
      className="relative"
      style={{ height: narrow ? "560vh" : "520vh" }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <motion.header
          className="relative z-10 shrink-0 px-5 pt-6 pb-4 md:px-10 md:pt-9 md:pb-6"
          style={reduced ? undefined : { y: titleY }}
        >
          <DockedTitle active={active} onJump={scrollToPillar} />
          <motion.div
            className="absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:inset-x-10"
            style={{ opacity: reduced ? 1 : ruleOpacity }}
          />
        </motion.header>
        <div className="relative min-h-0 flex-1">
          {scenes.map((Component, i) => (
            <Scene
              key={i}
              index={i}
              p={p}
              smooth={smooth}
              active={active}
              reduced={reduced}
              narrow={narrow}
              Component={Component}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
