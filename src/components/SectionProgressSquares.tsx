import { AnimatePresence, motion } from "motion/react";

export interface ProgressSquareItem {
  id: string;
  label: string;
  color: string;
}

export function SectionProgressSquares({
  items,
  activeIndex,
  isDocked,
  onSelect,
}: {
  items: ProgressSquareItem[];
  activeIndex: number;
  isDocked: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="flex items-center gap-1.5 min-w-[20px]"
      role="tablist"
      aria-label="Section indicators"
    >
      <AnimatePresence>
        {isDocked &&
          items.map((item, i) => {
            const isActive = i === activeIndex;
            const isPassedOrActive = i <= activeIndex;

            return (
              <motion.button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={item.label}
                onClick={() => onSelect(i)}
                initial={{
                  scale: 0,
                  rotateY: -90,
                  rotateZ: -45,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  rotateY: 0,
                  rotateZ: 0,
                  opacity: 1,
                }}
                exit={{
                  scale: 0,
                  rotateY: 90,
                  opacity: 0,
                  transition: { duration: 0.15 },
                }}
                transition={{
                  delay: i * 0.05,
                  type: "spring",
                  stiffness: 450,
                  damping: 24,
                  mass: 0.6,
                }}
                className="group relative grid size-4 cursor-pointer place-items-center [perspective:600px]"
              >
                <span
                  className="block size-2.5 rounded-[2px] border transition-all duration-300 group-hover:scale-125"
                  style={{
                    borderColor: item.color,
                    background: isPassedOrActive ? item.color : "transparent",
                    opacity: isActive ? 1 : i < activeIndex ? 0.45 : 0.6,
                    boxShadow: isActive
                      ? `0 0 8px ${item.color}, inset 0 0 4px ${item.color}`
                      : "none",
                  }}
                />
              </motion.button>
            );
          })}
      </AnimatePresence>
    </div>
  );
}
