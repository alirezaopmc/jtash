import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { identity, type LandingSection, pillars } from "./content";
import { Mascot } from "./hero/Mascot";
import { useMotionPrefs } from "./lib/useMotionPrefs";
import { useNarrow } from "./lib/useNarrow";
import { scrollToPillar } from "./pillars/Pillars";

const CLOSED = { w: 56, h: 28 }; // a true half-circle hanging from the top edge

/**
 * A half-circle notch at the top of the page. Collapsed, its three dots tell you which
 * pillar you're in. Hover (or tap) and it smoothly opens into the navigation.
 */
export function SiteHeader({
  activePillar,
  activeSection,
}: {
  activePillar: number;
  activeSection: LandingSection;
}) {
  const [open, setOpen] = useState(false);
  const narrow = useNarrow();
  const { reduced } = useMotionPrefs();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const root = useRef<HTMLDivElement>(null);

  const openNow = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 220);
  };

  // Touch: tap outside closes.
  useEffect(() => {
    if (!open) return;
    const on = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    addEventListener("pointerdown", on);
    return () => removeEventListener("pointerdown", on);
  }, [open]);

  const OPEN = narrow
    ? { w: Math.min(innerWidth - 24, 370), h: 56 }
    : { w: 650, h: 56 };
  const size = open ? OPEN : CLOSED;
  const go = (fn: () => void) => {
    fn();
    setOpen(false);
  };
  const capabilityColor =
    activePillar >= 0 ? pillars[activePillar].color : "var(--color-trust)";
  const links: {
    label: string;
    section: LandingSection;
    href: string;
    color: string;
  }[] = [
    {
      label: "capabilities",
      section: "capabilities",
      href: "#capabilities",
      color: capabilityColor,
    },
    {
      label: "experience",
      section: "experience",
      href: "#experience",
      color: "var(--color-claude)",
    },
    {
      label: "education",
      section: "education",
      href: "#education",
      color: "var(--color-clarity)",
    },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center">
      {/* generous invisible hit area so the notch opens as you approach it */}
      <div
        ref={root}
        className="pointer-events-auto px-10 pb-6"
        onMouseEnter={openNow}
        onMouseLeave={closeSoon}
        onFocus={openNow}
        onBlur={(e) =>
          !e.currentTarget.contains(e.relatedTarget as Node) && closeSoon()
        }
      >
        <motion.nav
          aria-label="Site"
          initial={false}
          animate={{ width: size.w, height: size.h }}
          transition={
            reduced
              ? { duration: 0 }
              : { type: "spring", stiffness: 340, damping: 32, mass: 0.9 }
          }
          className={`relative overflow-hidden rounded-b-[999px] border border-t-0 bg-[#161616] transition-[border-color,box-shadow] duration-500 ${
            open
              ? "border-white/12 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)]"
              : "border-white/[0.08]"
          }`}
        >
          {/* Both layers stay mounted and cross-fade, so the morph never depends on mount timing. */}
          <div
            aria-hidden={!open}
            inert={!open}
            className={`absolute inset-0 flex items-center justify-between gap-4 pr-9 pl-8 text-[13px] whitespace-nowrap transition-[opacity,filter] ${
              open
                ? "opacity-100 blur-0 delay-100 duration-300"
                : "pointer-events-none opacity-0 blur-[6px] duration-100"
            }`}
          >
            <button
              type="button"
              onClick={() => go(() => scrollTo({ top: 0, behavior: "smooth" }))}
              className="flex cursor-pointer items-center gap-2.5 text-fg transition-opacity hover:opacity-80"
            >
              <Mascot pixel={2} blink={false} />
              {!narrow && (
                <span className="font-semibold">{identity.name}</span>
              )}
            </button>
            <div className="flex items-center gap-3.5 md:gap-5">
              {links.map((link) => (
                <button
                  key={link.section}
                  type="button"
                  onClick={() =>
                    go(() =>
                      link.section === "capabilities"
                        ? scrollToPillar(Math.max(0, activePillar))
                        : document
                            .querySelector(link.href)
                            ?.scrollIntoView({ behavior: "smooth" }),
                    )
                  }
                  className={`group flex cursor-pointer items-center gap-1.5 transition-colors ${activeSection === link.section ? "text-fg" : "text-muted hover:text-fg"}`}
                >
                  <span
                    className="size-1.5 rounded-full transition-transform group-hover:scale-150"
                    style={{
                      background: link.color,
                      opacity: activeSection === link.section ? 1 : 0.55,
                    }}
                  />
                  {link.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            aria-label="Open navigation"
            aria-expanded={open}
            tabIndex={open ? -1 : 0}
            onClick={openNow}
            className={`absolute inset-x-0 top-0 flex h-[28px] cursor-pointer items-start justify-center gap-[5px] pt-[9px] transition-opacity ${
              open
                ? "pointer-events-none opacity-0 duration-100"
                : "opacity-100 delay-150 duration-300"
            }`}
          >
            {links.map((link) => (
              <span
                key={link.section}
                className="size-[5px] rounded-full transition-all duration-500"
                style={{
                  background: link.color,
                  opacity: activeSection === link.section ? 1 : 0.35,
                  transform: `scale(${activeSection === link.section ? 1.25 : 1})`,
                }}
              />
            ))}
          </button>
        </motion.nav>
      </div>
    </div>
  );
}
