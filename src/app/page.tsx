import type { Metadata } from "next";

import { ViewPage } from "@/components/view-page";
import { profile, profileTitle } from "@/content/profile";

export const metadata: Metadata = {
  title: profileTitle("neutral"),
  description: profile.valueLine.neutral,
};

export default function HomePage() {
  return <ViewPage view="neutral" />;
}
