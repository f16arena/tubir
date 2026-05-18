import Script from "next/script";

/**
 * Privacy-friendly analytics via Plausible (or any compatible script).
 *
 * Configure via env:
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN   — domain to track (e.g. "tubir.kz")
 *   NEXT_PUBLIC_PLAUSIBLE_SCRIPT   — script URL (defaults to Plausible Cloud).
 *
 * If NEXT_PUBLIC_PLAUSIBLE_DOMAIN is empty, nothing is rendered — no
 * tracking, no script, no cookies.
 *
 * Self-hosters: set NEXT_PUBLIC_PLAUSIBLE_SCRIPT to your own Plausible
 * URL, e.g. "https://analytics.tubir.kz/js/script.js".
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  const src =
    process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT ??
    "https://plausible.io/js/script.js";

  return (
    <Script
      defer
      data-domain={domain}
      src={src}
      strategy="afterInteractive"
    />
  );
}
