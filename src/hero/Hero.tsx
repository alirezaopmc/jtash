import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { slogan } from "../content";
import { useMotionPrefs } from "../lib/useMotionPrefs";
import { RotatingLine } from "./RotatingLine";
import { SocialLinks } from "./SocialLinks";
import { AutoModeLine, HeaderBlock, InputBox } from "./Terminal";

const FULL = `${slogan.line1} ${slogan.line2}${slogan.emphasis}`;

/** The slogan arrives like terminal output, then "you." gets underlined — the point of it all. */
function Slogan() {
  const { reduced } = useMotionPrefs();
  const [n, setN] = useState(reduced ? FULL.length : 0);

  useEffect(() => {
    if (reduced) {
      setN(FULL.length);
      return;
    }
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const step = () => {
      i++;
      setN(i);
      if (i < FULL.length) t = setTimeout(step, 34 + Math.random() * 30);
    };
    t = setTimeout(step, 450);
    return () => clearTimeout(t);
  }, [reduced]);

  const done = n >= FULL.length;
  const a = slogan.line1.length;
  const b = a + 1 + slogan.line2.length;
  const part = (from: number, to: number) =>
    FULL.slice(from, Math.max(from, Math.min(n, to)));
  const caret = !done && (
    <span className="caret-blink ml-[0.04em] inline-block h-[0.82em] w-[0.5em] translate-y-[0.08em] bg-fg" />
  );

  return (
    <h1
      aria-label={FULL}
      className="text-[clamp(2rem,7.4vw,7rem)] leading-[1] font-bold tracking-[-0.045em] text-fg"
    >
      <span aria-hidden>
        {/* invisible full text reserves the final layout so nothing jumps while typing */}
        <span className="relative block">
          <span className="invisible">{slogan.line1}</span>
          <span className="absolute inset-0">
            {part(0, a)}
            {n <= a && caret}
          </span>
        </span>
        <span className="relative block">
          <span className="invisible">
            {slogan.line2}
            {slogan.emphasis}
          </span>
          <span className="absolute inset-0 whitespace-nowrap">
            {part(a + 1, b)}
            <span className="relative text-claude">
              {part(b, FULL.length)}
              <motion.span
                className="absolute -bottom-[0.06em] left-0 h-[0.07em] w-[calc(100%-0.35em)] origin-left rounded-full bg-claude"
                initial={false}
                animate={{ scaleX: done ? 1 : 0 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 0.9, ease: [0.65, 0, 0.35, 1], delay: 0.35 }
                }
              />
            </span>
            {n > a && caret}
          </span>
        </span>
      </span>
    </h1>
  );
}

/** A full-screen, minimal Claude Code session. The whole page is the terminal. */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex h-[100svh] min-h-[560px] flex-col px-5 pt-7 pb-5 md:px-10 md:pt-9 md:pb-7"
    >
      <HeaderBlock />
      <SocialLinks />
      <div className="flex min-h-0 flex-1 flex-col justify-center py-8 md:pl-[94px]">
        <Slogan />
        <RotatingLine className="mt-7 text-[clamp(1rem,1.7vw,1.45rem)] md:mt-9" />
      </div>
      <InputBox />
      <AutoModeLine />
    </section>
  );
}
