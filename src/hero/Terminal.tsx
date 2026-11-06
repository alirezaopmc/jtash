import { identity, placeholderPrompt } from "../content";
import { Mascot } from "./Mascot";

/** Claude Code's welcome block — with my name where the product name would be. */
export function HeaderBlock() {
  return (
    <div className="flex items-center gap-3.5 text-[12px] leading-[1.45] sm:gap-4 sm:text-[13px] md:text-[14px]">
      <span className="sm:hidden">
        <Mascot pixel={5} />
      </span>
      <span className="hidden sm:block">
        <Mascot pixel={6} />
      </span>
      <div>
        <div className="font-bold text-fg">{identity.name}</div>
        <div className="text-muted">{identity.role}</div>
      </div>
    </div>
  );
}

/** The prompt box, idle, waiting for you — exactly like a fresh Claude Code session. */
export function InputBox() {
  return (
    <div className="flex gap-2 border-y border-white/25 py-2 text-[13px] leading-[1.55] md:text-[14px]">
      <span className="text-fg">❯</span>
      <div className="min-w-0 flex-1">
        <span className="caret-invert">{placeholderPrompt[0]}</span>
        <span className="text-dim">{placeholderPrompt.slice(1)}</span>
      </div>
    </div>
  );
}

export function AutoModeLine() {
  return (
    <div className="pt-1.5 text-[12px] md:text-[13px]">
      <span className="pl-3 text-clarity">▸▸ auto mode on</span>
    </div>
  );
}
