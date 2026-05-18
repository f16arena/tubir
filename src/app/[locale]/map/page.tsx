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

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-8">
        <Reveal>
          <div className="relative">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
              <span className="editorial-kicker text-muted-foreground">
                {PLOTS[0]
                  ? `${PLOTS[0].name} · ${PLOTS[0].center.lat.toFixed(3)}° N · ${PLOTS[0].center.lng.toFixed(3)}° E`
                  : "ВКО · карта"}
              </span>
              <div className="flex flex-wrap items-baseline gap-4 text-xs text-muted-foreground">
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
            <PlotMap />
            <p className="mt-3 text-xs text-muted-foreground">
              <span className="text-serif-italic">{t("placeholderNote")}</span>
            </p>
          </div>
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
