import { ease, lerp, range, seeded } from "../../lib/math";
import { useClock } from "../../lib/useClock";
import { useMotionPrefs } from "../../lib/useMotionPrefs";
import {
  C,
  mixHex,
  type Pt,
  type SceneProps,
  smoothPath,
  textW,
  useProgress,
} from "./shared";

const VOICES = ["Sales", "Support", "Eng", "Design", "Users"];
const N = 10;

const LAYOUTS = {
  wide: {
    vb: [1000, 560] as const,
    k: 1,
    along: [130, 830],
    across: [90, 450],
    target: 270,
    statement: [
      "People cancel because they",
      "can't see where their courier is.",
    ],
  },
  narrow: {
    vb: [600, 940] as const,
    k: 1.5,
    along: [120, 640],
    across: [80, 520],
    target: 300,
    statement: [
      "People cancel because",
      "they can't see where",
      "their courier is.",
    ],
  },
};

/** Clarity B: five stakeholder lines start as a knot and straighten toward one shared target. */
export function ClarityUntangle({ t: tv, active, narrow }: SceneProps) {
  const t = useProgress(tv);
  const { reduced, speed } = useMotionPrefs();
  const clock = useClock(active && !reduced, speed);
  const L = narrow ? LAYOUTS.narrow : LAYOUTS.wide;
  const { k } = L;
  const [vw, vh] = L.vb;
  const e = ease(range(t, 0.08, 0.72));
  const wobble = (1 - e) * (reduced ? 0 : 1);

  // wide: x = along, y = across. narrow: y = along, x = across.
  const map = (along: number, across: number): Pt =>
    narrow ? { x: across, y: along } : { x: along, y: across };
  const rnd = seeded(narrow ? 21 : 9);
  const tangles = VOICES.map(() =>
    Array.from({ length: N }, () =>
      lerp(L.across[0] - 30, L.across[1] + 30, rnd()),
    ),
  );

  const lines = VOICES.map((_, i) => {
    const start = lerp(L.across[0], L.across[1], i / (VOICES.length - 1));
    const pts: Pt[] = [];
    for (let j = 0; j < N; j++) {
      const u = j / (N - 1);
      const along = lerp(L.along[0], L.along[1], u);
      const straight = lerp(start, L.target, ease(u));
      const tangled = j === 0 ? start : j === N - 1 ? L.target : tangles[i][j];
      const across =
        lerp(tangled, straight, e) +
        Math.sin(clock * 0.9 + i * 1.3 + j) *
          10 *
          wobble *
          (j > 0 && j < N - 1 ? 1 : 0);
      pts.push(map(along, across));
    }
    return { start, pts };
  });

  const color = mixHex("#5a5a5a", C.clarity, e);
  const tgt = map(L.along[1] + 26 * k, L.target);
  const done = range(t, 0.72, 0.8);
  const sOpacity = range(t, 0.78, 0.9);
  const sFs = 22 * (narrow ? 1.45 : 1);
  const sY = narrow ? 790 : 488;

  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      className="h-full max-h-full w-full max-w-[1100px]"
      role="img"
      aria-label="Five stakeholder lines start tangled and straighten toward one shared problem."
    >
      {lines.map((l, i) => (
        <path
          key={i}
          d={smoothPath(l.pts)}
          fill="none"
          stroke={color}
          strokeWidth={2 * k}
          strokeOpacity={0.55 + 0.45 * e}
          strokeLinecap="round"
        />
      ))}
      {lines.map((l, i) => {
        const p = map(L.along[0] - (narrow ? 26 : 16) * k, l.start);
        return (
          <text
            key={VOICES[i]}
            x={p.x}
            y={p.y + (narrow ? 0 : 4.5 * k)}
            textAnchor={narrow ? "middle" : "end"}
            fontSize={12.5 * k}
            fill={C.muted}
          >
            {VOICES[i]}
          </text>
        );
      })}
      <circle
        cx={tgt.x}
        cy={tgt.y}
        r={11 * k}
        fill="none"
        stroke={C.clarity}
        strokeOpacity={0.4 + 0.6 * e}
        strokeWidth={1.5 * k}
      />
      <circle cx={tgt.x} cy={tgt.y} r={5 * k * done} fill={C.clarity} />
      {done > 0 && done < 1 && (
        <circle
          cx={tgt.x}
          cy={tgt.y}
          r={(11 + done * 30) * k}
          fill="none"
          stroke={C.clarity}
          opacity={1 - done}
        />
      )}
      <text
        x={narrow ? tgt.x + 22 * k : tgt.x}
        y={narrow ? tgt.y + 4 * k : tgt.y - 24 * k}
        textAnchor={narrow ? "start" : "middle"}
        fontSize={11.5 * k}
        fill={C.clarity}
        opacity={done}
      >
        one problem
      </text>
      <g opacity={sOpacity}>
        {L.statement.map((line, i) => (
          <text
            key={i}
            x={vw / 2}
            y={sY + i * sFs * 1.35}
            textAnchor="middle"
            fontSize={sFs}
            fontWeight={700}
            fill={C.fg}
          >
            {line}
          </text>
        ))}
        <rect
          x={vw / 2 - textW(L.statement[0], sFs) / 2}
          y={sY + (L.statement.length - 1) * sFs * 1.35 + 14 * k}
          width={textW(L.statement[0], sFs) * ease(range(t, 0.84, 0.95))}
          height={2 * k}
          fill={C.clarity}
        />
      </g>
    </svg>
  );
}
