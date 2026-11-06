import { KeyWord, MorphWord } from "./MorphWord";
import { useTitleWords } from "./useTitleWords";

const DISCIPLINE = ["backend", "product", "frontend"];

export function DockedTitle({
  active,
  onJump,
}: {
  active: number;
  onJump: (i: number) => void;
}) {
  const items = useTitleWords();
  const item = items[active];
  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <div className="mb-3 flex items-center gap-3 text-[12px] text-muted md:mb-4 md:text-[13px]">
        <div className="flex gap-1.5" role="tablist" aria-label="Sections">
          {items.map((it, i) => (
            <button
              key={it.key}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`${DISCIPLINE[i]}: ${it.word}`}
              onClick={() => onJump(i)}
              className="group grid size-4 cursor-pointer place-items-center"
            >
              <span
                className="block size-2.5 border transition-all duration-500 group-hover:scale-125"
                style={{
                  borderColor: it.color,
                  background: i <= active ? it.color : "transparent",
                  opacity: i === active ? 1 : i < active ? 0.45 : 0.6,
                }}
              />
            </button>
          ))}
        </div>
        <span>
          capabilities · 0{active + 1}/03 ·{" "}
          <MorphWord text={DISCIPLINE[active]} className="text-fg/80" />
        </span>
      </div>
      <h2 className="text-[clamp(1.7rem,4.6vw,3.9rem)] leading-[1.06] font-bold tracking-[-0.035em] text-fg">
        <span className="text-fg/55">I bring </span>
        <KeyWord text={item.word} color={item.color} />
        <span className="text-fg/55"> to </span>
        <MorphWord text={item.subject} />
      </h2>
      <div className="mt-2.5 flex min-h-8 flex-col gap-2 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between md:mt-3 md:text-[15px]">
        <p key={item.meaning} className="fade-up">
          <span style={{ color: item.color }}>→ </span>
          {item.meaning}
        </p>
        <a
          href={item.moreHref}
          className="group w-fit shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-fg/70 transition-[border-color,color,transform] hover:translate-x-0.5 hover:border-white/25 hover:text-fg md:text-[11px]"
        >
          {item.moreLabel}{" "}
          <span className="text-dim transition-colors group-hover:text-fg">
            ↗
          </span>
        </a>
      </div>
    </div>
  );
}
