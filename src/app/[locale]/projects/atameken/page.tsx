import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { PageIntro } from "@/components/editorial/PageIntro";
import { SurnameSearch } from "./SurnameSearch";

export default async function AtamekenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("atameken");
  const blocks = t.raw("blocks") as Array<{ title: string; text: string }>;

  return (
    <>
      <PageIntro
        kicker={t("label")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-8">
        <Reveal>
          <p className="drop-cap mx-auto max-w-[58ch] text-pretty text-[1.1rem] leading-[1.9] text-foreground/85 sm:text-xl">
            {t("lead")}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto mt-16 max-w-3xl px-4 sm:mt-20 sm:px-8">
        <Reveal>
          <SurnameSearch />
        </Reveal>
      </section>

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

      {/* Concept map preview */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-8">
        <Reveal>
          <div className="rounded-sm border border-dashed border-border bg-muted/20 p-8 sm:p-12">
            <div className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-4">
              <span className="editorial-kicker text-muted-foreground">
                preview · карта фамилий
              </span>
              <span className="text-serif-italic text-sm text-muted-foreground">
                Q1 2027
              </span>
            </div>
            <div className="mt-8 grid grid-cols-4 gap-4 sm:grid-cols-8">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-sm border border-border/40 bg-background/80"
                  style={{ transform: `translateY(${(i % 3) * 6}px)` }}
                >
                  <div
                    className={
                      "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full " +
                      (i % 5 === 0
                        ? "h-2.5 w-2.5 bg-primary"
                        : "h-1.5 w-1.5 bg-primary/40")
                    }
                  />
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              <span className="text-serif-italic">{t("statusValue")}</span>
            </p>
          </div>
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

      <section className="relative isolate mt-20 overflow-hidden bg-primary text-primary-foreground sm:mt-28">
        <div
          aria-hidden
          className="halftone absolute inset-0 text-primary-foreground"
        />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-24 sm:px-8 sm:py-32 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <div className="editorial-kicker text-primary-foreground/70">
              Дальше
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
