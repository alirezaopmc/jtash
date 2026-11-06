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

const SCENE_OPACITIES: { input: number[]; output: number[] }[] = [
  { input: [0.05, 0.08, 0.35, 0.37], output: [0, 1, 1, 0] },
  { input: [0.38, 0.4, 0.66, 0.68], output: [0, 1, 1, 0] },
  { input: [0.69, 0.71, 1], output: [0, 1, 1] },
];

function Scene({
  index,
  p,
  smooth,
  active,
  reduced,
  narrow,
  Component,
  onJumpToLayer,
}: {
  index: number;
  p: MotionValue<number>;
  smooth: MotionValue<number>;
  active: number;
  reduced: boolean;
  narrow: boolean;
  Component: ComponentType<SceneProps>;
  onJumpToLayer?: (at: number) => void;
}) {
  const [s0, s1] = STORY[index];
  const scrubT = useTransform(smooth, [s0, s1], [0, 1], { clamp: true });
  const fullT = useMotionValue(1);
  const opacityConfig = SCENE_OPACITIES[index];
  const opacity = useTransform(p, opacityConfig.input, opacityConfig.output, {
    clamp: true,
  });
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
        onJumpToLayer={onJumpToLayer}
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
  const [isDocked, setIsDocked] = useState(false);
  const inView = useInView(ref, { amount: 0.25 });

  useEffect(() => {
    setIsDocked(p.get() >= 0.03);
  }, [p]);

  useMotionValueEvent(p, "change", (v) => {
    setIsDocked(v >= 0.03);
    setActive(v < SEGMENTS[1][0] ? 0 : v < SEGMENTS[2][0] ? 1 : 2);
  });
  useEffect(() => onActive(inView ? active : -1), [inView, active, onActive]);
  useEffect(() => {
    sectionEl = ref.current;
    return () => {
      sectionEl = null;
    };
  }, []);

  const ruleOpacity = useTransform(p, [0.02, 0.05], [0, 1]);

  const handleJumpToLayer = (layerAt: number) => {
    const el = ref.current;
    if (!el) return;
    const [s0, s1] = STORY[2];
    const targetP = s0 + layerAt * (s1 - s0) + 0.005;
    const top = el.offsetTop + targetP * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: "smooth" });
  };

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
        <header className="relative z-10 shrink-0 px-5 pt-6 pb-4 md:px-10 md:pt-8 md:pb-5">
          <DockedTitle
            active={active}
            isDocked={isDocked}
            onJump={scrollToPillar}
          />
          <motion.div
            className="absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:inset-x-10"
            style={{ opacity: reduced ? 1 : ruleOpacity }}
          />
        </header>
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
              onJumpToLayer={i === 2 ? handleJumpToLayer : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
