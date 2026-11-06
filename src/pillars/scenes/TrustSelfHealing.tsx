import { range, seeded } from "../../lib/math";
import { useClock } from "../../lib/useClock";
import { useMotionPrefs } from "../../lib/useMotionPrefs";
import { C, type Pt, type SceneProps, useProgress } from "./shared";

type Graph = {
  pts: Pt[];
  adj: number[][];
  edges: [number, number][];
  source: number;
  sink: number;
};

function buildGraph(
  cols: number,
  rows: number,
  origin: Pt,
  step: Pt,
  source: [number, number],
  sink: [number, number],
  seed: number,
): Graph {
  const rnd = seeded(seed);
  const idx = (c: number, r: number) => r * cols + c;
  const pts: Pt[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      pts.push({
        x: origin.x + c * step.x + (rnd() - 0.5) * step.x * 0.32,
        y: origin.y + r * step.y + (rnd() - 0.5) * step.y * 0.32,
      });
  const adj: number[][] = pts.map(() => []);
  const edges: [number, number][] = [];
  const link = (a: number, b: number) => {
    adj[a].push(b);
    adj[b].push(a);
    edges.push([a, b]);
  };
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (c < cols - 1) link(idx(c, r), idx(c + 1, r));
      if (r < rows - 1) link(idx(c, r), idx(c, r + 1));
      if (c < cols - 1 && r < rows - 1 && rnd() > 0.55)
        link(idx(c, r), idx(c + 1, r + 1));
    }
  return { pts, adj, edges, source: idx(...source), sink: idx(...sink) };
}

function bfs(g: Graph, blocked: number | null) {
  const prev = new Map<number, number>([[g.source, -1]]);
  const q = [g.source];
  while (q.length) {
    const n = q.shift()!;
    if (n === g.sink) break;
    for (const m of g.adj[n])
      if (m !== blocked && !prev.has(m)) prev.set(m, n), q.push(m);
  }
  const path: number[] = [];
  for (let n = g.sink; n !== -1 && n !== undefined; n = prev.get(n)!)
    path.unshift(n);
  return path;
}

const GRAPHS = {
  wide: {
    vb: [1000, 520],
    k: 1,
    g: buildGraph(
      7,
      4,
      { x: 110, y: 90 },
      { x: 130, y: 110 },
      [0, 1],
      [6, 2],
      7,
    ),
  },
  narrow: {
    vb: [600, 920],
    k: 1.5,
    g: buildGraph(
      4,
      6,
      { x: 90, y: 110 },
      { x: 140, y: 120 },
      [1, 0],
      [2, 5],
      11,
    ),
  },
};

/** Trust B: a network keeps a steady pulse; a node fails, traffic quietly reroutes, the node heals. */
export function TrustSelfHealing({ t: tv, active, narrow }: SceneProps) {
  const t = useProgress(tv);
  const { reduced, speed } = useMotionPrefs();
  const clock = useClock(active && !reduced, speed);
  const { vb, k, g } = narrow ? GRAPHS.narrow : GRAPHS.wide;

  const basePath = bfs(g, null);
  const victim = basePath[Math.floor(basePath.length / 2)];
  const failed = t > 0.3 && t < 0.72;
  const path = failed ? bfs(g, victim) : basePath;
  const reveal = range(t, 0, 0.14);
  const heal = range(t, 0.72, 0.8);

  const onPath = new Set<string>();
  for (let i = 0; i < path.length - 1; i++)
    onPath.add([path[i], path[i + 1]].sort().join("-"));

  // pulses travel along the current path at constant speed
  const segs = path.slice(0, -1).map((n, i) => {
    const a = g.pts[n];
    const b = g.pts[path[i + 1]];
    return { a, b, len: Math.hypot(b.x - a.x, b.y - a.y) };
  });
  const total = segs.reduce((s, x) => s + x.len, 0);
  const pulses = Array.from({ length: 5 }, (_, j) => {
    let d = (clock * 150 + (j * total) / 5) % total;
    for (const s of segs) {
      if (d <= s.len)
        return {
          x: s.a.x + ((s.b.x - s.a.x) * d) / s.len,
          y: s.a.y + ((s.b.y - s.a.y) * d) / s.len,
        };
      d -= s.len;
    }
    return g.pts[g.sink];
  });

  const v = g.pts[victim];
  const src = g.pts[g.source];
  const snk = g.pts[g.sink];
  const captions = [
    { on: t > 0.3, text: failed ? "node lost" : "node lost", color: C.alarm },
    { on: t > 0.36, text: "rerouted", color: C.amber },
    { on: t > 0.72, text: "recovered", color: C.trust },
  ];

  return (
    <svg
      viewBox={`0 0 ${vb[0]} ${vb[1]}`}
      className="h-full max-h-full w-full max-w-[1100px]"
      role="img"
      aria-label="A network keeps delivering while one node fails, traffic reroutes around it and the node recovers."
    >
      {g.edges.map(([a, b], i) => {
        const hot = onPath.has([a, b].sort().join("-"));
        const broken = failed && (a === victim || b === victim);
        return (
          <line
            key={i}
            x1={g.pts[a].x}
            y1={g.pts[a].y}
            x2={g.pts[b].x}
            y2={g.pts[b].y}
            stroke={broken ? "#3a2222" : hot ? C.trust : C.faint}
            strokeOpacity={hot ? 0.35 + 0.65 * reveal : 1}
            strokeWidth={(hot ? 2 : 1.2) * k}
            strokeDasharray={broken ? "3 5" : undefined}
          />
        );
      })}
      {g.pts.map((p, i) => {
        const isVictim = i === victim;
        const fill =
          isVictim && failed
            ? C.alarm
            : i === g.source || i === g.sink
              ? C.trust
              : "#4a4a4a";
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={(i === g.source || i === g.sink ? 7 : 4.5) * k}
            fill={fill}
          />
        );
      })}
      {failed && (
        <g stroke={C.alarm} strokeWidth={2 * k} strokeLinecap="round">
          <line
            x1={v.x - 12 * k}
            y1={v.y - 12 * k}
            x2={v.x + 12 * k}
            y2={v.y + 12 * k}
          />
          <line
            x1={v.x + 12 * k}
            y1={v.y - 12 * k}
            x2={v.x - 12 * k}
            y2={v.y + 12 * k}
          />
        </g>
      )}
      {heal > 0 && heal < 1 && (
        <circle
          cx={v.x}
          cy={v.y}
          r={(6 + heal * 26) * k}
          fill="none"
          stroke={C.trust}
          opacity={1 - heal}
        />
      )}
      {reveal > 0.5 &&
        pulses.map((p, j) => (
          <circle key={j} cx={p.x} cy={p.y} r={4 * k} fill={C.fg} />
        ))}

      <text
        x={src.x}
        y={src.y - 18 * k}
        fontSize={12 * k}
        fill={C.muted}
        textAnchor="middle"
      >
        request
      </text>
      <text
        x={snk.x}
        y={snk.y + 30 * k}
        fontSize={12 * k}
        fill={C.muted}
        textAnchor="middle"
      >
        promise kept
      </text>

      <g
        transform={`translate(${narrow ? 40 : 40} ${vb[1] - (narrow ? 40 : 20)})`}
      >
        {captions.map((c, i) => (
          <text
            key={i}
            x={narrow ? 0 : i * 170}
            y={narrow ? (i - 2) * 34 : 0}
            fontSize={12 * k}
            fill={c.on ? c.color : C.dim}
          >
            {c.on ? "● " : "○ "}
            {c.text}
          </text>
        ))}
        <text
          x={narrow ? 520 : 920}
          y={0}
          fontSize={12 * k}
          fill={C.trust}
          textAnchor="end"
        >
          delivered 100%
        </text>
      </g>
    </svg>
  );
}
