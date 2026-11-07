import { useEffect, useState } from "react";
import { scrollToPillar } from "../pillars/Pillars";
import { useDevTools } from "./DevToolsContext";
import { optionGroups } from "./options";

/** Temporary design panel for comparing alternatives live. Toggle with ` when visible. */
export function DevToolsPanel() {
  const { config, set, reset, enabled } = useDevTools();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === "`" && !(e.target as HTMLElement).closest("input,textarea"))
        setOpen((o) => !o);
    };
    addEventListener("keydown", on);
    return () => removeEventListener("keydown", on);
  }, [enabled]);

  if (!enabled) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked */
    }
  };
  const btn =
    "cursor-pointer rounded-[5px] border border-white/10 px-2 py-1 text-[11px] text-muted transition-colors hover:border-white/25 hover:text-fg";

  return (
    <div
      data-devtools
      className="fixed right-3 bottom-3 z-50 font-mono md:right-5 md:bottom-5"
    >
      {open ? (
        <div className="no-scrollbar max-h-[calc(100svh-40px)] w-[min(92vw,340px)] overflow-y-auto rounded-xl border border-white/10 bg-[#161616]/95 p-3.5 shadow-2xl backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[12px] text-fg">
              <span className="text-claude">◆</span> devtools{" "}
              <span className="text-dim">· temp</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="cursor-pointer px-1 text-[12px] text-muted hover:text-fg"
              aria-label="Close devtools"
            >
              ✕
            </button>
          </div>
          {optionGroups.map((g) => (
            <div
              key={g.title}
              className="mb-3 border-t border-white/[0.06] pt-2.5"
            >
              <div className="mb-2 text-[10px] tracking-[0.12em] text-dim uppercase">
                {g.title}
              </div>
              <div className="flex flex-col gap-2">
                {g.options.map((o) => (
                  <div key={o.key} className="flex gap-2">
                    <span className="w-16 shrink-0 pt-1 text-[11px] text-muted">
                      {o.label}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {o.choices.map((c) => (
                        <button
                          key={String(c.value)}
                          type="button"
                          onClick={() => set(o.key, c.value)}
                          className={`cursor-pointer rounded-[5px] border px-2 py-1 text-[11px] transition-colors ${
                            config[o.key] === c.value
                              ? "border-claude/60 bg-claude/15 text-fg"
                              : "border-white/[0.07] text-muted hover:border-white/20 hover:text-fg"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-1 border-t border-white/[0.06] pt-2.5">
            <button
              type="button"
              className={btn}
              onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
            >
              hero
            </button>
            {["trust", "clarity", "feeling"].map((l, i) => (
              <button
                key={l}
                type="button"
                className={btn}
                onClick={() => scrollToPillar(i)}
              >
                {l}
              </button>
            ))}
            <button
              type="button"
              className={btn}
              onClick={() =>
                document
                  .getElementById("experience")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              exp
            </button>
            <button type="button" className={btn} onClick={copy}>
              {copied ? "✔ copied" : "copy config"}
            </button>
            <button type="button" className={btn} onClick={reset}>
              reset
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="cursor-pointer rounded-full border border-white/10 bg-[#161616]/90 px-3 py-1.5 text-[11px] text-muted shadow-lg backdrop-blur transition-colors hover:text-fg"
        >
          <span className="text-claude">◆</span> devtools{" "}
          <span className="text-dim">`</span>
        </button>
      )}
    </div>
  );
}
