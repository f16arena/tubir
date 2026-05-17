import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Parallax } from "@/components/motion/Parallax";
import { CountUp } from "@/components/motion/CountUp";
import { photos } from "@/lib/data/gallery";

type TimelineEntry = { year: string; event: string };
type PolygonStat = {
  value: string;
  unit?: string;
  label: string;
  source: string;
  sourceUrl?: string;
};

export default async function PolygonPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("polygon");
  const blocks = t.raw("blocks") as Array<{ title: string; text: string }>;
  const timeline = (t.raw("timeline") as TimelineEntry[] | undefined) ?? [];
  const stats = (t.raw("stats") as PolygonStat[] | undefined) ?? [];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Parallax speed={80} className="absolute inset-0">
            <div className="absolute inset-0 scale-110 opacity-35">
              <Image
                src={photos.future}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black" />
          <div className="grain absolute inset-0" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-28 pb-20 sm:px-8 sm:pt-36 sm:pb-32 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <div className="flex items-center gap-3 text-white/70">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80" />
              <span className="editorial-kicker">{t("label")}</span>
            </div>
          </Reveal>
          <Reveal className="md:col-span-9" delay={120}>
            <h1 className="text-display text-balance text-[clamp(2.4rem,5.5vw,5rem)]">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg text-white/75">
              <span className="text-serif-italic">{t("subtitle")}</span>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-8 sm:pt-32">
        <Reveal>
          <p className="drop-cap mx-auto max-w-[58ch] text-pretty text-[1.1rem] leading-[1.9] text-foreground/85 sm:text-xl">
            {t("lead")}
          </p>
        </Reveal>
      </section>

      {timeline.length > 0 ? (
        <section className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-8">
          <div className="grid gap-8 md:grid-cols-12">
            <Reveal className="md:col-span-3">
              <div className="editorial-kicker text-muted-foreground">
                {t("timelineKicker")}
              </div>
              <h2 className="text-display mt-3 text-balance text-2xl leading-tight sm:text-3xl">
                {t("timelineTitle")}
              </h2>
            </Reveal>
            <ol className="md:col-span-9">
              <div className="border-t border-border/70">
                {timeline.map((e, i) => (
                  <Reveal key={e.year + i} delay={i * 40}>
                    <li className="grid items-baseline gap-6 border-b border-border/60 py-5 md:grid-cols-[8rem_1fr]">
                      <span className="num-lockup nums-tabular text-3xl text-primary sm:text-4xl">
                        {e.year}
                      </span>
                      <span className="text-pretty text-base leading-[1.6] text-foreground/85 sm:text-lg">
                        {e.event}
                      </span>
                    </li>
                  </Reveal>
                ))}
              </div>
            </ol>
          </div>
        </section>
      ) : null}

      {stats.length > 0 ? (
        <section className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-8">
          <div className="grid gap-8 md:grid-cols-12">
            <Reveal className="md:col-span-3">
              <div className="editorial-kicker text-muted-foreground">
                {t("statsKicker")}
              </div>
              <h2 className="text-display mt-3 text-balance text-2xl leading-tight sm:text-3xl">
                {t("statsTitle")}
              </h2>
            </Reveal>
            <dl className="md:col-span-9">
              <div className="border-t border-border/70">
                {stats.map((s, i) => (
                  <Reveal key={s.label + i} delay={i * 60}>
                    <div className="grid items-baseline gap-4 border-b border-border/60 py-7 md:grid-cols-[12rem_1fr_auto] md:gap-8">
                      <dt>
                        <div className="num-lockup nums-tabular text-4xl text-foreground sm:text-5xl">
                          <CountUp value={s.value} duration={1500} />
                          {s.unit ? (
                            <span className="ml-1 text-2xl text-foreground/60 sm:text-3xl">
                              {s.unit}
                            </span>
                          ) : null}
                        </div>
                      </dt>
                      <dd className="max-w-prose text-pretty text-base leading-[1.6] text-foreground/85 sm:text-lg">
                        {s.label}
                      </dd>
                      <div className="max-w-[12rem] text-xs text-muted-foreground">
                        <div className="editorial-kicker mb-1 text-muted-foreground">
                          {t("source")}
                        </div>
                        {s.sourceUrl ? (
                          <a
                            href={s.sourceUrl}
                            target="_blank"
                            rel="noopener nofollow"
                            className="text-serif-italic ink-underline"
                          >
                            {s.source}
                          </a>
                        ) : (
                          <span className="text-serif-italic">{s.source}</span>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </dl>
          </div>
        </section>
      ) : null}

      <section className="mx-auto mt-20 grid max-w-7xl gap-8 px-4 sm:mt-28 sm:px-8 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <div className="editorial-kicker text-muted-foreground">Замысел</div>
        </Reveal>
        <Reveal className="md:col-span-9" delay={120}>
          <h2 className="text-display text-balance text-[clamp(2rem,4vw,3.4rem)] leading-[1.05]">
            {t("concept")}
          </h2>
          <p className="mt-6 max-w-[58ch] text-pretty text-base leading-[1.8] text-foreground/80 sm:text-lg">
            {t("conceptText")}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-8">
        <div className="border-t border-border/70">
          {blocks.map((b, i) => (
            <Reveal key={b.title} delay={(i % 2) * 80}>
              <article className="grid items-start gap-6 border-b border-border/60 py-12 md:grid-cols-12 md:gap-10 md:py-16">
                <div className="md:col-span-2">
                  <span className="num-lockup nums-tabular block text-[3.5rem] leading-none text-primary sm:text-[4.5rem]">
                    0{i + 1}
                  </span>
                </div>
                <div className="md:col-span-5">
                  <h3 className="text-display text-2xl leading-tight sm:text-3xl">
                    {b.title}
                  </h3>
                </div>
                <div className="md:col-span-5">
                  <p className="max-w-prose text-pretty text-base leading-[1.75] text-foreground/75">
                    {b.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-7xl gap-8 border-t border-border/70 px-4 py-12 sm:mt-28 sm:px-8 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <div className="editorial-kicker text-muted-foreground">
            {t("statusLabel")}
          </div>
        </Reveal>
        <Reveal className="md:col-span-9" delay={80}>
          <p className="text-pretty text-base leading-[1.6] text-foreground/85 sm:text-lg">
            <span className="text-serif-italic">{t("statusValue")}</span>
          </p>
        </Reveal>
      </section>

      <section className="relative isolate mt-12 overflow-hidden bg-primary text-primary-foreground sm:mt-16">
        <div
          aria-hidden
          className="halftone absolute inset-0 text-primary-foreground"
        />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-24 sm:px-8 sm:py-32 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <div className="editorial-kicker text-primary-foreground/70">
              Присоединиться
            </div>
          </Reveal>
          <Reveal delay={120} className="md:col-span-9">
            <h2 className="text-display text-balance text-[clamp(2rem,4vw,3.6rem)] leading-[1.05]">
              {t("cta")}
            </h2>
            <p className="mt-6 max-w-[58ch] text-pretty leading-[1.75] text-primary-foreground/85">
              {t("ctaText")}
            </p>
            <div className="mt-10">
              <MagneticButton>
                <Link
                  href="/plant"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "secondary" }),
                    "group h-12 rounded-full px-7 text-base",
                  )}
                >
                  {t("cta")}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
