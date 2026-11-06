import { useEffect, useState } from "react";
import { useMotionPrefs } from "../lib/useMotionPrefs";
import { KeyWord, MorphWord } from "../pillars/MorphWord";
import { useTitleWords } from "../pillars/useTitleWords";

export function RotatingLine({ className = "" }: { className?: string }) {
  const items = useTitleWords();
  const { reduced, speed } = useMotionPrefs();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) {
      setI(0);
      return;
    }
    const id = setInterval(
      () => setI((n) => (n + 1) % items.length),
      2600 / speed,
    );
    return () => clearInterval(id);
  }, [reduced, speed, items.length]);

  const item = items[i];
  return (
    <p className={`text-muted ${className}`}>
      <span className="text-dim">// </span>I bring{" "}
      <KeyWord text={item.word} color={item.color} /> to{" "}
      <MorphWord text={item.subject} className="text-fg" />
    </p>
  );
}
