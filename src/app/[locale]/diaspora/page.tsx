import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { PageIntro } from "@/components/editorial/PageIntro";

export default async function DiasporaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("diaspora");
  const blocks = t.raw("blocks") as Array<{ title: string; text: string }>;

  return (
    <>
      <PageIntro
        kicker="Диаспора"
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

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-8">
        <div className="border-t border-border/70">
          {blocks.map((b, i) => (
            <Reveal key={b.title} delay={(i % 2) * 80}>
              <article className="grid items-start gap-6 border-b border-border/60 py-12 md:grid-cols-12 md:gap-10 md:py-16">
                <div className="md:col-span-3">
                  <span className="num-lockup nums-tabular block text-[3.5rem] leading-none text-primary sm:text-[4.5rem]">
                    0{i + 1}
                  </span>
                </div>
                <div className="md:col-span-5">
                  <h2 className="text-display text-balance text-2xl leading-tight sm:text-3xl">
                    {b.title}
                  </h2>
                </div>
                <div className="md:col-span-4">
                  <p className="max-w-prose text-pretty text-base leading-[1.75] text-foreground/75">
                    {b.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-8">
        <Reveal>
          <div className="grid gap-8 border-t border-border/60 py-10 md:grid-cols-12 md:py-12">
            <div className="md:col-span-3">
              <div className="editorial-kicker text-muted-foreground">
                {t("currencies")}
              </div>
            </div>
            <div className="md:col-span-6">
              <div className="num-lockup flex items-baseline gap-5 text-5xl sm:text-6xl">
                <span>USD</span>
                <span className="text-border">·</span>
                <span>EUR</span>
                <span className="text-border">·</span>
                <span>KZT</span>
              </div>
            </div>
            <div className="md:col-span-3">
              <p className="text-sm text-muted-foreground">
                <span className="text-serif-italic">
                  {t("currenciesNote")}
                </span>
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative isolate mt-24 overflow-hidden border-t border-border/60 paper sm:mt-32">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-24 sm:px-8 sm:py-32 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <div className="editorial-kicker text-muted-foreground">
              Дальше
            </div>
          </Reveal>
          <Reveal delay={120} className="md:col-span-9">
            <h2 className="text-display text-balance text-[clamp(2rem,4vw,3.6rem)] leading-[1.05]">
              {t("ctaTitle")}
            </h2>
            <p className="mt-6 max-w-[58ch] text-pretty leading-[1.75] text-foreground/80">
              <span className="text-serif-italic">{t("ctaText")}</span>
            </p>
            <div className="mt-10">
              <MagneticButton>
                <Link
                  href="/plant"
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
        </div>
      </section>
    </>
  );
}
