import { useEffect, useState } from "react";
import { useMotionPrefs } from "../lib/useMotionPrefs";

// Claude Code's little pixel creature. Eye holes are the gaps in rows 1–2.
const BODY = [
  "..XXXXXXXXX..",
  "..XX.XXX.XX..",
  "..XX.XXX.XX..",
  "XXXXXXXXXXXXX",
  "..XXXXXXXXX..",
  "..XXXXXXXXX..",
  "..X.X...X.X..",
  "..X.X...X.X..",
];

/** The pixel mascot. It blinks now and then — the terminal is alive. */
export function Mascot({
  pixel = 6,
  color = "#D88A80",
  blink = true,
}: {
  pixel?: number;
  color?: string;
  blink?: boolean;
}) {
  const { reduced } = useMotionPrefs();
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!blink || reduced) return;
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      t = setTimeout(
        () => {
          setClosed(true);
          t = setTimeout(() => {
            setClosed(false);
            loop();
          }, 140);
        },
        2600 + Math.random() * 2600,
      );
    };
    loop();
    return () => clearTimeout(t);
  }, [blink, reduced]);

  const grid = closed
    ? BODY.map((row, r) => (r === 1 ? "..XXXXXXXXX.." : row))
    : BODY;
  const w = grid[0].length;
  const h = grid.length;
  return (
    <svg
      width={w * pixel}
      height={h * pixel}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      aria-hidden
      className="shrink-0"
    >
      {grid.flatMap((row, y) =>
        row
          .split("")
          .map((c, x) =>
            c === "X" ? (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={1}
                height={1}
                fill={color}
              />
            ) : null,
          ),
      )}
    </svg>
  );
}
