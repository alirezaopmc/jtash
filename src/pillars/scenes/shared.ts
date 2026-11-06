import { type MotionValue, useMotionValueEvent } from "motion/react";
import { useState } from "react";

export type SceneProps = {
  t: MotionValue<number>;
  active: boolean;
  narrow: boolean;
};

export const C = {
  fg: "#e6e6e6",
  muted: "#8a8a8a",
  dim: "#575757",
  faint: "#333333",
  rule: "#2a2a2a",
  panel: "#1b1b1b",
  ink: "#141414",
  trust: "#5fa36a",
  clarity: "#e5c04b",
  feeling: "#e79a8c",
  alarm: "#d9534f",
  amber: "#e0a458",
};

/** Subscribes to a MotionValue and returns its number, so a scene can render purely from progress. */
export function useProgress(mv: MotionValue<number>) {
  const [v, setV] = useState(() => mv.get());
  useMotionValueEvent(mv, "change", setV);
  return v;
}

export type Pt = { x: number; y: number };
export type Cubic = [Pt, Pt, Pt, Pt];

export function cubicAt([a, b, c, d]: Cubic, t: number): Pt {
  const u = 1 - t;
  const w0 = u * u * u;
  const w1 = 3 * u * u * t;
  const w2 = 3 * u * t * t;
  const w3 = t * t * t;
  return {
    x: w0 * a.x + w1 * b.x + w2 * c.x + w3 * d.x,
    y: w0 * a.y + w1 * b.y + w2 * c.y + w3 * d.y,
  };
}

export function makeCubic(a: Pt, b: Pt, dir: "h" | "v"): Cubic {
  if (dir === "h") {
    const d = (b.x - a.x) * 0.5;
    return [a, { x: a.x + d, y: a.y }, { x: b.x - d, y: b.y }, b];
  }
  const d = (b.y - a.y) * 0.5;
  return [a, { x: a.x, y: a.y + d }, { x: b.x, y: b.y - d }, b];
}

export const cubicPath = ([a, b, c, d]: Cubic) =>
  `M${a.x} ${a.y}C${b.x} ${b.y} ${c.x} ${c.y} ${d.x} ${d.y}`;

/** Smooth path through points (Catmull-Rom → cubic Bézier). */
export function smoothPath(pts: Pt[]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += `C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
  }
  return d;
}

/** Mono glyph width ≈ 0.6em for JetBrains Mono. */
export const textW = (s: string, fs: number) => s.length * fs * 0.6;

export function mixHex(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (p: number, s: number) => (p >> s) & 255;
  const m = (s: number) => Math.round(ch(pa, s) + (ch(pb, s) - ch(pa, s)) * t);
  return `rgb(${m(16)},${m(8)},${m(0)})`;
}
