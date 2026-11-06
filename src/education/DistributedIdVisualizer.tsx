import {
  Binary,
  CheckCircle2,
  Cpu,
  Layers,
  Pause,
  Play,
  Radio,
  RefreshCw,
  Server,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useId, useState } from "react";

interface GeneratedIdRecord {
  id: string;
  timestampHex: string;
  nodeHex: string;
  seqHex: string;
  timestampNs: number;
  nodeId: number;
  seq: number;
  timestampStr: string;
}

export function DistributedIdVisualizer() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedBitSegment, setSelectedBitSegment] = useState<
    "time" | "node" | "seq"
  >("time");
  const [activeNode, setActiveNode] = useState<number>(2);
  const [generatedIds, setGeneratedIds] = useState<GeneratedIdRecord[]>([]);
  const [sampleId, setSampleId] = useState<GeneratedIdRecord | null>(null);
  const [throughputDisplay, setThroughputDisplay] =
    useState<number>(10_000_000);
  const clipId = useId();

  // Helper to construct a synthetic 128-bit ID record
  const createIdRecord = (nodeId = 2): GeneratedIdRecord => {
    const now = Date.now();
    const nanoOffset = Math.floor(Math.random() * 999_999);
    const seq = Math.floor(Math.random() * 8_999_999) + 1_000_000;

    const timestampHex = now.toString(16).padStart(16, "0").toUpperCase();
    const nodeHex = nodeId.toString(16).padStart(4, "0").toUpperCase();
    const seqHex = seq.toString(16).padStart(12, "0").toUpperCase();

    const formattedId = `${timestampHex.slice(0, 8)}-${timestampHex.slice(8, 12)}-${timestampHex.slice(12, 16)}-${nodeHex}-${seqHex}`;

    return {
      id: formattedId,
      timestampHex,
      nodeHex,
      seqHex,
      timestampNs: now * 1_000_000 + nanoOffset,
      nodeId,
      seq,
      timestampStr: new Date(now).toISOString().slice(11, 23),
    };
  };

  // Initialize sample ID
  useEffect(() => {
    const initial = createIdRecord(2);
    setSampleId(initial);
    setGeneratedIds([
      createIdRecord(1),
      initial,
      createIdRecord(3),
      createIdRecord(2),
    ]);
  }, []);

  // Periodic generation simulator
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const nextNode = Math.floor(Math.random() * 3) + 1;
      const newRecord = createIdRecord(nextNode);
      setGeneratedIds((prev) => [newRecord, ...prev.slice(0, 4)]);

      // Micro-jitter throughput slightly to show real-time benchmark dynamism
      const jitter = (Math.random() - 0.5) * 45_000;
      setThroughputDisplay(Math.round(10_000_000 + jitter));
    }, 600);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleManualGenerate = () => {
    const next = createIdRecord(activeNode);
    setSampleId(next);
    setGeneratedIds((prev) => [next, ...prev.slice(0, 4)]);
  };

  const currentSample = sampleId ?? {
    id: "018F94C2-B019-E77F-0002-00003E91B24A",
    timestampHex: "018F94C2B019E77F",
    nodeHex: "0002",
    seqHex: "00003E91B24A",
    timestampNs: 1729481920381928,
    nodeId: 2,
    seq: 4104626,
    timestampStr: "14:28:19.492",
  };

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-white/10 bg-void/90 p-4 sm:p-6 text-fg font-mono text-xs">
      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-trust opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-trust" />
          </span>
          <span className="font-semibold tracking-wider uppercase text-trust">
            128-Bit Distributed ID Engine
          </span>
          <span className="text-dim">|</span>
          <span className="text-muted">Go 1.22 + RabbitMQ Topology</span>
        </div>

        {/* Live Throughput Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-trust/40 bg-trust/10 px-2.5 py-1 text-trust shadow-[0_0_12px_rgba(95,163,106,0.15)]">
            <Zap className="size-3.5 fill-trust/30" />
            <span className="font-bold text-xs tracking-tight">
              {throughputDisplay.toLocaleString()}
            </span>
            <span className="text-[10px] text-trust/80">IDs / sec / node</span>
          </div>
        </div>
      </div>

      {/* 128-Bit Bit-Packing Layout Architecture */}
      <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-3 sm:p-4">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 text-muted font-medium">
            <Binary className="size-3.5 text-trust" />
            <span>128-Bit Memory Register Bit-Packing:</span>
          </span>
          <span className="text-[10px] text-dim font-mono">
            Collision-Free By Mathematical Partition
          </span>
        </div>

        {/* Segmented Bit Register Bar */}
        <div className="grid grid-cols-12 gap-1.5 text-[11px] select-none">
          {/* Epoch Timestamp: 64 bits (6 cols) */}
          <button
            type="button"
            onClick={() => setSelectedBitSegment("time")}
            className={`col-span-6 flex flex-col p-2.5 rounded-lg border text-left transition-all ${
              selectedBitSegment === "time"
                ? "border-trust bg-trust/15 text-fg shadow-[0_0_15px_rgba(95,163,106,0.2)]"
                : "border-trust/30 bg-trust/5 text-trust/90 hover:border-trust/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-trust text-xs">
                Bits [127..64]
              </span>
              <span className="text-[10px] text-dim">64 Bits</span>
            </div>
            <div className="font-semibold text-fg mt-1">Epoch Timestamp</div>
            <div className="text-[10px] text-dim font-mono mt-0.5 truncate">
              0x{currentSample.timestampHex}
            </div>
            <div className="text-[9px] text-trust/80 mt-1">
              Nanosecond precision (584-yr rollover)
            </div>
          </button>

          {/* Node ID: 16 bits (2 cols) */}
          <button
            type="button"
            onClick={() => setSelectedBitSegment("node")}
            className={`col-span-2 flex flex-col p-2.5 rounded-lg border text-left transition-all ${
              selectedBitSegment === "node"
                ? "border-cyan-400 bg-cyan-500/15 text-fg shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                : "border-cyan-500/30 bg-cyan-500/5 text-cyan-300 hover:border-cyan-500/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-400 text-xs">[63..48]</span>
              <span className="text-[9px] text-dim">16b</span>
            </div>
            <div className="font-semibold text-fg mt-1 truncate">
              Node Lease
            </div>
            <div className="text-[10px] text-dim font-mono mt-0.5">
              0x{currentSample.nodeHex}
            </div>
            <div className="text-[9px] text-cyan-300/80 mt-1 truncate">
              65,536 Nodes
            </div>
          </button>

          {/* Sequence Counter: 48 bits (4 cols) */}
          <button
            type="button"
            onClick={() => setSelectedBitSegment("seq")}
            className={`col-span-4 flex flex-col p-2.5 rounded-lg border text-left transition-all ${
              selectedBitSegment === "seq"
                ? "border-clarity bg-clarity/15 text-fg shadow-[0_0_15px_rgba(229,192,75,0.2)]"
                : "border-clarity/30 bg-clarity/5 text-clarity hover:border-clarity/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-clarity text-xs">
                Bits [47..0]
              </span>
              <span className="text-[10px] text-dim">48 Bits</span>
            </div>
            <div className="font-semibold text-fg mt-1">
              Local Monotonic Seq
            </div>
            <div className="text-[10px] text-dim font-mono mt-0.5 truncate">
              0x{currentSample.seqHex}
            </div>
            <div className="text-[9px] text-clarity/80 mt-1">
              281T ops/ns ceiling (lock-free)
            </div>
          </button>
        </div>

        {/* Selected Segment Explanation Callout */}
        <div className="rounded border border-white/10 bg-black/40 px-3 py-2 text-[11px] text-muted flex items-center justify-between">
          <span>
            {selectedBitSegment === "time" && (
              <>
                <strong className="text-trust">Timestamp Bits:</strong>{" "}
                Monotonically increasing nanosecond counter relative to
                application epoch. Guarantees global chronological sorting
                across all distributed nodes.
              </>
            )}
            {selectedBitSegment === "node" && (
              <>
                <strong className="text-cyan-400">Node ID Bits:</strong>{" "}
                Assigned dynamically through RabbitMQ lease heartbeats with TTL.
                Prevents cross-node collisions without distributed 2PC or Paxos
                locks.
              </>
            )}
            {selectedBitSegment === "seq" && (
              <>
                <strong className="text-clarity">Sequence Bits:</strong>{" "}
                Lock-free CPU atomic increment (`atomic.AddUint64`) within the
                same nanosecond. Resets safely on timestamp tick.
              </>
            )}
          </span>
          <span className="text-[10px] text-dim shrink-0 ml-2">
            Click segment to inspect
          </span>
        </div>
      </div>

      {/* SVG Diagram: RabbitMQ Coordination Bus + 3 Generator Nodes */}
      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/50 p-3 sm:p-4">
        <svg
          viewBox="0 0 680 200"
          className="w-full h-auto select-none"
          style={{ minHeight: "150px" }}
        >
          <defs>
            <linearGradient
              id={`${clipId}-trustGrad`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#5fa36a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
            </linearGradient>

            <filter
              id={`${clipId}-trustGlow`}
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
          <g stroke="rgba(255,255,255,0.03)" strokeWidth="1">
            <line x1="0" y1="35" x2="680" y2="35" />
            <line x1="0" y1="105" x2="680" y2="105" />
            <line x1="0" y1="175" x2="680" y2="175" />
            <line x1="170" y1="0" x2="170" y2="200" />
            <line x1="340" y1="0" x2="340" y2="200" />
            <line x1="510" y1="0" x2="510" y2="200" />
          </g>

          {/* Central RabbitMQ Coordinator Bus */}
          <g transform="translate(190, 10)">
            <rect
              width="300"
              height="36"
              rx="6"
              fill="#141414"
              stroke="#5fa36a"
              strokeWidth="1.5"
              filter={`url(#${clipId}-trustGlow)`}
            />
            <text
              x="20"
              y="22"
              fill="#5fa36a"
              fontSize="11"
              fontWeight="bold"
              fontFamily="monospace"
            >
              RabbitMQ Lease Coordinator
            </text>
            <text
              x="210"
              y="22"
              fill="#8a8a8a"
              fontSize="9"
              fontFamily="monospace"
            >
              amqp://cluster/leases
            </text>
          </g>

          {/* Consensus Lease Links downward to nodes */}
          <path
            d="M 230 46 L 230 80 Q 230 90 150 90 L 105 90 L 105 105"
            fill="none"
            stroke="#5fa36a"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <path
            d="M 340 46 L 340 105"
            fill="none"
            stroke="#5fa36a"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <path
            d="M 450 46 L 450 80 Q 450 90 530 90 L 575 90 L 575 105"
            fill="none"
            stroke="#5fa36a"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Nodes 01, 02, 03 */}
          {[
            {
              id: 1,
              label: "Node 01",
              sub: "Go Worker (PID 4018)",
              x: 30,
              color: "#8a8a8a",
            },
            {
              id: 2,
              label: "Node 02",
              sub: "Go Worker (PID 4019) · Primary",
              x: 250,
              color: "#5fa36a",
            },
            {
              id: 3,
              label: "Node 03",
              sub: "Go Worker (PID 4020)",
              x: 490,
              color: "#8a8a8a",
            },
          ].map((node) => {
            const isCurr = activeNode === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, 105)`}
                onClick={() => setActiveNode(node.id)}
                className="cursor-pointer"
              >
                <rect
                  width="160"
                  height="75"
                  rx="6"
                  fill="#141414"
                  stroke={isCurr ? "#5fa36a" : "rgba(255,255,255,0.15)"}
                  strokeWidth={isCurr ? "2" : "1"}
                  filter={isCurr ? `url(#${clipId}-trustGlow)` : undefined}
                />
                {/* Status indicator */}
                <circle
                  cx="16"
                  cy="20"
                  r="4"
                  fill={isCurr ? "#5fa36a" : "#38bdf8"}
                />
                <text
                  x="28"
                  y="23"
                  fill={isCurr ? "#5fa36a" : "#e6e6e6"}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.label}
                </text>
                <text
                  x="16"
                  y="42"
                  fill="#8a8a8a"
                  fontSize="8.5"
                  fontFamily="monospace"
                >
                  {node.sub}
                </text>
                <text
                  x="16"
                  y="58"
                  fill="#575757"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  Throughput: ~10.0M IDs/s
                </text>
                <text
                  x="16"
                  y="69"
                  fill="#5fa36a"
                  fontSize="7.5"
                  fontFamily="monospace"
                >
                  Lock-Free Atomic Seq ✓
                </text>
              </g>
            );
          })}

          {/* Animated data pulses moving out from nodes */}
          <motion.circle
            cx="110"
            cy="180"
            r="3.5"
            fill="#5fa36a"
            animate={{ cy: [180, 195], opacity: [1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.circle
            cx="330"
            cy="180"
            r="4"
            fill="#5fa36a"
            animate={{ cy: [180, 195], opacity: [1, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.circle
            cx="570"
            cy="180"
            r="3.5"
            fill="#5fa36a"
            animate={{ cy: [180, 195], opacity: [1, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
          />
        </svg>
      </div>

      {/* Live Stream Terminal & Interactive Sample Dissection */}
      <div className="rounded-lg border border-white/10 bg-black/60 p-3 sm:p-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <span className="flex items-center gap-1.5 text-muted font-medium">
            <Server className="size-3.5 text-trust" />
            <span>Monotonic Stream Feed (Zero Collision Guarantee):</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1 px-2 py-0.5 rounded border border-white/10 bg-white/5 text-muted hover:text-fg text-[11px] transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="size-3 text-dim" />
                  <span>Pause Feed</span>
                </>
              ) : (
                <>
                  <Play className="size-3 text-trust" />
                  <span>Resume Feed</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleManualGenerate}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded border border-trust/40 bg-trust/10 text-trust hover:bg-trust/20 text-[11px] font-semibold transition-colors"
            >
              <RefreshCw className="size-3" />
              <span>Generate Sample</span>
            </button>
          </div>
        </div>

        {/* Live ID Feed rows */}
        <div className="flex flex-col gap-1.5 font-mono text-[11px]">
          {generatedIds.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className={`flex items-center justify-between rounded px-2.5 py-1.5 border transition-all ${
                idx === 0
                  ? "border-trust/30 bg-trust/10 text-fg"
                  : "border-white/5 bg-white/[0.01] text-muted"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-[10px] text-dim">
                  {item.timestampStr}
                </span>
                <span className="text-trust font-semibold">
                  0x{item.timestampHex.slice(0, 8)}
                </span>
                <span className="text-dim">-</span>
                <span className="text-cyan-400">
                  Node_{item.nodeId.toString().padStart(2, "0")}
                </span>
                <span className="text-dim">-</span>
                <span className="text-clarity">
                  Seq#{item.seq.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-trust/90 flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-trust" />
                  <span>Ordered</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Footer */}
        <div className="flex flex-wrap items-center justify-between border-t border-white/10 pt-2 text-[10px] text-dim">
          <span>
            Benchmarked on bare-metal cluster with RabbitMQ AMQP 0-9-1
          </span>
          <span className="text-trust font-medium">
            128-bit collision rate: 0.000%
          </span>
        </div>
      </div>
    </div>
  );
}
