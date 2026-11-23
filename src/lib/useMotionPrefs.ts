import { useCallback, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** Reduced-motion preference. The server and the first client render say "not reduced", then the real value applies. */
export function useMotionPrefs() {
  const subscribe = useCallback((onChange: () => void) => {
    const mq = matchMedia(QUERY);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const reduced = useSyncExternalStore(
    subscribe,
    () => matchMedia(QUERY).matches,
    () => false,
  );
  return { reduced, speed: 1 };
}
