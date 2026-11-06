import { useEffect, useRef } from "react";

const foundation = [
  {
    number: "01",
    label: "Research",
    degree: "M.Sc. · Computer Engineering",
    place: "University of Tehran",
    period: "Sep 2024 — Present",
    title: "Interpreting neural network thoughts.",
    detail:
      "Algorithms and Computation, with a research focus on large language models, hallucination, and mechanistic interpretability.",
    color: "var(--color-clarity)",
    logo: "/logos/education/ut.svg",
    marks: ["LLMs", "interpretability", "algorithms"],
  },
  {
    number: "02",
    label: "Systems",
    degree: "B.Sc. · Computer Engineering",
    place: "Babol Noshirvani University of Technology",
    period: "Sep 2018 — Aug 2024",
    title: "Ten million IDs per second, per node.",
    detail:
      "Designed a collision-free 128-bit distributed ID generator in Go and RabbitMQ with automatic node coordination.",
    color: "var(--color-trust)",
    logo: "/logos/education/banut.png",
    marks: ["Go", "distributed systems", "10M IDs/s"],
  },
];

export function Education({ onVisible }: { onVisible?: () => void }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current || !onVisible) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onVisible(),
      {
        threshold: 0.35,
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
        <div className="text-[11px] tracking-[0.14em] text-trust uppercase">
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

        <div className="relative mt-12 grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-2">
          {foundation.map((item) => (
            <article
              key={item.number}
              className="group relative flex min-h-[390px] flex-col bg-ink p-6 md:p-8"
            >
              <div
                className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{ background: item.color }}
              />
              <div className="flex items-center justify-between text-[10px] tracking-[0.15em] uppercase">
                <span style={{ color: item.color }}>
                  {item.number} · {item.label}
                </span>
                <span className="text-dim">{item.period}</span>
              </div>
              <div className="mt-12">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-[8px] bg-white p-1.5">
                    <img
                      src={item.logo}
                      alt={`${item.place} logo`}
                      className="size-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-[12px] text-fg">{item.degree}</p>
                    <p className="mt-1 text-[11px] text-muted">{item.place}</p>
                  </div>
                </div>
                <h3 className="mt-8 text-[clamp(1.35rem,2.4vw,2rem)] leading-tight font-bold tracking-[-0.03em] text-fg">
                  {item.title}
                </h3>
                <p className="mt-4 text-[13px] leading-relaxed text-muted">
                  {item.detail}
                </p>
              </div>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
                {item.marks.map((mark) => (
                  <span
                    key={mark}
                    className="rounded-[4px] border border-white/10 px-2 py-1 text-[10px] text-muted"
                  >
                    {mark}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between text-[10px] text-dim">
          <span>research → systems</span>
          <span className="text-trust">foundation: still compiling</span>
        </div>
      </div>
    </section>
  );
}
