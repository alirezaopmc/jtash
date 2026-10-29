import type { ReactNode } from "react";

import { Statusline } from "./statusline";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh">
      {children}
      <Statusline />
    </div>
  );
}
