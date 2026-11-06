import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  activeInMonth,
  type Experience as ExperienceType,
  experiences,
  timelineYears,
} from "./data";
import { CountryBadge, ToolIcon } from "./icons";

interface HoveredCellInfo {
  year: number;
  month: number;
  experiences: ExperienceType[];
  rect: DOMRect;
}

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
      className={`scroll-mt-48 md:scroll-mt-52 relative overflow-hidden rounded-xl border transition-all duration-300 ${
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
  const [hoveredCell, setHoveredCell] = useState<HoveredCellInfo | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const isManualScrolling = useRef(false);
  const manualScrollTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const activeIndex = Math.max(
    0,
    experiences.findIndex((e) => e.id === selectedId),
  );
  const activeExp = experiences[activeIndex] ?? experiences[0];

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
        threshold: 0.1,
      },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [onVisible]);

  // Scroll spy to update active experience in sticky header + clear hovered tooltip
  useEffect(() => {
    const handleScroll = () => {
      if (hoveredCell) {
        setHoveredCell(null);
      }

      if (isManualScrolling.current) return;

      const triggerY = 240;
      let currentId = experiences[0].id;
      let hasMatch = false;
      let closestDist = Infinity;
      let closestId = experiences[0].id;

      for (const exp of experiences) {
        const el = cardRefs.current[exp.id];
        if (!el) continue;
        const rect = el.getBoundingClientRect();

        if (rect.top <= triggerY + 100 && rect.bottom >= triggerY) {
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
  }, [hoveredCell]);

  return (
    <section ref={sectionRef} id="experience" className="relative">
      {/* STATIC FULL-SECTION STICKY HEADER (matching Capabilities style) */}
      <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-void/90 px-5 pt-6 pb-4 backdrop-blur-md md:px-10 md:pt-8 md:pb-5">
        <div className="mx-auto w-full max-w-[1200px]">
          {/* Row 1: Colored Squares + Section Word + Track Badge */}
          <div className="mb-2.5 flex items-center justify-between text-[12px] text-muted md:mb-3 md:text-[13px]">
            <div className="flex items-center gap-3">
              {/* Colored square indicator tabs */}
              <div
                className="flex gap-1.5"
                role="tablist"
                aria-label="Experience stages"
              >
                {experiences.map((exp, idx) => {
                  const isSelected = exp.id === selectedId;
                  const isPassedOrCurrent = idx <= activeIndex;
                  return (
                    <button
                      key={exp.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      aria-label={`${exp.company}: ${exp.role}`}
                      onClick={() => scrollToExperience(exp.id)}
                      className="group grid size-4 cursor-pointer place-items-center"
                    >
                      <span
                        className="block size-2.5 border transition-all duration-300 group-hover:scale-125 rounded-[2px]"
                        style={{
                          borderColor: exp.color,
                          background: isPassedOrCurrent
                            ? exp.color
                            : "transparent",
                          opacity: isSelected
                            ? 1
                            : idx < activeIndex
                              ? 0.45
                              : 0.6,
                          boxShadow: isSelected
                            ? `0 0 6px ${exp.color}`
                            : "none",
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              <span>
                experience ·{" "}
                <span className="font-semibold text-fg">
                  {activeExp.company}
                </span>
              </span>
            </div>

            <div className="text-[11px] tracking-[0.14em] text-claude uppercase font-mono font-bold">
              02 · Experience
            </div>
          </div>

          {/* Row 2: Title */}
          <h2 className="text-[clamp(1.7rem,4.6vw,3.9rem)] leading-[1.06] font-bold tracking-[-0.035em] text-fg">
            Experience timeline.
          </h2>

          {/* Row 3: Subtitle / Active Role + First Row of Cards (Company Chips) */}
          <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between md:mt-3">
            <p className="text-[13px] text-muted md:text-[14px]">
              <span style={{ color: activeExp.color }}>→ </span>
              {activeExp.role} · {activeExp.period} ({activeExp.location})
            </p>

            {/* First row of the Cards: Company Navigation Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar md:gap-2">
              {experiences.map((exp) => {
                const isActive = exp.id === selectedId;
                return (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => scrollToExperience(exp.id)}
                    className={`group flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mono transition-all md:text-[12px] ${
                      isActive
                        ? "bg-white/[0.12] text-fg shadow-sm ring-1 ring-white/20"
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
          </div>
        </div>

        {/* Gradient divider line at the bottom of the header */}
        <div className="absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:inset-x-10" />
      </header>

      {/* SECTION CONTENT: Timeline Matrix + Stacked Cards */}
      <div className="mx-auto max-w-[1200px] px-5 py-8 md:px-10 md:py-12">
        {/* NON-STICKY Experience Bars: Full 2016-2026 with SQUARE cells */}
        <div className="mb-10 w-full rounded-2xl border border-white/10 bg-panel/40 p-4 md:p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[10px] tracking-[0.18em] text-muted uppercase font-mono">
              Monthly Timeline Grid · 2016 → 2026
            </span>
            <div className="text-[11px] font-mono transition-colors">
              {hoveredCell ? (
                <span className="text-fg flex items-center gap-2">
                  <span className="text-muted">
                    {new Date(
                      hoveredCell.year,
                      hoveredCell.month - 1,
                    ).toLocaleString("en", {
                      month: "short",
                    })}{" "}
                    {hoveredCell.year}:
                  </span>
                  {hoveredCell.experiences.length > 0 ? (
                    hoveredCell.experiences.map((e) => (
                      <span
                        key={e.id}
                        className="font-semibold flex items-center gap-1.5"
                      >
                        <span
                          className="size-1.5 rounded-full inline-block"
                          style={{ background: e.color }}
                        />
                        <span style={{ color: e.color }}>{e.company}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-dim">No role</span>
                  )}
                </span>
              ) : (
                <span className="text-dim hidden sm:inline">
                  hover square for month & company · click to inspect
                </span>
              )}
            </div>
          </div>

          <div className="no-scrollbar overflow-x-auto pb-2">
            <div className="min-w-[720px] w-full">
              <div className="grid grid-cols-11 gap-2 md:gap-3">
                {timelineYears.map((year) => {
                  const months = Array.from({ length: 12 }, (_, i) => i + 1);

                  return (
                    <div key={year} className="flex flex-col items-center">
                      {/* 2 columns x 6 rows of perfectly square cells */}
                      <div className="grid w-full grid-flow-col grid-cols-2 grid-rows-6 gap-1">
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
                              onPointerEnter={(e) => {
                                setHoveredCell({
                                  year,
                                  month,
                                  experiences: active,
                                  rect: e.currentTarget.getBoundingClientRect(),
                                });
                              }}
                              onPointerLeave={() => setHoveredCell(null)}
                              onFocus={(e) => {
                                setHoveredCell({
                                  year,
                                  month,
                                  experiences: active,
                                  rect: e.currentTarget.getBoundingClientRect(),
                                });
                              }}
                              onBlur={() => setHoveredCell(null)}
                              aria-label={`${monthName} ${year}${
                                hasActive
                                  ? `: ${active.map((e) => e.company).join(" + ")}`
                                  : ""
                              }`}
                              className={`aspect-square w-full rounded-[2px] border transition-all ${
                                !hasActive
                                  ? "cursor-default border-white/[0.04] bg-white/[0.02]"
                                  : isCurrentRoleActive
                                    ? "cursor-pointer border-white/40 ring-1 ring-white/30 brightness-110 scale-[1.08] z-10"
                                    : "cursor-pointer border-white/[0.08] hover:brightness-125 hover:scale-105"
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
                        className={`mt-2 text-[10px] font-mono tracking-wider transition-colors ${
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

        {/* CUSTOM FLOATING TOOLTIP FOR TIMELINE CELLS */}
        <AnimatePresence>
          {hoveredCell && (
            <motion.div
              key={`${hoveredCell.year}-${hoveredCell.month}`}
              initial={{ opacity: 0, y: 6, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-xl border border-white/15 bg-ink/95 px-3.5 py-2 shadow-2xl backdrop-blur-xl"
              style={{
                left: hoveredCell.rect.left + hoveredCell.rect.width / 2,
                top: Math.max(64, hoveredCell.rect.top - 8),
              }}
            >
              <div className="flex flex-col gap-1 whitespace-nowrap">
                <div className="flex items-center justify-between gap-4 text-[10px] font-mono text-muted">
                  <span>
                    {new Date(
                      hoveredCell.year,
                      hoveredCell.month - 1,
                    ).toLocaleString("en", {
                      month: "long",
                    })}{" "}
                    {hoveredCell.year}
                  </span>
                  {hoveredCell.experiences.length > 0 && (
                    <span className="text-[9px] text-dim font-mono">
                      click to view
                    </span>
                  )}
                </div>

                {hoveredCell.experiences.length > 0 ? (
                  <div className="flex flex-col gap-1 pt-0.5">
                    {hoveredCell.experiences.map((exp) => (
                      <div key={exp.id} className="flex items-center gap-2">
                        <span
                          className="size-2 rounded-full shrink-0"
                          style={{
                            background: exp.color,
                            boxShadow: `0 0 6px ${exp.color}`,
                          }}
                        />
                        <span className="text-[12px] font-semibold text-fg">
                          {exp.company}
                        </span>
                        <span className="text-[11px] text-muted">
                          · {exp.role}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-dim italic pt-0.5">
                    No active role
                  </span>
                )}
              </div>

              {/* Downward pointer caret */}
              <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-white/15">
                <div className="absolute -top-4 -left-3.5 border-4 border-transparent border-t-ink/95" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stacked Job Cards Below */}
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
