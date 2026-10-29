import type { Metadata } from "next";

import { Providers } from "@/components/providers";
import { Shell } from "@/components/shell/shell";
import { profile } from "@/content/profile";

import "./globals.css";

export const metadata: Metadata = {
  title: profile.name,
  description: profile.valueLine.neutral,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background font-sans text-foreground antialiased">
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
