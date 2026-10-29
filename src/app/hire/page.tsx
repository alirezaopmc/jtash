import type { Metadata } from "next";

import { ViewPage } from "@/components/view-page";
import { profile, profileTitle } from "@/content/profile";

export const metadata: Metadata = {
  title: profileTitle("hire"),
  description: profile.valueLine.hire,
};

export default function HirePage() {
  return <ViewPage view="hire" />;
}
