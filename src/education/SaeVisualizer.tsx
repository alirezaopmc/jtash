import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Eye,
  Layers,
  RotateCcw,
  Sliders,
  Sparkles,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";

interface Feature {
  id: string;
  name: string;
  category: string;
  description: string;
  baseActivation: number;
  directionVector: string;
  steeredToken: string;
  steeredProb: number;
  baselineToken: string;
  baselineProb: number;
  ablatedToken: string;
  ablatedProb: number;
  steeredOutput: string;
  baselineOutput: string;
  ablatedOutput: string;
}

const SAE_FEATURES: Feature[] = [
  {
    id: "f_4091",
    name: "Factual Grounding Circuit",
    category: "Hallucination Mitigation",
    description:
      "Anchors generation to parametric knowledge, dampening confabulation in long-tail factual queries.",
    baseActivation: 0.82,
    directionVector: "v_4091 ∈ ℝ⁴⁰⁹⁶",
    steeredToken: "Gustave Eiffel (1889)",
    steeredProb: 98.4,
    baselineToken: "Leonardo da Vinci (1502)",
    baselineProb: 54.2,
    ablatedToken: "Ancient Roman Guilds",
    ablatedProb: 76.1,
    steeredOutput:
      "The Eiffel Tower was engineered by Gustave Eiffel's firm for the 1889 Exposition Universelle in Paris.",
    baselineOutput:
      "The Eiffel Tower was designed by Leonardo da Vinci during his Parisian residency in 1502.",
    ablatedOutput:
      "The iron tower was conceived in archaic times by ancient European stone and metallurgy guilds.",
  },
  {
    id: "f_1822",
    name: "Algorithmic Invariant Verifier",
    category: "Reasoning & Formal Logic",
    description:
      "Monitors loop invariants and mathematical induction steps during step-by-step reasoning tokens.",
    baseActivation: 0.74,
    directionVector: "v_1822 ∈ ℝ⁴⁰⁹⁶",
    steeredToken: "Invariant holds for k < n",
    steeredProb: 96.8,
    baselineToken: "Result is roughly 42 or 45",
    baselineProb: 48.0,
    ablatedToken: "Random guess: 100",
    ablatedProb: 62.5,
    steeredOutput:
      "Base case P(0) verified. By induction hypothesis, ∀k < n, invariant holds. Complexity is strictly O(n log n).",
    baselineOutput:
      "The loop iterates several times, so the outcome is approximately 42, though it might be 45.",
    ablatedOutput:
      "The calculation skips intermediate steps and jumps directly to a speculative constant.",
  },
  {
    id: "f_7310",
    name: "Epistemic Uncertainty Gate",
    category: "Calibration & Safety",
    description:
      "Detects low-confidence latent states and enforces explicit refusal bounds instead of fabricated answers.",
    baseActivation: 0.68,
    directionVector: "v_7310 ∈ ℝ⁴⁰⁹⁶",
    steeredToken: "I don't have sufficient data",
    steeredProb: 94.2,
    baselineToken: "Confirmed without proof",
    baselineProb: 61.5,
    ablatedToken: "Falsely confident claim",
    ablatedProb: 88.0,
    steeredOutput:
      "I cannot confirm this claim: empirical evidence is unverified (confidence score < 0.15).",
    baselineOutput:
      "This event definitely occurred and is widely accepted across contemporary historical consensus.",
    ablatedOutput:
      "It is an established and indisputable fact that this occurred with absolute certainty.",
  },
];

export function SaeVisualizer() {
  const [selectedFeature, setSelectedFeature] = useState<Feature>(
    SAE_FEATURES[0],
  );
  const [alpha, setAlpha] = useState<number>(2.0);
  const [isIntervening, setIsIntervening] = useState<boolean>(true);
  const clipId = useId();

  // Effective steering strength
  const effectiveAlpha = isIntervening ? alpha : 0;

  // Compute live output state based on alpha
  const isAblated = effectiveAlpha < -0.5;
  const isSteered = effectiveAlpha > 0.5;

  const currentToken = isSteered
    ? selectedFeature.steeredToken
    : isAblated
      ? selectedFeature.ablatedToken
      : selectedFeature.baselineToken;

  const currentProb = isSteered
    ? selectedFeature.steeredProb
    : isAblated
      ? selectedFeature.ablatedProb
      : selectedFeature.baselineProb;

  const currentOutput = isSteered
    ? selectedFeature.steeredOutput
    : isAblated
      ? selectedFeature.ablatedOutput
      : selectedFeature.baselineOutput;

  // Activation value of the selected feature scaled by intervention
  const activeMagnitude = Math.min(
    1,
    Math.max(
      0.05,
      selectedFeature.baseActivation * (1 + effectiveAlpha * 0.35),
    ),
  );

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-white/10 bg-void/90 p-4 sm:p-6 text-fg font-mono text-xs">
      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-clarity opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-clarity" />
          </span>
          <span className="font-semibold tracking-wider uppercase text-clarity">
            SAE Latent Intervention
          </span>
          <span className="text-dim">|</span>
          <span className="text-muted">Layer 16 Residual Stream</span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="rounded bg-white/5 px-2 py-0.5 text-muted border border-white/10">
            d = 4096
          </span>
          <span className="text-dim">→</span>
          <span className="rounded bg-clarity/10 px-2 py-0.5 text-clarity border border-clarity/30 font-semibold">
            M = 32,768 (Sparse)
          </span>
        </div>
      </div>

      {/* Feature Selector Tabs */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <Eye className="size-3.5 text-clarity" />
            <span>Select Monosemantic Latent Feature (Top-K Sparsity):</span>
          </span>
          <span className="text-[10px] text-dim">k=32 active / 32,768</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAE_FEATURES.map((feature) => {
            const isSelected = selectedFeature.id === feature.id;
            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => setSelectedFeature(feature)}
                className={`flex flex-col items-start gap-1 p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? "border-clarity bg-clarity/10 text-fg shadow-[0_0_15px_rgba(229,192,75,0.15)]"
                    : "border-white/10 bg-white/[0.02] text-muted hover:border-white/25 hover:text-fg"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-[11px] text-clarity">
                    {feature.id}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-dim border border-white/10">
                    {feature.category.split(" ")[0]}
                  </span>
                </div>
                <div className="font-sans font-medium text-xs text-fg leading-tight">
                  {feature.name}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-dim mt-0.5">
                  <span>act: {(feature.baseActivation * 100).toFixed(0)}%</span>
                  <span>•</span>
                  <span>{feature.directionVector}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Diagram: Transformer Residual Stream + SAE Encoder/Decoder Intervention Loop */}
      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/40 p-3 sm:p-4">
        <div className="absolute top-2 right-2 text-[10px] text-dim font-mono z-10 flex items-center gap-2">
          <span>Formula:</span>
          <span className="text-clarity bg-clarity/10 px-1.5 py-0.5 rounded border border-clarity/20">
            x̂ = x + α · v_k
          </span>
        </div>

        <svg
          viewBox="0 0 680 230"
          className="w-full h-auto select-none"
          style={{ minHeight: "170px" }}
        >
          <defs>
            {/* Gradients */}
            <linearGradient
              id={`${clipId}-streamGrad`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.8" />
              <stop
                offset="100%"
                stopColor={isSteered ? "#e5c04b" : "#38bdf8"}
                stopOpacity="0.9"
              />
            </linearGradient>

            <linearGradient
              id={`${clipId}-saeGrad`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#e5c04b" stopOpacity="0.8" />
            </linearGradient>

            {/* Filter for glow */}
            <filter
              id={`${clipId}-glow`}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid Accent */}
          <g stroke="rgba(255,255,255,0.04)" strokeWidth="1">
            <line x1="0" y1="40" x2="680" y2="40" />
            <line x1="0" y1="115" x2="680" y2="115" />
            <line x1="0" y1="190" x2="680" y2="190" />
            <line x1="120" y1="0" x2="120" y2="230" />
            <line x1="280" y1="0" x2="280" y2="230" />
            <line x1="440" y1="0" x2="440" y2="230" />
            <line x1="580" y1="0" x2="580" y2="230" />
          </g>

          {/* Main Residual Stream Pipe */}
          <rect
            x="40"
            y="105"
            width="600"
            height="20"
            rx="10"
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.5"
          />

          {/* Flowing Residual Vector Line */}
          <line
            x1="50"
            y1="115"
            x2="630"
            y2="115"
            stroke={`url(#${clipId}-streamGrad)`}
            strokeWidth="3.5"
            strokeDasharray="8 4"
          />

          {/* Animated Flow Particles */}
          <motion.circle
            cx="60"
            cy="115"
            r="4.5"
            fill="#38bdf8"
            animate={{ cx: [60, 620] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
          />
          <motion.circle
            cx="180"
            cy="115"
            r="3.5"
            fill="#818cf8"
            animate={{ cx: [60, 620] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "linear",
              delay: 0.9,
            }}
          />
          <motion.circle
            cx="320"
            cy="115"
            r="4"
            fill={isSteered ? "#e5c04b" : "#38bdf8"}
            animate={{ cx: [60, 620] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "linear",
              delay: 1.8,
            }}
          />

          {/* Labels for Residual Stream */}
          <text
            x="50"
            y="98"
            fill="#8a8a8a"
            fontSize="10"
            fontFamily="monospace"
          >
            Residual x ∈ ℝ⁴⁰⁹⁶
          </text>
          <text
            x="50"
            y="142"
            fill="#575757"
            fontSize="9"
            fontFamily="monospace"
          >
            Layer 16 Input
          </text>

          {/* SAE Encoder Tap (Branching off residual stream upward) */}
          <path
            d="M 210 115 L 210 52 Q 210 42 225 42 L 270 42"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          <circle cx="210" cy="115" r="4" fill="#38bdf8" />
          <text
            x="175"
            y="75"
            fill="#38bdf8"
            fontSize="9"
            fontFamily="monospace"
          >
            Tap x
          </text>

          {/* SAE Encoder Box */}
          <g transform="translate(270, 20)">
            <rect
              width="135"
              height="44"
              rx="6"
              fill="#141414"
              stroke="#e5c04b"
              strokeWidth="1.5"
              filter={isSteered ? `url(#${clipId}-glow)` : undefined}
            />
            <text
              x="10"
              y="18"
              fill="#e5c04b"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              SAE Encoder W_enc
            </text>
            <text
              x="10"
              y="32"
              fill="#8a8a8a"
              fontSize="8.5"
              fontFamily="monospace"
            >
              f = ReLU(W_enc · x + b)
            </text>
          </g>

          {/* Latent Feature Bank Representation (Sparse Nodes) */}
          <g transform="translate(425, 12)">
            {/* Inactive sparse features */}
            {[0, 1, 2, 4, 5].map((idx) => (
              <g key={idx} transform={`translate(${idx * 13}, 0)`}>
                <rect
                  x="0"
                  y="20"
                  width="7"
                  height="26"
                  rx="3"
                  fill="rgba(255,255,255,0.05)"
                  stroke="rgba(255,255,255,0.15)"
                />
                <circle cx="3.5" cy="40" r="1.5" fill="#575757" />
              </g>
            ))}

            {/* Selected Active Feature (Indexed node) */}
            <g transform="translate(39, 0)">
              <rect
                x="0"
                y="5"
                width="14"
                height="45"
                rx="4"
                fill="rgba(229,192,75,0.2)"
                stroke="#e5c04b"
                strokeWidth="2"
                filter={`url(#${clipId}-glow)`}
              />
              <motion.rect
                x="2"
                y="5"
                width="10"
                height={45 * activeMagnitude}
                rx="2"
                fill="#e5c04b"
                animate={{ height: 45 * activeMagnitude }}
                transition={{ duration: 0.3 }}
              />
              <text
                x="-4"
                y="62"
                fill="#e5c04b"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {selectedFeature.id}
              </text>
            </g>

            <text
              x="85"
              y="24"
              fill="#8a8a8a"
              fontSize="9"
              fontFamily="monospace"
            >
              Sparse Latents
            </text>
            <text
              x="85"
              y="38"
              fill="#575757"
              fontSize="8"
              fontFamily="monospace"
            >
              M = 32k features
            </text>
          </g>

          {/* Steering Vector Injection Arc (Downward from SAE back into stream) */}
          <path
            d="M 464 68 L 464 165 Q 464 185 490 185 L 525 185 Q 545 185 545 140 L 545 125"
            fill="none"
            stroke={effectiveAlpha !== 0 ? "#e5c04b" : "rgba(255,255,255,0.2)"}
            strokeWidth={effectiveAlpha !== 0 ? "2.5" : "1.5"}
            strokeDasharray={effectiveAlpha !== 0 ? "6 3" : "3 3"}
          />

          {/* Steering Multiplier Badge */}
          <g transform="translate(475, 172)">
            <rect
              width="60"
              height="24"
              rx="4"
              fill="#0c0c0c"
              stroke={
                isSteered
                  ? "#e5c04b"
                  : isAblated
                    ? "#d9534f"
                    : "rgba(255,255,255,0.2)"
              }
              strokeWidth="1.2"
            />
            <text
              x="30"
              y="16"
              textAnchor="middle"
              fill={isSteered ? "#e5c04b" : isAblated ? "#d9534f" : "#8a8a8a"}
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              α ={" "}
              {effectiveAlpha > 0
                ? `+${effectiveAlpha.toFixed(1)}`
                : effectiveAlpha.toFixed(1)}
            </text>
          </g>

          {/* Injection Adder Node (+) on Residual Stream */}
          <circle
            cx="545"
            cy="115"
            r="11"
            fill="#141414"
            stroke={effectiveAlpha !== 0 ? "#e5c04b" : "#818cf8"}
            strokeWidth="2"
            filter={effectiveAlpha !== 0 ? `url(#${clipId}-glow)` : undefined}
          />
          <text
            x="545"
            y="119"
            textAnchor="middle"
            fill={effectiveAlpha !== 0 ? "#e5c04b" : "#818cf8"}
            fontSize="12"
            fontWeight="bold"
            fontFamily="monospace"
          >
            +
          </text>

          {/* Steered Output Vector Label */}
          <text
            x="570"
            y="98"
            fill={isSteered ? "#e5c04b" : "#8a8a8a"}
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            x̂ = x + α·v
          </text>
          <text
            x="570"
            y="142"
            fill="#575757"
            fontSize="9"
            fontFamily="monospace"
          >
            → Next Layer
          </text>
        </svg>
      </div>

      {/* Interactive Intervention Controls: Slider & Quick Modes */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-lg bg-white/[0.03] p-3 border border-white/10">
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor="alpha-slider"
              className="flex items-center gap-1.5 font-semibold text-fg text-xs"
            >
              <Sliders className="size-3.5 text-clarity" />
              <span>Steering Coefficient (α):</span>
            </label>
            <span
              className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${
                isSteered
                  ? "bg-clarity/20 text-clarity border border-clarity/40"
                  : isAblated
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : "bg-white/10 text-muted border border-white/15"
              }`}
            >
              {effectiveAlpha > 0
                ? `+${effectiveAlpha.toFixed(1)}`
                : effectiveAlpha.toFixed(1)}
              {isSteered
                ? " (Amplified)"
                : isAblated
                  ? " (Ablated)"
                  : " (Baseline)"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-red-400 font-mono">-2.0</span>
            <input
              id="alpha-slider"
              type="range"
              min="-2.0"
              max="3.0"
              step="0.5"
              value={effectiveAlpha}
              onChange={(e) => {
                setAlpha(parseFloat(e.target.value));
                setIsIntervening(true);
              }}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-white/20 accent-[#e5c04b]"
            />
            <span className="text-[10px] text-clarity font-mono">+3.0</span>
          </div>
        </div>

        {/* Quick Preset Buttons */}
        <div className="flex items-center gap-1.5 sm:border-l sm:border-white/10 sm:pl-4">
          <button
            type="button"
            onClick={() => {
              setAlpha(-1.5);
              setIsIntervening(true);
            }}
            className={`px-2 py-1 rounded text-[11px] border transition-colors ${
              effectiveAlpha === -1.5
                ? "border-red-400 bg-red-500/20 text-red-300"
                : "border-white/10 bg-white/5 text-muted hover:text-fg"
            }`}
          >
            Ablate
          </button>
          <button
            type="button"
            onClick={() => {
              setAlpha(0);
              setIsIntervening(false);
            }}
            className={`px-2 py-1 rounded text-[11px] border transition-colors ${
              effectiveAlpha === 0
                ? "border-white/30 bg-white/20 text-fg"
                : "border-white/10 bg-white/5 text-muted hover:text-fg"
            }`}
          >
            Baseline
          </button>
          <button
            type="button"
            onClick={() => {
              setAlpha(2.0);
              setIsIntervening(true);
            }}
            className={`px-2.5 py-1 rounded text-[11px] border transition-colors font-semibold ${
              effectiveAlpha === 2.0
                ? "border-clarity bg-clarity/20 text-clarity"
                : "border-clarity/30 bg-clarity/10 text-clarity hover:bg-clarity/20"
            }`}
          >
            Steer (+2.0)
          </button>
        </div>
      </div>

      {/* Downstream Model Generation Shift Impact Console */}
      <div className="rounded-lg border border-white/10 bg-black/60 p-3 sm:p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 text-muted font-medium">
            <Zap className="size-3.5 text-clarity" />
            <span>Downstream Generative Impact on Logits & Reasoning:</span>
          </span>
          <span className="text-[10px] text-dim">
            Softmax Token Probability
          </span>
        </div>

        {/* Probability shift meter */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-fg">
              {isSteered ? (
                <CheckCircle2 className="size-3.5 text-clarity" />
              ) : isAblated ? (
                <AlertTriangle className="size-3.5 text-red-400" />
              ) : (
                <span className="size-3.5 grid place-items-center rounded-full bg-white/10 text-[9px] text-dim">
                  •
                </span>
              )}
              <span className="font-semibold text-fg">
                Top Predicted Token:
              </span>
              <span className="text-clarity bg-clarity/10 px-1.5 py-0.2 rounded border border-clarity/20 font-mono">
                "{currentToken}"
              </span>
            </span>
            <span className="font-bold text-clarity font-mono">
              {currentProb.toFixed(1)}%
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                isSteered
                  ? "bg-clarity"
                  : isAblated
                    ? "bg-red-400"
                    : "bg-white/40"
              }`}
              initial={false}
              animate={{ width: `${currentProb}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Live Decoded Model Output */}
        <div className="rounded border border-white/10 bg-white/[0.02] p-2.5 text-[11px] leading-relaxed">
          <div className="text-[10px] text-dim uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Generated Text Sample</span>
            <span
              className={isSteered ? "text-clarity font-semibold" : "text-dim"}
            >
              {isSteered
                ? "✓ Hallucination Suppressed"
                : isAblated
                  ? "⚠ Degraded Latent"
                  : "Unsteered Base Model"}
            </span>
          </div>
          <p className="text-fg font-sans">"{currentOutput}"</p>
        </div>
      </div>
    </div>
  );
}
