import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { PageIntro } from "@/components/editorial/PageIntro";
import { PlotMap } from "@/components/map/PlotMap";
import { PLOTS, REFERENCE_POINTS } from "@/lib/data/plots";

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("map");
  const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  return (
    <>
      <PageIntro
        kicker={t("kicker")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-8">
        <Reveal>
          <p className="drop-cap mx-auto max-w-[58ch] text-pretty text-[1.1rem] leading-[1.85] text-foreground/85 sm:text-xl">
            {t("lead")}
          </p>
        </Reveal>
      </section>

      {/* Live Google Map when API key is set; SVG concept otherwise. */}
      <section className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-8">
        <Reveal>
          {googleMapsKey ? (
            <div className="relative">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
                <span className="editorial-kicker text-muted-foreground">
                  {PLOTS[0]
                    ? `${PLOTS[0].name} · ${PLOTS[0].center.lat.toFixed(3)}° N · ${PLOTS[0].center.lng.toFixed(3)}° E`
                    : "ВКО · карта"}
                </span>
                <div className="flex items-baseline gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: "#2c5a33" }}
                    />
                    Túbir
                  </span>
                  {REFERENCE_POINTS.map((p) => (
                    <span key={p.name} className="inline-flex items-center gap-2">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{
                          backgroundColor:
                            p.kind === "polygon"
                              ? "#a44a3a"
                              : p.kind === "forest"
                                ? "#7a9460"
                                : "#3a3a32",
                        }}
                      />
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
              <PlotMap apiKey={googleMapsKey} />
              <p className="mt-3 text-xs text-muted-foreground">
                <span className="text-serif-italic">
                  {t("placeholderNote")}
                </span>
              </p>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-sm border border-dashed border-border bg-muted/20">
              <div className="absolute left-4 top-4 z-10 flex items-baseline gap-3">
                <span className="editorial-kicker text-muted-foreground">
                  concept · ВКО · 49.95° N · 82.61° E
                </span>
              </div>
              <div className="aspect-[16/9] w-full">
                <svg
                  viewBox="0 0 1600 900"
                  className="block h-full w-full"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden
                >
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M40 0L0 0L0 40"
                      fill="none"
                      stroke="currentColor"
                      strokeOpacity="0.06"
                      strokeWidth="1"
                    />
                  </pattern>
                  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="oklch(0.42 0.13 148)" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="oklch(0.42 0.13 148)" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <rect width="1600" height="900" fill="url(#grid)" />

                {/* Abstract silhouette of East Kazakhstan region */}
                <path
                  d="M 220 220
                     C 420 160, 660 180, 820 240
                     S 1180 260, 1340 360
                     S 1420 580, 1300 700
                     S 980 800, 800 760
                     S 420 720, 280 600
                     S 180 380, 220 220 Z"
                  fill="oklch(0.92 0.06 130 / 0.35)"
                  stroke="oklch(0.42 0.13 148 / 0.5)"
                  strokeWidth="1.5"
                  strokeDasharray="6 8"
                />

                {/* Planned plot location */}
                <circle cx="900" cy="460" r="120" fill="url(#glow)" />
                <circle
                  cx="900"
                  cy="460"
                  r="6"
                  fill="oklch(0.42 0.13 148)"
                />
                <circle
                  cx="900"
                  cy="460"
                  r="14"
                  fill="none"
                  stroke="oklch(0.42 0.13 148)"
                  strokeWidth="1.5"
                />
                <text
                  x="930"
                  y="465"
                  fontFamily="var(--font-mono)"
                  fontSize="20"
                  fill="oklch(0.18 0.03 150)"
                  letterSpacing="3"
                >
                  PLOT · 01
                </text>

                {/* Polygon (Semipalatinsk) reference dot */}
                <circle
                  cx="640"
                  cy="540"
                  r="4"
                  fill="oklch(0.55 0.22 27 / 0.7)"
                />
                <text
                  x="660"
                  y="544"
                  fontFamily="var(--font-mono)"
                  fontSize="14"
                  fill="oklch(0.18 0.03 150 / 0.7)"
                  letterSpacing="2"
                >
                  Полигон
                </text>

                {/* Semey orman reference dot */}
                <circle cx="700" cy="500" r="4" fill="oklch(0.62 0.15 130)" />
                <text
                  x="720"
                  y="504"
                  fontFamily="var(--font-mono)"
                  fontSize="14"
                  fill="oklch(0.18 0.03 150 / 0.7)"
                  letterSpacing="2"
                >
                  Семей орманы
                </text>

                {/* Ust-Kamenogorsk reference dot */}
                <circle cx="980" cy="380" r="4" fill="oklch(0.18 0.03 150)" />
                <text
                  x="1000"
                  y="384"
                  fontFamily="var(--font-mono)"
                  fontSize="14"
                  fill="oklch(0.18 0.03 150 / 0.7)"
                  letterSpacing="2"
                >
                  Усть-Каменогорск
                </text>
              </svg>
            </div>
              <div className="border-t border-border/60 bg-background/60 px-4 py-3 text-xs text-muted-foreground sm:px-6">
                <span className="text-serif-italic">{t("placeholderNote")}</span>
              </div>
            </div>
          )}
        </Reveal>
      </section>

      {/* What the map will become */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-8">
        <div className="border-t border-border/70">
          {((t.raw("plans") as Array<{ title: string; text: string }>) ?? []).map(
            (p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <article className="grid items-start gap-6 border-b border-border/60 py-12 md:grid-cols-12 md:gap-10 md:py-16">
                  <div className="md:col-span-2">
                    <span className="num-lockup nums-tabular block text-[3.5rem] leading-none text-primary sm:text-[4.5rem]">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="md:col-span-5">
                    <h2 className="text-display text-2xl leading-tight sm:text-3xl">
                      {p.title}
                    </h2>
                  </div>
                  <div className="md:col-span-5">
                    <p className="max-w-prose text-pretty text-base leading-[1.75] text-foreground/75">
                      {p.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            ),
          )}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-3xl px-4 pb-24 text-center sm:mt-28 sm:px-8 sm:pb-32">
        <Reveal>
          <h2 className="text-display text-balance text-[clamp(1.8rem,3.5vw,3rem)] leading-[1.1]">
            {t("ctaTitle")}
          </h2>
          <p className="mt-5 max-w-xl text-pretty leading-[1.75] text-muted-foreground sm:text-lg">
            <span className="text-serif-italic">{t("ctaText")}</span>
          </p>
          <div className="mt-8 flex justify-center">
            <MagneticButton>
              <Link
                href="/pledge"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group h-12 rounded-full px-7 text-base",
                )}
              >
                {t("ctaButton")}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}
