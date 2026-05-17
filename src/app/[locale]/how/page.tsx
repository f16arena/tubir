import { setRequestLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { PageIntro } from "@/components/editorial/PageIntro";
import { CtaBottom } from "@/components/sections/CtaBottom";

export default async function HowPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("howItWorks");
  const steps = t.raw("steps") as Array<{
    n: string;
    title: string;
    text: string;
  }>;

  return (
    <>
      <PageIntro
        kicker="II · Как"
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="border-t border-border/70">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 80}>
              <article className="group grid items-start gap-6 border-b border-border/60 py-12 md:grid-cols-12 md:gap-10 md:py-16">
                <div className="md:col-span-3">
                  <span className="num-lockup nums-tabular block text-[6rem] leading-none text-primary/35 transition-colors duration-500 group-hover:text-primary sm:text-[8rem]">
                    {step.n}
                  </span>
                </div>
                <div className="md:col-span-5">
                  <h2 className="text-display text-balance text-3xl leading-tight sm:text-4xl">
                    {step.title}
                  </h2>
                </div>
                <div className="md:col-span-4">
                  <p className="max-w-prose text-pretty text-base leading-[1.75] text-foreground/75 sm:text-lg">
                    {step.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBottom />
    </>
  );
}
