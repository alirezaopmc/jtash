import { useEffect, useRef } from "react";

interface EducationItem {
  number: string;
  label: string;
  degree: string;
  department?: string;
  place: string;
  period: string;
  title: string;
  detail: string;
  color: string;
  logo: string;
  marks: string[];
}

const foundation: EducationItem[] = [
  {
    number: "01",
    label: "Research",
    degree: "M.Sc. · Computer Engineering",
    department: "Algorithms & Computation",
    place: "University of Tehran",
    period: "Sep 2024 — Present",
    title: "Interpreting neural network thoughts.",
    detail:
      "Algorithms and Computation, focusing on mechanistic interpretability, Sparse Autoencoders (SAEs), and hallucination mitigation in large language models. Investigating how dense polysemantic representations decompose into monosemantic latent dictionary features, and how steering vectors intervene in the residual stream to anchor model reasoning.",
    color: "var(--color-clarity)",
    logo: "/logos/education/ut.svg",
    marks: [
      "Mechanistic Interpretability",
      "Sparse Autoencoders (SAE)",
      "Residual Stream Steering",
      "Hallucination Circuits",
      "Algorithms & Computation",
    ],
  },
  {
    number: "02",
    label: "Systems",
    degree: "B.Sc. · Computer Engineering",
    department: "Department of Computer Engineering",
    place: "Babol Noshirvani University of Technology",
    period: "Sep 2018 — Aug 2024",
    title: "Ten million IDs per second, per node.",
    detail:
      "Designed and benchmarked a collision-free 128-bit distributed ID generation architecture sustaining 10,000,000 IDs/sec per node with zero lock contention. Built in Go and RabbitMQ, packing nanosecond epoch timestamps, dynamic node leases, and monotonic sequence counters with automatic cluster coordination.",
    color: "var(--color-trust)",
    logo: "/logos/education/banut.png",
    marks: [
      "Go 1.22+",
      "Distributed Systems",
      "RabbitMQ Coordination",
      "128-Bit Monotonic IDs",
      "Lock-Free Concurrency",
      "10M IDs/sec",
    ],
  },
];

export function Education({ onVisible }: { onVisible?: () => void }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current || !onVisible) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onVisible(),
      {
        threshold: 0.25,
      },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <section
      ref={ref}
      id="education"
      className="relative px-5 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Section Header */}
        <div className="text-[11px] tracking-[0.14em] text-trust uppercase font-mono">
          03 · Foundation
        </div>
        <div className="mt-3 grid gap-6 border-b border-white/10 pb-8 md:grid-cols-[1fr_.8fr] md:items-end">
          <h2 className="text-[clamp(2rem,5vw,4rem)] leading-[1.02] font-bold tracking-[-0.045em] text-fg">
            Education is where I learned to ask better questions.
          </h2>
          <p className="text-[13px] leading-relaxed text-muted md:text-[15px]">
            Research explains what we do not understand. Systems make the
            explanation survive reality.
          </p>
        </div>

        {/* Education Rows: One education per full-width row */}
        <div className="mt-10 flex flex-col gap-6 md:gap-8">
          {foundation.map((item) => (
            <article
              key={item.number}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-panel/60 p-6 md:p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-panel/80"
            >
              {/* Accent top stripe */}
              <div
                className="absolute inset-x-0 top-0 h-[2px] transition-all duration-500"
                style={{ background: item.color }}
              />

              {/* Header row: Track & period */}
              <div className="flex items-center justify-between text-[11px] tracking-[0.15em] uppercase font-mono">
                <span
                  className="font-bold flex items-center gap-2"
                  style={{ color: item.color }}
                >
                  <span
                    className="size-2 rounded-[2px]"
                    style={{ background: item.color }}
                  />
                  {item.number} · {item.label}
                </span>
                <span className="text-dim">{item.period}</span>
              </div>

              {/* Institution and Degree info */}
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-2 border border-white/15 shadow-sm">
                    <img
                      src={item.logo}
                      alt={`${item.place} logo`}
                      className="size-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-fg tracking-tight leading-snug md:text-xl">
                      {item.degree}
                    </h3>
                    {item.department && (
                      <p className="text-[13px] font-medium text-clarity/90 mt-0.5">
                        {item.department}
                      </p>
                    )}
                    <p className="text-[12px] text-muted mt-0.5 font-medium">
                      {item.place}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thesis Title */}
              <div className="mt-6">
                <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-dim">
                  Thesis & Research Focus
                </span>
                <h4 className="mt-1 text-[clamp(1.2rem,1.8vw,1.5rem)] leading-snug font-bold tracking-tight text-fg">
                  {item.title}
                </h4>
              </div>

              {/* Detail Narrative */}
              <p className="mt-3 text-[13px] leading-relaxed text-fg/80 md:text-[14px]">
                {item.detail}
              </p>

              {/* Topic / Technology Tags */}
              <div className="mt-6 flex flex-wrap gap-1.5 pt-5 border-t border-white/[0.07]">
                {item.marks.map((mark) => (
                  <span
                    key={mark}
                    className="rounded-[5px] border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-muted font-mono"
                  >
                    {mark}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Section Footer */}
        <div className="mt-8 flex items-center justify-between text-[11px] text-dim font-mono">
          <span>research → systems</span>
          <span className="text-trust">foundation: active & compiled</span>
        </div>
      </div>
    </section>
  );
}
