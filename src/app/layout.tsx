import { defaultTokensRaw, mergeTokenOverridesRaw } from "@manovaspace/tokens";
import type { Metadata } from "next";

import { Providers } from "@/components/providers";
import { Shell } from "@/components/shell/shell";
import { TokenStyle } from "@/components/token-style";
import { profile } from "@/content/profile";
import { claudeCodeTokens } from "@/theme/claude-code";

import "./globals.css";

const initialTokens = mergeTokenOverridesRaw(
  defaultTokensRaw,
  claudeCodeTokens,
);

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
        <TokenStyle tokens={initialTokens} />
        <Providers initialTokens={initialTokens}>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
