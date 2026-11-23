import { useCallback, useSyncExternalStore } from "react";

export function useNarrow(query = "(max-width: 767px)") {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  // The server has no viewport, so it renders the wide layout and the client corrects after hydration.
  return useSyncExternalStore(
    subscribe,
    () => matchMedia(query).matches,
    () => false,
  );
}
