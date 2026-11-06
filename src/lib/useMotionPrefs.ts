import { useReducedMotion } from "motion/react";

export function useMotionPrefs() {
  return { reduced: Boolean(useReducedMotion()), speed: 1 };
}
