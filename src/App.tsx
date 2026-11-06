import { useEffect, useState } from "react";
import { Background } from "./Background";
import type { LandingSection } from "./content";
import { DevToolsProvider } from "./devtools/DevToolsContext";
import { DevToolsPanel } from "./devtools/DevToolsPanel";
import { Education } from "./education/Education";
import { Experience } from "./experience/Experience";
import { Hero } from "./hero/Hero";
import { Pillars } from "./pillars/Pillars";
import { SiteHeader } from "./SiteHeader";

export default function App() {
  const [activePillar, setActivePillar] = useState(-1);
  const [activeSection, setActiveSection] = useState<LandingSection>("hero");

  useEffect(() => {
    const onScroll = () => {
      if (scrollY < innerHeight * 0.55) setActiveSection("hero");
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  const handlePillar = (pillar: number) => {
    if (pillar < 0) return;
    setActivePillar(pillar);
    setActiveSection("capabilities");
  };

  return (
    <DevToolsProvider>
      <Background active={activePillar} />
      <SiteHeader activePillar={activePillar} activeSection={activeSection} />
      <main className="relative">
        <Hero />
        <Pillars onActive={handlePillar} />
        <Experience onVisible={() => setActiveSection("experience")} />
        <Education onVisible={() => setActiveSection("education")} />
        <footer className="flex h-[34svh] items-center justify-center px-6 text-[12px] text-muted md:text-[13px]">
          <p>
            <span className="text-fg">❯</span> more context is compiling{" "}
            <span className="caret-blink ml-1 inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-fg/70" />
          </p>
        </footer>
      </main>
      <DevToolsPanel />
    </DevToolsProvider>
  );
}
