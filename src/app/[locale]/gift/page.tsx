import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { PageIntro } from "@/components/editorial/PageIntro";
import { SampleCertificate } from "@/components/SampleCertificate";

export default async function GiftPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gift");
  const steps = t.raw("steps") as string[];
  const occasions = t.raw("occasions") as string[];

  return (
    <>
      <PageIntro
        kicker="Подарок"
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

      <section className="mx-auto mt-20 grid max-w-7xl gap-12 px-4 sm:mt-28 sm:px-8 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-7">
          <Reveal>
            <div className="editorial-kicker text-muted-foreground">
              {t("stepsTitle")}
            </div>
            <ol className="mt-6 border-t border-border/70">
              {steps.map((step, i) => (
                <li
                  key={step}
                  className="flex items-baseline gap-6 border-b border-border/60 py-5"
                >
                  <span className="num-lockup nums-tabular w-12 text-3xl leading-none text-primary/60">
                    0{i + 1}
                  </span>
                  <span className="text-pretty text-base leading-[1.7] text-foreground/85 sm:text-lg">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-12 editorial-kicker text-muted-foreground">
              {t("occasionsTitle")}
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {occasions.map((o) => (
                <li
                  key={o}
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground/80"
                >
                  <span className="text-serif-italic">{o}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-12 border-l-2 border-primary pl-6">
              <div className="editorial-kicker text-primary">
                {t("noteTitle")}
              </div>
              <p className="mt-2 text-pretty text-base leading-[1.7] text-foreground/85">
                {t("noteText")}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="md:col-span-5" delay={180}>
          <div className="sticky top-24">
            <div className="editorial-kicker text-muted-foreground">
              Сертификат
            </div>
            <div className="mt-4">
              <SampleCertificate />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative isolate mt-24 overflow-hidden bg-primary text-primary-foreground sm:mt-32">
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
              {t("ctaTitle")}
            </h2>
            <p className="mt-6 max-w-[58ch] text-pretty leading-[1.75] text-primary-foreground/85">
              {t("ctaText")}
            </p>
            <div className="mt-10">
              <MagneticButton>
                <Link
                  href={{ pathname: "/plant", query: { gift: "1" } }}
                  className={cn(
                    buttonVariants({ size: "lg", variant: "secondary" }),
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
