"use client";

import { useCallback, useEffect, useState } from "react";

// Persists dev-only UI variant choices in localStorage. Pair with
// DevVariantToolbar in development; keep even when the toolbar is not mounted.
export function useDevVariant<T extends string>(
  storageKey: string,
  defaultValue: T,
  validValues: readonly T[],
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);

      if (stored && validValues.includes(stored as T)) {
        setValue(stored as T);
      }
    } catch {
      // Ignore storage access errors in restricted environments.
    }
  }, [storageKey, validValues]);

  const updateValue = useCallback(
    (nextValue: T) => {
      setValue(nextValue);

      try {
        window.localStorage.setItem(storageKey, nextValue);
      } catch {
        // Ignore storage access errors in restricted environments.
      }
    },
    [storageKey],
  );

  return [value, updateValue];
}
