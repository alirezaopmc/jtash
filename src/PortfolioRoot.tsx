import React from "react";
import App from "./App";
import type { LatestPost } from "./hero/Hero";

export default function PortfolioRoot({
  latestPost = null,
}: {
  latestPost?: LatestPost | null;
}) {
  return (
    <React.StrictMode>
      <App latestPost={latestPost} />
    </React.StrictMode>
  );
}
