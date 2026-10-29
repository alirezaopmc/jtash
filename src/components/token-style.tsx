import { type OrbitTokensRaw, tokensToRuntimeCss } from "@manovaspace/tokens";

/**
 * Server-rendered token variables.
 *
 * `@manovaspace/ui/server` re-exports `OrbitTokensHead`, but that barrel also
 * pulls `OrbitFontsHead`, whose `*.woff2?url` imports the webpack build in this
 * repo cannot parse. This emits the same `:root` / `.dark` pair from
 * `@manovaspace/tokens` directly.
 *
 * Id must stay `orbit-tokens-runtime`: `TokenProvider` looks it up and updates
 * its text content in place instead of re-parenting a node React owns. Render
 * as the first child of `<body>`.
 */
export function TokenStyle({ tokens }: { tokens: OrbitTokensRaw }) {
  const html = { __html: tokensToRuntimeCss(tokens) };

  return <style dangerouslySetInnerHTML={html} id="orbit-tokens-runtime" />;
}
