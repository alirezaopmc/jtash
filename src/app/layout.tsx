import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import Script from "next/script";

import { AppSiteShell } from "@/components/app-site-shell";
import { getRequestSiteContent } from "@/lib/get-request-site-content";
import { themeInitScript } from "@/lib/theme-script";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono-family",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getRequestSiteContent();

  return {
    title: site.meta.title,
    description: site.meta.description,
    icons: {
      icon: "/icon.svg",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { profile, navigation, headerTips, site, labels } =
    await getRequestSiteContent();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#0b1120" />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <AppSiteShell
          profile={profile}
          navigation={navigation}
          headerTips={headerTips}
          footer={site.footer}
          routes={site.routes}
          labels={labels}
        >
          {children}
        </AppSiteShell>
      </body>
    </html>
  );
}
