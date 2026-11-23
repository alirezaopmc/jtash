// Pure neck-load model and SVG string rendering. Moved verbatim from the standalone demo IIFE.
// No DOM access here: render output is returned as strings and written by NeckLoad.tsx.

export interface Point {
  x: number;
  y: number;
}

export interface Pose {
  pts: Point[];
  ang: number[];
  W: (u: number, v: number) => Point;
  s: number;
}

export interface Routine {
  i: number;
  t0: number;
}

export interface State {
  screenT: number;
  postT: number;
  th: number;
  c: number;
  cT: number;
  routine: Routine | null;
  t: number;
}

export interface RenderResult {
  svg: string;
  kg: number;
  effAng: number;
  leverCm: number;
  verdict: string;
}

interface Seg {
  t: "L" | "T" | "C";
  k: number;
  len: number;
  w: number;
  base: number;
}

export const D2R = Math.PI / 180;
export const clamp = (x: number, a: number, b: number) =>
  Math.max(a, Math.min(b, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const hex = (h: string) =>
  [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mix = (a: string, b: string, t: number) => {
  const A = hex(a),
    B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(",")})`;
};
export const f = (n: number) => n.toFixed(1);

export const HANSRAJ: [number, number][] = [
  [0, 5.4],
  [15, 12.2],
  [30, 18.1],
  [45, 22.2],
  [60, 27.2],
];
export const loadAt = (t: number): number => {
  t = clamp(t, 0, 60);
  for (let i = 1; i < HANSRAJ.length; i++) {
    const [a, la] = HANSRAJ[i - 1],
      [b, lb] = HANSRAJ[i];
    if (t <= b) return lerp(la, lb, (t - a) / (b - a));
  }
  return 27.2;
};

// ---- skeleton model -------------------------------------------------
// Segments from the sacrum up. Angles are degrees from vertical, positive = leaning toward the screen.
export const SEG: Seg[] = [];
[12, 6, 0, -5, -8].forEach((b, k) => {
  SEG.push({ t: "L", k, len: 15, w: 24, base: b });
});
for (let k = 0; k < 12; k++)
  SEG.push({ t: "T", k, len: 13, w: 18, base: -8 + (k * 36) / 11 });
[22, 16, 10, 5, 1, -3, -6].forEach((b, k) => {
  SEG.push({ t: "C", k, len: 11, w: 13, base: b });
});
export const CW = [1.2, 1.3, 1.2, 1.0, 0.8, 0.6, 0.4]; // where flexion happens, C7..C1
export const CT = [-10, -9, -7, -4, 3, 7, 9]; // chin tuck: lower neck extends, upper neck nods
export const SACRUM: Point = { x: 236, y: 432 };
export const DESK = 352;
export const SCREEN_X = 588;

export function pose(th: number, c: number, s: number): Pose {
  let p: Point = { ...SACRUM },
    acc = 0;
  const pts: Point[] = [p],
    ang: number[] = [];
  for (const g of SEG) {
    let rel = 0;
    if (g.t === "L") rel = g.k === 0 ? -8 * s : s;
    else if (g.t === "T") rel = 1.6 * s;
    else rel = (0.6 * th * CW[g.k]) / 6.5 + c * CT[g.k];
    acc += rel;
    const a = g.base + acc;
    ang.push(a);
    p = {
      x: p.x + g.len * Math.sin(a * D2R),
      y: p.y - g.len * Math.cos(a * D2R),
    };
    pts.push(p);
  }
  const phi = (th * (1 - c) + 3 * c) * D2R;
  const O = p,
    cs = Math.cos(phi),
    sn = Math.sin(phi);
  const W = (u: number, v: number): Point => ({
    x: O.x + u * cs + v * sn,
    y: O.y + u * sn - v * cs,
  });
  return { pts, ang, W, s };
}
export const mid = (P: Pose, i: number): Point => ({
  x: (P.pts[i].x + P.pts[i + 1].x) / 2,
  y: (P.pts[i].y + P.pts[i + 1].y) / 2,
});
export const fwd = (P: Pose, i: number): Point => ({
  x: Math.cos(P.ang[i] * D2R),
  y: Math.sin(P.ang[i] * D2R),
});
export const add = (p: Point, d: Point, k: number): Point => ({
  x: p.x + d.x * k,
  y: p.y + d.y * k,
});

// Catmull-Rom through points -> cubic path.
export function cr(pts: Point[], closed: boolean): string {
  const n = pts.length,
    at = (i: number): Point =>
      closed ? pts[(i + n) % n] : pts[clamp(i, 0, n - 1)];
  let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1),
      p1 = at(i),
      p2 = at(i + 1),
      p3 = at(i + 2);
    d += `C${f(p1.x + (p2.x - p0.x) / 6)} ${f(p1.y + (p2.y - p0.y) / 6)} ${f(p2.x - (p3.x - p1.x) / 6)} ${f(p2.y - (p3.y - p1.y) / 6)} ${f(p2.x)} ${f(p2.y)}`;
  }
  return closed ? `${d}Z` : d;
}
export const CRANIUM: [number, number][] = [
  [-20, 8],
  [-32, 26],
  [-35, 48],
  [-26, 70],
  [-6, 83],
  [18, 84],
  [37, 75],
  [49, 58],
  [52, 46],
  [47, 39],
  [53, 28],
  [51, 19],
  [53, 12],
  [48, 6],
  [30, 10],
  [12, 12],
  [0, 6],
];
export const JAW: [number, number][] = [
  [48, 3],
  [48, -6],
  [43, -15],
  [30, -15],
  [17, -9],
  [12, 2],
  [14, 12],
];
export const skullPaths = (P: Pose) => ({
  cran: cr(
    CRANIUM.map(([u, v]) => P.W(u, v)),
    true,
  ),
  jaw: cr(
    JAW.map(([u, v]) => P.W(u, v)),
    false,
  ),
});

// Where the screen sits for a given head angle: on the gaze line from the eye.
export function screenBase(th: number): number {
  const P = pose(th, 0, th / 60),
    E = P.W(37, 42);
  const g = (10 + 0.6 * th) * D2R;
  const cy = E.y + (SCREEN_X - E.x) * Math.tan(g);
  return clamp(cy + 46, DESK - 240, DESK);
}
export function thetaForBase(by: number): number {
  let lo = 0,
    hi = 60;
  for (let i = 0; i < 24; i++) {
    const m = (lo + hi) / 2;
    if (screenBase(m) < by) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// Static ghost (neutral posture), precomputed once.
const ghost = pose(0, 0, 0);
const ghostSkull = skullPaths(ghost);
const ghostSpine = cr(ghost.pts, false);

// ---- chart ----------------------------------------------------------
export function drawChart(a: number): string {
  let o = "";
  const x = (deg: number) => 16 + (deg / 60) * 188,
    y = (kg: number) => 84 - (kg / 28) * 64;
  HANSRAJ.forEach(([d, kg]) => {
    const near = Math.abs(d - a) < 7.5;
    o += `<rect x="${f(x(d) - 9)}" y="${f(y(kg))}" width="18" height="${f(84 - y(kg))}" rx="2" fill="${near ? "#d77757" : "#2a2a2a"}"/>`;
    o += `<text x="${f(x(d))}" y="${f(y(kg) - 5)}" text-anchor="middle" font-size="9" fill="${near ? "#e6e6e6" : "#8a8a8a"}" font-family="JetBrains Mono, monospace">${kg}</text>`;
    o += `<text x="${f(x(d))}" y="100" text-anchor="middle" font-size="9" fill="#575757" font-family="JetBrains Mono, monospace">${d}°</text>`;
  });
  o += `<line x1="${f(x(a))}" y1="14" x2="${f(x(a))}" y2="86" stroke="#e5c04b" stroke-width="1.5"/>`;
  o += `<circle cx="${f(x(a))}" cy="${f(y(loadAt(a)))}" r="3.5" fill="#e5c04b"/>`;
  return o;
}

// ---- scene ----------------------------------------------------------
// Builds the scene SVG markup and the panel values for the given state.
// `reduce` = prefers-reduced-motion: removes breathing, tremor, dash flow and pulse.
export function renderScene(st: State, reduce: boolean): RenderResult {
  const th = st.th,
    c = st.c,
    s = (th / 60) * (1 - 0.8 * c);
  const P = pose(th, c, s);
  const load = loadAt(th * (1 - c));
  const ten = clamp((load - 5.4) / 21.8, 0, 1);
  const t = st.t;
  const breathe = reduce ? 0 : Math.sin(t * 1.6) * 1.2;
  let out = "";

  // floor, chair, desk
  out += `<line x1="0" y1="548" x2="640" y2="548" stroke="#2a2a2a"/>`;
  out += `<path d="M168 452 H330 M182 452 L176 548 M318 452 L324 548 M176 452 L170 300" stroke="#2f2f2f" stroke-width="6" stroke-linecap="round" fill="none"/>`;
  out += `<path d="M436 ${DESK} H640 M620 ${DESK} V548" stroke="#2f2f2f" stroke-width="6" stroke-linecap="round" fill="none"/>`;

  // laptop on a stand (position follows the screen target, not the posture)
  const by = screenBase(st.screenT),
    h = DESK - by;
  out += `<g data-laptop style="cursor:ns-resize">`;
  out += `<rect x="470" y="${f(by - 260)}" width="150" height="${f(h + 270)}" fill="transparent"/>`;
  if (h > 2)
    out += `<path d="M498 ${DESK - 3} L506 ${f(by + 3)} H566 L574 ${DESK - 3} Z" fill="#202020" stroke="#3a3a3a"/>`;
  out += `<rect x="484" y="${f(by - 5)}" width="102" height="5" rx="2" fill="#3a3a3a"/>`;
  out += `<line x1="584" y1="${f(by - 4)}" x2="596" y2="${f(by - 92)}" stroke="#8a8a8a" stroke-width="5" stroke-linecap="round"/>`;
  out += `<line x1="584" y1="${f(by - 8)}" x2="595" y2="${f(by - 88)}" stroke="#e5c04b" stroke-width="1.5" opacity=".55"/>`;
  out += `</g>`;

  // ghost: neutral posture
  out += `<g opacity=".38" fill="none" stroke="#575757" stroke-dasharray="3 4"><path d="${ghostSpine}" stroke-width="2"/><path d="${ghostSkull.cran}"/><path d="${ghostSkull.jaw}"/></g>`;
  const gTop = ghost.W(0, 92);
  out += `<text x="${f(gTop.x - 40)}" y="${f(gTop.y)}" fill="#575757" font-size="10" font-family="JetBrains Mono, monospace">neutral</text>`;

  // legs + pelvis
  const S = P.pts[0],
    hip = { x: S.x + 24, y: S.y + 8 },
    knee = { x: 422, y: 440 },
    ankle = { x: 428, y: 536 };
  out += `<path d="M${f(hip.x)} ${f(hip.y)} L${knee.x} ${knee.y} L${ankle.x} ${ankle.y} L462 542" fill="none" stroke="#3b3833" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
  const prot = -8 * s * D2R,
    pc = Math.cos(prot),
    ps = Math.sin(prot);
  const PEL: Point[] = [
    [-14, 6],
    [-20, -20],
    [-6, -40],
    [22, -34],
    [34, -10],
    [30, 8],
    [14, 16],
  ].map(([x, y]) => ({ x: S.x + x * pc - y * ps, y: S.y + x * ps + y * pc }));
  out += `<path d="${cr(PEL, true)}" fill="#d9d1c0" fill-opacity=".08" stroke="#d9d1c0" stroke-opacity=".45"/>`;

  // ribs + sternum
  const sternum: Point[] = [];
  for (let k = 1; k <= 10; k++) {
    const idx = 16 - (k - 1); // T(k), counted from T1 downward
    const m = mid(P, idx),
      F = fwd(P, idx),
      U = { x: Math.sin(P.ang[idx] * D2R), y: -Math.cos(P.ang[idx] * D2R) };
    const sw = breathe * (k / 10);
    const a = add(m, F, 9),
      e = add(add(m, F, 56 + k * 1.5 + sw), U, -(6 + k * 2.4));
    const ctl = add(add(m, F, 38 + sw), U, 6);
    out += `<path d="M${f(a.x)} ${f(a.y)} Q${f(ctl.x)} ${f(ctl.y)} ${f(e.x)} ${f(e.y)}" fill="none" stroke="#d9d1c0" stroke-opacity="${(0.28 - k * 0.012).toFixed(3)}" stroke-width="2"/>`;
    if (k <= 7) sternum.push(e);
  }
  out += `<path d="${cr(sternum, false)}" fill="none" stroke="#d9d1c0" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"/>`;

  // neck extensors: occiput -> upper back, tension shown by colour, width, flow and tremor
  const occ = P.W(-24, 14);
  const c4 = mid(P, 20),
    Fc4 = fwd(P, 20),
    t3 = mid(P, 14),
    Ft3 = fwd(P, 14);
  const trem = reduce ? 0 : Math.sin(t * 47) * ten * ten * 1.4;
  const ctrl = add(c4, Fc4, -22 - 6 * ten + trem);
  const ins = add(t3, Ft3, -20);
  const extD = `M${f(occ.x)} ${f(occ.y)} Q${f(ctrl.x)} ${f(ctrl.y)} ${f(ins.x)} ${f(ins.y)}`;
  const extCol = mix("#e79a8c", "#d9534f", ten);
  out += `<path d="${extD}" fill="none" stroke="${extCol}" stroke-opacity="${(0.35 + 0.35 * ten).toFixed(2)}" stroke-width="${f(8 + 6 * ten)}" stroke-linecap="round" ${ten > 0.45 ? 'filter="url(#nl-glow)"' : ""}/>`;
  out += `<path d="${extD}" fill="none" stroke="#0c0c0c" stroke-opacity=".55" stroke-width="1" stroke-dasharray="2 5" stroke-dashoffset="${reduce ? 0 : f(-t * (6 + 40 * ten))}"/>`;

  // deep neck flexors: along the front of the cervical spine
  const flexPts: Point[] = [P.W(8, 4)];
  for (let i = 23; i >= 14; i--)
    flexPts.push(add(mid(P, i), fwd(P, i), SEG[i].w / 2 + 4));
  const act = c;
  const flexCol = act > 0.05 ? mix("#575757", "#5fa36a", act) : "#575757";
  out += `<path d="${cr(flexPts, false)}" fill="none" stroke="${flexCol}" stroke-width="${f(2.5 + 4 * act)}" stroke-linecap="round" ${act > 0.3 ? 'filter="url(#nl-glow)"' : ""} stroke-dasharray="${act > 0.3 ? "" : "4 3"}"/>`;

  // vertebrae + discs
  for (let i = 0; i < SEG.length; i++) {
    const g = SEG[i],
      m = mid(P, i),
      a = P.ang[i];
    const hl = g.len * 0.72;
    out += `<rect x="${f(m.x - g.w / 2)}" y="${f(m.y - hl / 2)}" width="${g.w}" height="${f(hl)}" rx="3" transform="rotate(${f(a)} ${f(m.x)} ${f(m.y)})" fill="#d9d1c0" fill-opacity="${g.t === "C" ? 0.9 : 0.7}"/>`;
    const F = fwd(P, i),
      sp0 = add(m, F, -g.w / 2),
      sp1 = add(
        add(sp0, F, -(g.w * 0.55 + 4)),
        { x: Math.sin(a * D2R), y: -Math.cos(a * D2R) },
        -4,
      );
    out += `<line x1="${f(sp0.x)}" y1="${f(sp0.y)}" x2="${f(sp1.x)}" y2="${f(sp1.y)}" stroke="#d9d1c0" stroke-opacity=".6" stroke-width="${g.t === "C" ? 3 : 4}" stroke-linecap="round"/>`;
    if (i > 0) {
      const j = P.pts[i];
      const cervical = i >= 17;
      const hot = cervical ? ten * (0.4 + 0.6 * (i <= 20 ? 1 : 0.5)) : 0;
      const col = cervical ? mix("#e5c04b", "#d9534f", hot) : "#8a8a8a";
      const pulse =
        cervical && !reduce ? 1 + 0.15 * hot * Math.sin(t * 5 + i) : 1;
      out += `<ellipse cx="${f(j.x)}" cy="${f(j.y)}" rx="${f((g.w / 2) * 0.95 * pulse)}" ry="1.8" transform="rotate(${f(a)} ${f(j.x)} ${f(j.y)})" fill="${col}" fill-opacity="${cervical ? (0.45 + 0.5 * hot).toFixed(2) : 0.35}"/>`;
    }
  }

  // skull
  const sk = skullPaths(P);
  out += `<path d="${sk.cran}" fill="#d9d1c0" fill-opacity=".14" stroke="#d9d1c0" stroke-width="1.6"/>`;
  out += `<path d="${sk.jaw}" fill="none" stroke="#d9d1c0" stroke-width="1.6" stroke-linecap="round"/>`;
  const eye = P.W(37, 42),
    ear = P.W(4, 24);
  out += `<circle cx="${f(eye.x)}" cy="${f(eye.y)}" r="7" fill="#0c0c0c" stroke="#d9d1c0" stroke-opacity=".7"/>`;
  out += `<circle cx="${f(ear.x)}" cy="${f(ear.y)}" r="2.6" fill="#d9d1c0" fill-opacity=".6"/>`;

  // gaze to screen
  const sc = { x: SCREEN_X + 2, y: by - 46 };
  if (c < 0.2)
    out += `<line x1="${f(eye.x)}" y1="${f(eye.y)}" x2="${f(sc.x)}" y2="${f(sc.y)}" stroke="#e5c04b" stroke-opacity="${f(0.5 * (1 - c * 5))}" stroke-dasharray="2 6" stroke-dashoffset="${reduce ? 0 : f(-t * 14)}"/>`;

  // weight vector + lever arm from C7
  const com = P.W(10, 38),
    c7 = P.pts[17];
  const len = 18 + load * 3.4;
  out += `<line x1="${f(c7.x)}" y1="${f(c7.y)}" x2="${f(c7.x)}" y2="${f(com.y)}" stroke="#575757" stroke-dasharray="1 4"/>`;
  out += `<line x1="${f(c7.x)}" y1="${f(com.y)}" x2="${f(com.x)}" y2="${f(com.y)}" stroke="#e5c04b" stroke-width="1.5"/>`;
  out += `<line x1="${f(com.x)}" y1="${f(com.y)}" x2="${f(com.x)}" y2="${f(com.y + len)}" stroke="#d9534f" stroke-width="2.5" marker-end="url(#nl-arrow)"/>`;
  out += `<circle cx="${f(com.x)}" cy="${f(com.y)}" r="4" fill="#d9534f"/>`;
  out += `<text x="${f(com.x + 8)}" y="${f(com.y + len - 2)}" fill="#d9534f" font-size="12" font-family="JetBrains Mono, monospace">${Math.round(load)} kg</text>`;

  // labels
  const lab = (p: Point, dx: number, dy: number, txt: string, col: string) =>
    `<line x1="${f(p.x)}" y1="${f(p.y)}" x2="${f(p.x + dx)}" y2="${f(p.y + dy)}" stroke="${col}" stroke-opacity=".6"/><text x="${f(p.x + dx + (dx < 0 ? -4 : 4))}" y="${f(p.y + dy + 4)}" text-anchor="${dx < 0 ? "end" : "start"}" fill="${col}" font-size="10.5" font-family="JetBrains Mono, monospace">${txt}</text>`;
  const extMid = {
    x: (occ.x + 2 * ctrl.x + ins.x) / 4,
    y: (occ.y + 2 * ctrl.y + ins.y) / 4,
  };
  out += lab(
    extMid,
    -46,
    10,
    ten > 0.6 ? "neck extensors · straining" : "neck extensors",
    extCol,
  );
  const fm = flexPts[5];
  out += lab(
    fm,
    70,
    62,
    act > 0.5 ? "deep neck flexors · working" : "deep neck flexors · idle",
    act > 0.5 ? "#5fa36a" : "#8a8a8a",
  );
  out += `<text x="${f(c7.x - 8)}" y="${f(c7.y + 4)}" text-anchor="end" fill="#575757" font-size="10" font-family="JetBrains Mono, monospace">C7</text>`;

  // side panel values
  const kg = Math.round(load);
  const effAng = th * (1 - c);
  const leverCm = Math.max(0, (com.x - c7.x) / 4.3);
  const verdict = st.routine
    ? "Chin tuck: head back over the spine, front of the neck working."
    : effAng < 10
      ? "Stacked. The spine carries the head; the muscles barely work."
      : effAng < 25
        ? "A mild lean. Fine for a while."
        : effAng < 50
          ? "Typical laptop posture. The neck is holding about " +
            (load / 5.4).toFixed(1) +
            "× the head."
          : "Phone posture. That is a small child hanging off your neck.";

  return { svg: out, kg, effAng, leverCm, verdict };
}
