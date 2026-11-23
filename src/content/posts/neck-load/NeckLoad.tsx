import { useEffect, useId, useRef, useState } from "react";
import "./NeckLoad.css";
import {
  clamp,
  DESK,
  drawChart,
  renderScene,
  type State,
  screenBase,
  thetaForBase,
} from "./neckModel";

interface PlanStep {
  p: number;
  d: number;
  c: number;
  msg: string;
  hold?: boolean;
}
interface Coach {
  pre: string;
  b?: string;
  post?: string;
}

const IDLE_LABEL = "Do 3 reps with the model";
const IDLE_COACH: Coach = { pre: "" };

const STEPS = [
  "Sit tall. Eyes level, shoulders loose.",
  "Glide your head straight back, as if making a double chin. Don't tip it down.",
  "Hold 5 seconds. You should feel the front of your neck work.",
  "Release slowly. Ten reps, a few times a day. Then raise your screen.",
];

const PLAN: PlanStep[] = [{ p: 0, d: 1.4, c: 0, msg: "Sit tall." }];
for (let r = 1; r <= 3; r++) {
  PLAN.push({ p: 1, d: 1.6, c: 1, msg: `Rep ${r} of 3 · glide back` });
  PLAN.push({ p: 2, d: 5, c: 1, msg: `Rep ${r} of 3 · hold`, hold: true });
  PLAN.push({ p: 3, d: 1.6, c: 0, msg: `Rep ${r} of 3 · release` });
}

function initialState(): State {
  return { screenT: 45, postT: 45, th: 45, c: 0, cT: 0, routine: null, t: 0 };
}

export default function NeckLoad() {
  const tiltId = useId();

  // Static first frame, so the no-JS page is complete. Same markup the loop writes later.
  const [first] = useState(() => {
    const r = renderScene(initialState(), true);
    return { r, chart: drawChart(r.effAng) };
  });

  const sceneRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const chartRef = useRef<SVGSVGElement>(null);
  const tiltRef = useRef<HTMLInputElement>(null);
  const tiltvRef = useRef<HTMLSpanElement>(null);
  const kgRef = useRef<HTMLSpanElement>(null);
  const angRef = useRef<HTMLDivElement>(null);
  const leverRef = useRef<HTMLDivElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const goRef = useRef<HTMLButtonElement>(null);

  // Rarely-changing UI only. The frame loop never sets these per frame.
  const [running, setRunning] = useState(false);
  const [active, setActive] = useState(-1);
  const [coach, setCoach] = useState<Coach>(IDLE_COACH);

  useEffect(() => {
    const svg = sceneRef.current,
      g = gRef.current,
      chart = chartRef.current;
    const tilt = tiltRef.current,
      tiltv = tiltvRef.current,
      kg = kgRef.current;
    const ang = angRef.current,
      lever = leverRef.current,
      verdict = verdictRef.current;
    const go = goRef.current;
    if (
      !svg ||
      !g ||
      !chart ||
      !tilt ||
      !tiltv ||
      !kg ||
      !ang ||
      !lever ||
      !verdict ||
      !go
    )
      return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const st = initialState();

    // Last values shown in React state, so setState runs only on change.
    let shownRunning = false;
    let shownActive = -1;
    let shownCoach = JSON.stringify(IDLE_COACH);
    const showRunning = (v: boolean) => {
      if (v !== shownRunning) {
        shownRunning = v;
        setRunning(v);
      }
    };
    const showActive = (v: number) => {
      if (v !== shownActive) {
        shownActive = v;
        setActive(v);
      }
    };
    const showCoach = (v: Coach) => {
      const k = JSON.stringify(v);
      if (k !== shownCoach) {
        shownCoach = k;
        setCoach(v);
      }
    };

    const write = () => {
      const r = renderScene(st, reduce);
      g.innerHTML = r.svg;
      kg.textContent = String(r.kg);
      ang.textContent = `${Math.round(r.effAng)}°`;
      lever.textContent = `${r.leverCm.toFixed(1)} cm`;
      verdict.textContent = r.verdict;
      chart.innerHTML = drawChart(r.effAng);
    };

    // ---- input ----
    const setScreen = (v: number) => {
      st.screenT = clamp(v, 0, 60);
      tilt.value = String(Math.round(st.screenT));
      tiltv.textContent = `${Math.round(st.screenT)}°`;
      if (!st.routine) st.postT = st.screenT;
    };
    const onTilt = () => setScreen(+tilt.value);
    tilt.addEventListener("input", onTilt);

    let drag: { y0: number; b0: number } | null = null;
    const svgY = (e: PointerEvent) => {
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const m = svg.getScreenCTM();
      return m ? pt.matrixTransform(m.inverse()).y : 0;
    };
    const onDown = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      if (!el?.closest("[data-laptop]")) return;
      drag = { y0: svgY(e), b0: screenBase(st.screenT) };
      svg.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      setScreen(
        thetaForBase(clamp(drag.b0 + svgY(e) - drag.y0, DESK - 240, DESK)),
      );
    };
    const onEnd = () => {
      drag = null;
    };
    svg.addEventListener("pointerdown", onDown);
    svg.addEventListener("pointermove", onMove);
    svg.addEventListener("pointerup", onEnd);
    svg.addEventListener("pointercancel", onEnd);

    // ---- chin tuck routine ----
    const stopRoutine = (done: boolean) => {
      st.routine = null;
      st.cT = 0;
      st.postT = st.screenT;
      showRunning(false);
      showActive(-1);
      showCoach(
        done && st.screenT > 20
          ? {
              pre: "Done. Your screen is still low, so the slouch returns. ",
              b: "Drag the laptop up.",
            }
          : done
            ? {
                pre: "",
                b: "Done.",
                post: " Screen at eye level keeps you there.",
              }
            : IDLE_COACH,
      );
    };
    const onGo = () => {
      if (st.routine) {
        stopRoutine(false);
        return;
      }
      st.routine = { i: 0, t0: st.t };
      showRunning(true);
    };
    go.addEventListener("click", onGo);

    const tickRoutine = () => {
      const R = st.routine;
      if (!R) return;
      let el = st.t - R.t0;
      while (R.i < PLAN.length && el > PLAN[R.i].d) {
        R.t0 += PLAN[R.i].d;
        el -= PLAN[R.i].d;
        R.i++;
      }
      if (R.i >= PLAN.length) {
        stopRoutine(true);
        return;
      }
      const ph = PLAN[R.i];
      st.postT = 3;
      st.cT = ph.c;
      showActive(ph.p);
      showCoach(
        ph.hold
          ? { pre: `${ph.msg} `, b: String(Math.ceil(ph.d - el)) }
          : { pre: ph.msg },
      );
    };

    // ---- loop ----
    let last = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      st.t += dt;
      tickRoutine();
      const k = reduce ? 30 : 4.5;
      st.th += (st.postT - st.th) * (1 - Math.exp(-dt * k));
      st.c += (st.cT - st.c) * (1 - Math.exp(-dt * (reduce ? 30 : 3.2)));
      write();
      raf = requestAnimationFrame(frame);
    };
    write();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      tilt.removeEventListener("input", onTilt);
      svg.removeEventListener("pointerdown", onDown);
      svg.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerup", onEnd);
      svg.removeEventListener("pointercancel", onEnd);
      go.removeEventListener("click", onGo);
    };
  }, []);

  return (
    <div className="nl">
      <figure>
        <div className="stage">
          <div className="hint">
            <span>↕</span> drag the laptop
          </div>
          <svg
            ref={sceneRef}
            className="scene"
            viewBox="0 0 640 560"
            role="img"
            aria-label="Side view of a seated skeleton. The neck bends as the screen gets lower, and the load on the neck rises."
          >
            <defs>
              <filter id="nl-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <marker
                id="nl-arrow"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M0 0 L10 5 L0 10 z" fill="#d9534f" />
              </marker>
              <pattern
                id="nl-grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M20 0H0V20"
                  fill="none"
                  stroke="#1d1d1d"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="640" height="560" fill="url(#nl-grid)" />
            <g
              ref={gRef}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG markup built by neckModel from constants, no user input
              dangerouslySetInnerHTML={{ __html: first.r.svg }}
            />
          </svg>
        </div>
        <div className="side">
          <div>
            <div className="label">Load on your neck</div>
            <div className="big">
              <span ref={kgRef}>{String(first.r.kg)}</span>
              <small>kg</small>
            </div>
          </div>
          <div className="verdict" ref={verdictRef}>
            {first.r.verdict}
          </div>
          <div className="stats">
            <div className="stat">
              <div className="label">Head angle</div>
              <div
                className="v"
                ref={angRef}
              >{`${Math.round(first.r.effAng)}°`}</div>
            </div>
            <div className="stat">
              <div className="label">Lever arm</div>
              <div
                className="v"
                ref={leverRef}
              >{`${first.r.leverCm.toFixed(1)} cm`}</div>
            </div>
          </div>
          <div>
            <div className="label">Modelled load by angle</div>
            <svg
              ref={chartRef}
              className="chart"
              viewBox="0 0 220 110"
              aria-hidden="true"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: chart markup built by drawChart from constants, no user input
              dangerouslySetInnerHTML={{ __html: first.chart }}
            />
          </div>
        </div>
        <div className="controls">
          <div className="row">
            <label htmlFor={tiltId}>Head angle</label>
            <input
              ref={tiltRef}
              id={tiltId}
              type="range"
              min={0}
              max={60}
              step={1}
              defaultValue={45}
            />
            <span className="deg" ref={tiltvRef}>
              45°
            </span>
          </div>
        </div>
      </figure>

      <section className="fix">
        <div className="copy">
          <h2>
            The ten-second fix: <em>the chin tuck</em>
          </h2>
          <p>
            Forward-head posture lengthens the small muscles at the front of
            your neck until they stop helping. The chin tuck wakes them up and
            puts the head back over the spine.
          </p>
          <div className="row">
            <button
              ref={goRef}
              type="button"
              className={running ? "ghost" : undefined}
            >
              {running ? "Stop" : IDLE_LABEL}
            </button>
            <span className="coach" aria-live="polite">
              {coach.pre}
              {coach.b !== undefined ? <b>{coach.b}</b> : null}
              {coach.post}
            </span>
          </div>
        </div>
        <ol className="steps">
          {STEPS.map((text, k) => (
            <li key={text} className={active === k ? "on" : undefined}>
              {text}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
