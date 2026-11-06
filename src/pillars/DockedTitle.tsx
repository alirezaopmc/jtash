import { AnimatePresence, motion } from "motion/react";
import { SectionProgressSquares } from "../components/SectionProgressSquares";
import { KeyWord, MorphWord } from "./MorphWord";
import { useTitleWords } from "./useTitleWords";

const DISCIPLINE = ["backend", "product", "frontend"];

export function DockedTitle({
  active,
  isDocked,
  onJump,
}: {
  active: number;
  isDocked: boolean;
  onJump: (i: number) => void;
}) {
  const items = useTitleWords();
  const item = items[active];

  const squareItems = items.map((it, i) => ({
    id: it.key,
    label: `${DISCIPLINE[i]}: ${it.word}`,
    color: it.color,
  }));

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <AnimatePresence mode="wait">
        {!isDocked ? (
          <motion.div
            key="pre-dock"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.7,
              x: 80,
              transition: { duration: 0.22, ease: "easeIn" },
            }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-3 py-2"
          >
            <h2 className="text-[clamp(2.2rem,5.5vw,4.2rem)] font-bold tracking-[-0.04em] text-fg">
              <span className="font-mono text-claude">#</span> 01 Capabilities
            </h2>
            <div className="h-px w-full bg-white/10" />
          </motion.div>
        ) : (
          <motion.div
            key="docked"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col"
          >
            {/* Row 1: Colorful progress squares + active discipline on left | Section badge on right */}
            <div className="mb-2.5 flex items-center justify-between text-[12px] text-muted md:mb-3 md:text-[13px]">
              <div className="flex items-center gap-2.5">
                <SectionProgressSquares
                  items={squareItems}
                  activeIndex={active}
                  isDocked={isDocked}
                  onSelect={onJump}
                />
                <span className="font-mono text-fg/90">
                  ·{" "}
                  <MorphWord text={DISCIPLINE[active]} className="text-fg/80" />
                </span>
              </div>

              <motion.span
                initial={{ opacity: 0, scale: 1.5, x: -60 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="text-[11px] tracking-[0.14em] text-claude uppercase font-mono font-bold"
              >
                01 Capabilities
              </motion.span>
            </div>

            {/* Row 2: Headline */}
            <h2 className="text-[clamp(1.7rem,4.6vw,3.9rem)] leading-[1.06] font-bold tracking-[-0.035em] text-fg">
              <span className="text-fg/55">I bring </span>
              <KeyWord text={item.word} color={item.color} />
              <span className="text-fg/55"> to </span>
              <MorphWord text={item.subject} />
            </h2>

            {/* Row 3: Subtitle / Meaning & Link */}
            <div className="mt-2.5 flex min-h-8 flex-col gap-2 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between md:mt-3 md:text-[15px]">
              <p key={item.meaning} className="fade-up">
                <span style={{ color: item.color }}>→ </span>
                {item.meaning}
              </p>
              <a
                href={item.moreHref}
                className="group w-fit shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-fg/70 transition-[border-color,color,transform] hover:translate-x-0.5 hover:border-white/25 hover:text-fg md:text-[11px]"
              >
                {item.moreLabel}{" "}
                <span className="text-dim transition-colors group-hover:text-fg">
                  ↗
                </span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
