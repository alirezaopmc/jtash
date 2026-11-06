import { useEffect, useRef, useState } from "react";
import { useMotionPrefs } from "../lib/useMotionPrefs";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz/<>*_";

/** A word that "decodes" into its new value like terminal output when `text` changes. */
export function MorphWord({
  text,
  className = "",
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { reduced } = useMotionPrefs();
  const [shown, setShown] = useState(text);
  const prev = useRef(text);

  useEffect(() => {
    const from = prev.current;
    prev.current = text;
    if (reduced || from === text) {
      setShown(text);
      return;
    }
    const len = Math.max(from.length, text.length);
    const dur = 560;
    let raf = 0;
    let start = -1;
    // Use the rAF timestamp for both ends so the timebase is always consistent.
    const tick = (now: number) => {
      if (start < 0) start = now;
      const p = (now - start) / dur;
      let out = "";
      for (let i = 0; i < len; i++) {
        const reveal = 0.35 + (i / len) * 0.65;
        if (p >= reveal) out += text[i] ?? "";
        else if (p < reveal * 0.25) out += from[i] ?? "";
        else
          out +=
            i < text.length || p < 0.7
              ? GLYPHS[(Math.random() * GLYPHS.length) | 0]
              : "";
      }
      setShown(out);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setShown(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, reduced]);

  return (
    <span className={`relative whitespace-nowrap ${className}`} style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{shown}</span>
    </span>
  );
}

/** The pillar key word in its pillar color. */
export function KeyWord({ text, color }: { text: string; color: string }) {
  return (
    <MorphWord
      text={text}
      className="font-bold"
      style={{ color, transition: "color 500ms ease" }}
    />
  );
}
