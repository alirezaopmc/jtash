import { useEffect, useState } from "react";

/** Seconds since mount, ticking on animation frames while `running`. Scaled by speed. */
export function useClock(running: boolean, speed = 1) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      setT((v) => v + dt * speed);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, speed]);
  return t;
}
