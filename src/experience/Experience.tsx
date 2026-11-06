import { useEffect, useRef, useState } from "react";
import {
  activeInMonth,
  type Experience as ExperienceType,
  experiences,
  timelineColumns,
} from "./data";
import { CountryBadge, ToolIcon } from "./icons";

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

function getCellBackground(
  activeExperiences: ExperienceType[],
  selectedId: string,
) {
  if (activeExperiences.length === 0) {
    return "rgba(255, 255, 255, 0.035)";
  }

  const getColor = (exp: ExperienceType) => {
    const isActive = exp.id === selectedId;
    return isActive
      ? exp.color
      : `color-mix(in srgb, ${exp.color} 26%, #1c1c1f)`;
  };

  if (activeExperiences.length === 1) {
    return getColor(activeExperiences[0]);
  }

  // Split cell for overlapping roles in the same month
  const c1 = getColor(activeExperiences[0]);
  const c2 = getColor(activeExperiences[activeExperiences.length - 1]);
  return `linear-gradient(135deg, ${c1} 0 48%, ${c2} 52% 100%)`;
}

function RoleCard({
  experience,
  isActive,
}: {
  experience: ExperienceType;
  isActive: boolean;
}) {
  return (
    <article
      id={`exp-${experience.id}`}
      className={`scroll-mt-52 relative overflow-hidden rounded-xl border transition-all duration-300 ${
        isActive
          ? "border-white/20 bg-panel/90 shadow-2xl ring-1 ring-white/10"
          : "border-white/[0.07] bg-panel/50 opacity-80 hover:opacity-100 hover:border-white/15"
      }`}
    >
      <div
        className="absolute inset-y-0 left-0 w-1 transition-all duration-300"
        style={{
          background: experience.color,
          opacity: isActive ? 1 : 0.4,
          boxShadow: isActive ? `0 0 12px ${experience.color}` : "none",
        }}
      />
      <div className="p-5 pl-6 md:p-7 md:pl-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <CompanyLogo experience={experience} />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] tracking-[0.14em] text-muted uppercase font-mono">
                {experience.period}
              </p>
              <h3 className="mt-1 break-words text-[clamp(1.2rem,2vw,1.55rem)] leading-tight font-bold tracking-tight text-fg">
                {experience.role}
              </h3>
              <p className="mt-1 text-[13px] font-medium text-fg/90">
                {experience.company}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <CountryBadge
              country={experience.country}
              location={experience.location}
            />
            {experience.mode && (
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-muted">
                {experience.mode}
              </span>
            )}
          </div>
        </div>

        <p className="mt-5 text-[13px] leading-relaxed text-fg/80 md:text-[14px]">
          {experience.summary}
        </p>

        <div className="mt-6">
          <p className="mb-3 text-[10px] tracking-[0.18em] text-dim uppercase font-mono">
            Selected outcomes
          </p>
          <ul className="space-y-2.5">
            {experience.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex gap-3 text-[12px] leading-relaxed text-muted md:text-[13px]"
              >
                <span
                  className="font-bold shrink-0"
                  style={{ color: experience.color }}
                >
                  →
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap gap-1.5 border-t border-white/[0.07] pt-5">
          {experience.tools.map((tool) => (
            <span
              key={tool}
              className="inline-flex items-center gap-1.5 rounded-[5px] border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-mono text-muted transition-colors hover:border-white/20 hover:text-fg"
            >
              <ToolIcon name={tool} className="size-3.5 shrink-0" />
              <span>{tool}</span>
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function Experience({ onVisible }: { onVisible?: () => void }) {
  const [selectedId, setSelectedId] = useState(experiences[0].id);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const isManualScrolling = useRef(false);
  const manualScrollTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const scrollToExperience = (id: string) => {
    setSelectedId(id);
    isManualScrolling.current = true;
    clearTimeout(manualScrollTimeout.current);
    manualScrollTimeout.current = setTimeout(() => {
      isManualScrolling.current = false;
    }, 850);

    const el = cardRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Section visibility for parent navigation
  useEffect(() => {
    if (!sectionRef.current || !onVisible) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onVisible(),
      {
        threshold: 0.15,
      },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [onVisible]);

  // Scroll spy to update active experience in sticky timeline bar
  useEffect(() => {
    const handleScroll = () => {
      if (isManualScrolling.current) return;

      const triggerY = 220;
      let currentId = experiences[0].id;
      let hasMatch = false;
      let closestDist = Infinity;
      let closestId = experiences[0].id;

      for (const exp of experiences) {
        const el = cardRefs.current[exp.id];
        if (!el) continue;
        const rect = el.getBoundingClientRect();

        if (rect.top <= triggerY + 60 && rect.bottom >= triggerY) {
          currentId = exp.id;
          hasMatch = true;
          break;
        }

        const dist = Math.abs(rect.top - triggerY);
        if (dist < closestDist) {
          closestDist = dist;
          closestId = exp.id;
        }
      }

      setSelectedId(hasMatch ? currentId : closestId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative px-5 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Section Header */}
        <div className="border-b border-white/10 pb-6 mb-8">
          <div className="text-[11px] tracking-[0.14em] text-claude uppercase font-mono">
            02 · Work
          </div>
          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold tracking-[-0.045em] text-fg">
                Experience timeline.
              </h2>
              <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-muted md:text-[15px]">
                Every cell is one month. Select a company or scroll through to
                inspect the work behind it.
              </p>
            </div>
            <p className="text-[11px] font-mono text-dim">
              month by month · 2016 → 2026
            </p>
          </div>
        </div>

        {/* Sticky Compact Timeline Bar */}
        <div className="sticky top-14 z-20 mb-10 w-full">
          <div className="w-full rounded-2xl border border-white/10 bg-void/85 p-3.5 backdrop-blur-md shadow-2xl transition-all md:p-4">
            {/* Header / Company Quick Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
              <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                {experiences.map((exp) => {
                  const isActive = exp.id === selectedId;
                  return (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => scrollToExperience(exp.id)}
                      className={`group flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mono transition-all md:text-[12px] ${
                        isActive
                          ? "bg-white/[0.09] text-fg shadow-sm ring-1 ring-white/20"
                          : "text-muted hover:bg-white/[0.04] hover:text-fg"
                      }`}
                    >
                      <span
                        className="size-2 rounded-full transition-transform group-hover:scale-125"
                        style={{
                          background: exp.color,
                          boxShadow: isActive ? `0 0 8px ${exp.color}` : "none",
                          opacity: isActive ? 1 : 0.6,
                        }}
                      />
                      <span className="font-medium">{exp.company}</span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden text-[10px] text-dim sm:flex items-center gap-3">
                <span className="font-mono">2016 → 2026</span>
                <span>·</span>
                <span>click month or tag to jump</span>
              </div>
            </div>

            {/* Calendar Matrix: Fills full width, compact height */}
            <div className="no-scrollbar mt-3 overflow-x-auto pb-1">
              <div className="flex min-w-[580px] md:min-w-0 w-full items-stretch gap-1 md:gap-1.5">
                {timelineColumns.map((col, colIdx) => {
                  if (col.type === "separator") {
                    return (
                      <div
                        key={`sep-${colIdx}`}
                        className="flex w-6 shrink-0 flex-col items-center justify-between px-0.5 select-none md:w-8"
                        title="2018 — 2020: Academic Study / Gap"
                      >
                        <div className="flex h-full flex-col items-center justify-center gap-1.5 py-1">
                          <span className="size-1 rounded-full bg-white/20" />
                          <span className="size-1 rounded-full bg-white/20" />
                          <span className="size-1 rounded-full bg-white/20" />
                        </div>
                        <span className="mt-1 text-[9px] font-mono text-dim md:text-[10px]">
                          ···
                        </span>
                      </div>
                    );
                  }

                  const year = col.year;
                  const months = Array.from({ length: 12 }, (_, i) => i + 1);

                  return (
                    <div
                      key={year}
                      className="flex flex-1 min-w-0 flex-col items-center"
                    >
                      {/* jtash calendar model: 2 columns x 6 rows (months 1-6 left, 7-12 right) */}
                      <div className="grid w-full grid-flow-col grid-cols-2 grid-rows-6 gap-0.5 md:gap-1">
                        {months.map((month) => {
                          const active = experiences.filter((exp) =>
                            activeInMonth(exp, year, month),
                          );
                          const hasActive = active.length > 0;
                          const isCurrentRoleActive = active.some(
                            (exp) => exp.id === selectedId,
                          );

                          const bg = getCellBackground(active, selectedId);
                          const monthName = new Date(
                            year,
                            month - 1,
                          ).toLocaleString("en", {
                            month: "short",
                          });

                          return (
                            <button
                              key={`${year}-${month}`}
                              type="button"
                              disabled={!hasActive}
                              onClick={() =>
                                hasActive &&
                                scrollToExperience(active[active.length - 1].id)
                              }
                              title={`${monthName} ${year}${
                                hasActive
                                  ? `: ${active.map((e) => e.company).join(" + ")}`
                                  : ""
                              }`}
                              aria-label={`${monthName} ${year}${
                                hasActive
                                  ? `: ${active.map((e) => e.company).join(" + ")}`
                                  : ""
                              }`}
                              className={`h-2.5 sm:h-3 md:h-3.5 w-full rounded-[2px] border transition-all ${
                                !hasActive
                                  ? "cursor-default border-white/[0.03]"
                                  : isCurrentRoleActive
                                    ? "cursor-pointer border-white/40 ring-1 ring-white/30 brightness-110 scale-[1.04] z-10"
                                    : "cursor-pointer border-white/[0.06] hover:brightness-125 hover:scale-105"
                              }`}
                              style={{
                                background: bg,
                                boxShadow:
                                  isCurrentRoleActive && hasActive
                                    ? `0 0 6px ${
                                        active.find((e) => e.id === selectedId)
                                          ?.color ?? active[0].color
                                      }77`
                                    : undefined,
                              }}
                            />
                          );
                        })}
                      </div>

                      {/* Year label below */}
                      <span
                        className={`mt-1.5 text-[9px] font-mono tracking-wider transition-colors md:text-[10px] ${
                          experiences.some(
                            (e) =>
                              e.id === selectedId &&
                              months.some((m) => activeInMonth(e, year, m)),
                          )
                            ? "font-bold text-fg"
                            : "text-muted"
                        }`}
                      >
                        {year}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Stacked Job Cards Below Timeline */}
        <div className="space-y-6">
          {experiences.map((experience) => (
            <div
              key={experience.id}
              ref={(el) => {
                cardRefs.current[experience.id] = el;
              }}
            >
              <RoleCard
                experience={experience}
                isActive={selectedId === experience.id}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
