import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export const ogSize = { width: 1200, height: 630 } as const;
export const ogContentType = "image/png";

async function loadTtf(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Font fetch failed: ${url} (${res.status})`);
  }
  return res.arrayBuffer();
}

// Satori only accepts TTF/OTF. Google Fonts CSS API returns woff2 for modern
// UAs which Satori rejects. We pull the raw TTFs from the google/fonts repo.
const SPECTRAL_TTF = {
  regular:
    "https://raw.githubusercontent.com/google/fonts/main/ofl/spectral/Spectral-Regular.ttf",
  medium:
    "https://raw.githubusercontent.com/google/fonts/main/ofl/spectral/Spectral-Medium.ttf",
  italic:
    "https://raw.githubusercontent.com/google/fonts/main/ofl/spectral/Spectral-Italic.ttf",
} as const;

export async function renderOg(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "hero" });
  const slogan = t("slogan");

  const [serifRegular, serifMedium, serifItalic] = await Promise.all([
    loadTtf(SPECTRAL_TTF.regular),
    loadTtf(SPECTRAL_TTF.medium),
    loadTtf(SPECTRAL_TTF.italic),
  ]);

  const words = slogan.split(/\s+/);
  const last = words.pop() ?? "";
  const head = words.join(" ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 72,
          position: "relative",
          backgroundColor: "#fbfaf4",
          backgroundImage:
            "radial-gradient(ellipse at top right, rgba(180, 220, 170, 0.35), transparent 55%), radial-gradient(ellipse at bottom left, rgba(230, 220, 180, 0.4), transparent 60%)",
          fontFamily: "'Spectral'",
          color: "#1a2a1f",
        }}
      >
        {/* Top row: wordmark + dot */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 38,
              letterSpacing: -0.4,
              color: "#1a2a1f",
              fontWeight: 500,
            }}
          >
            Túbir
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 20,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "rgba(26, 42, 31, 0.55)",
              fontFamily: "'Spectral'",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                backgroundColor: "#3f8048",
                display: "flex",
              }}
            />
            <span style={{ display: "flex" }}>Túbir · ВКО</span>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ display: "flex", flex: 1 }} />

        {/* Slogan */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            fontSize: slogan.length > 36 ? 100 : 124,
            lineHeight: 1.02,
            letterSpacing: -3.6,
            color: "#102018",
            maxWidth: "100%",
            fontWeight: 500,
          }}
        >
          {head ? (
            <span style={{ display: "flex", marginRight: 24 }}>{head}</span>
          ) : null}
          <span
            style={{
              display: "flex",
              fontStyle: "italic",
              color: "#3f8048",
              fontWeight: 400,
            }}
          >
            {last}
          </span>
        </div>

        {/* Spacer */}
        <div style={{ display: "flex", flex: 0.6 }} />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
            paddingTop: 36,
            borderTop: "1px solid rgba(26, 42, 31, 0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "rgba(26, 42, 31, 0.6)",
            }}
          >
            ВКО · 2026—
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontStyle: "italic",
              color: "rgba(26, 42, 31, 0.5)",
            }}
          >
            tubir.kz
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Spectral", data: serifRegular, weight: 400, style: "normal" },
        { name: "Spectral", data: serifMedium, weight: 500, style: "normal" },
        { name: "Spectral", data: serifItalic, weight: 400, style: "italic" },
      ],
    },
  );
}
