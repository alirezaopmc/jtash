import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  activeInMonth,
  type Experience as ExperienceType,
  experiences,
  timelineYears,
} from "./data";

function CompanyLogo({ experience }: { experience: ExperienceType }) {
  return (
    <div
      className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-[8px] border border-white/15 bg-white p-1.5"
      title={experience.company}
    >
      <img
        src={experience.logo}
        alt={`${experience.company} logo`}
        className="size-full object-contain"
      />
    </div>
  );
}

/**
 * The jtash.ir calendar model: every year is two columns × six rows.
 * Read top-to-bottom, then left-to-right: twelve cells, one for each month.
 */
function TimelineGrid({
  selected,
  onSelect,
}: {
  selected: ExperienceType;
  onSelect: (experience: ExperienceType) => void;
}) {
  const cells = timelineYears.flatMap((year) =>
    Array.from({ length: 12 }, (_, month) => ({ year, month: month + 1 })),
  );

  return (
    <div>
      <div className="no-scrollbar overflow-x-auto pb-2">
        <div className="min-w-[590px]">
          <div
            className="grid grid-flow-col grid-rows-6 gap-1.5"
            style={{
              gridTemplateColumns: `repeat(${timelineYears.length * 2}, minmax(0, 1fr))`,
            }}
            aria-label="Monthly experience timeline"
          >
            {cells.map(({ year, month }) => {
              const active = experiences.filter((experience) =>
                activeInMonth(experience, year, month),
              );
              const background =
                active.length > 1
                  ? `linear-gradient(135deg, ${active[0].color} 0 48%, ${active[active.length - 1].color} 52% 100%)`
                  : (active[0]?.color ?? "rgba(255,255,255,.055)");
              const monthName = new Date(year, month - 1).toLocaleString("en", {
                month: "long",
              });
              return (
                <button
                  key={`${year}-${month}`}
                  type="button"
                  disabled={!active.length}
                  onClick={() =>
                    active.length && onSelect(active[active.length - 1])
                  }
                  title={`${monthName} ${year}${active.length ? `: ${active.map((item) => item.company).join(" + ")}` : ""}`}
                  className="aspect-square min-h-7 rounded-[4px] border border-white/[0.055] transition-[transform,filter,opacity] enabled:cursor-pointer enabled:hover:z-10 enabled:hover:scale-110 enabled:hover:brightness-125 md:min-h-8"
                  style={{
                    background,
                    opacity:
                      !active.length ||
                      active.some((item) => item.id === selected.id)
                        ? 1
                        : 0.78,
                  }}
                  aria-label={`${monthName} ${year}${active.length ? `, ${active.map((item) => item.company).join(" and ")}` : ", no role"}`}
                />
              );
            })}
          </div>
          <div
            className="mt-2 grid gap-3 text-[10px] text-muted"
            style={{
              gridTemplateColumns: `repeat(${timelineYears.length}, minmax(0, 1fr))`,
            }}
          >
            {timelineYears.map((year) => (
              <span key={year} className="text-center">
                {year}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/[0.07] pt-5">
        {experiences.map((experience) => (
          <button
            key={experience.id}
            type="button"
            onClick={() => onSelect(experience)}
            className={`group flex cursor-pointer items-center gap-2 text-[11px] transition-colors md:text-[12px] ${
              selected.id === experience.id
                ? "text-fg"
                : "text-muted hover:text-fg"
            }`}
          >
            <span
              className="size-3 rounded-[3px] transition-transform group-hover:scale-110"
              style={{ background: experience.color }}
            />
            {experience.company}
          </button>
        ))}
      </div>
      <p className="mt-4 text-[9px] text-dim">
        split cells mean two roles overlapped in the same month
      </p>
    </div>
  );
}

function RoleDetail({ experience }: { experience: ExperienceType }) {
  return (
    <motion.article
      key={experience.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative min-w-0 overflow-hidden rounded-xl border border-white/[0.09] bg-panel/70 lg:sticky lg:top-20"
    >
      <div
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: experience.color }}
      />
      <div className="p-5 pl-6 md:p-7 md:pl-8">
        <div className="flex min-w-0 items-start gap-4">
          <CompanyLogo experience={experience} />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] tracking-[0.12em] text-muted uppercase">
              {experience.period}
            </p>
            <h3 className="mt-1 break-words text-[clamp(1.2rem,2vw,1.55rem)] leading-tight font-bold tracking-tight text-fg">
              {experience.role}
            </h3>
            <p className="mt-2 text-[12px] leading-relaxed text-muted md:text-[13px]">
              <span className="text-fg">{experience.company}</span> ·{" "}
              {experience.location}
              {experience.mode ? ` · ${experience.mode}` : ""}
            </p>
          </div>
        </div>
        <p className="mt-6 text-[13px] leading-relaxed text-fg/80 md:text-[14px]">
          {experience.summary}
        </p>
        <div className="mt-6">
          <p className="mb-3 text-[10px] tracking-[0.18em] text-dim uppercase">
            Selected outcomes
          </p>
          <ul className="space-y-3">
            {experience.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex gap-3 text-[12px] leading-relaxed text-muted md:text-[13px]"
              >
                <span style={{ color: experience.color }}>→</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex flex-wrap gap-1.5 border-t border-white/[0.07] pt-5">
          {experience.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-[4px] border border-white/10 px-2 py-1 text-[10px] text-muted"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export function Experience({ onVisible }: { onVisible?: () => void }) {
  const [selected, setSelected] = useState(experiences[0]);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current || !onVisible) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onVisible(),
      {
        threshold: 0.3,
      },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <section
      ref={ref}
      id="experience"
      className="relative px-5 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="border-b border-white/10 pb-6">
          <div className="text-[11px] tracking-[0.14em] text-claude uppercase">
            02 · Work
          </div>
          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold tracking-[-0.045em] text-fg">
                Experience timeline.
              </h2>
              <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-muted md:text-[15px]">
                Every square is one month. Select a color to inspect the work
                behind it.
              </p>
            </div>
            <p className="text-[11px] text-dim">month by month · 2021 → now</p>
          </div>
        </div>

        <div className="mt-10 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,.75fr)] lg:items-start">
          <div className="min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.015] p-4 md:p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[10px] tracking-[0.18em] text-muted uppercase">
                Experience timeline
              </span>
              <span className="text-[10px] text-dim">
                hover a cell for the month
              </span>
            </div>
            <TimelineGrid selected={selected} onSelect={setSelected} />
          </div>
          <RoleDetail experience={selected} />
        </div>
      </div>
    </section>
  );
}
