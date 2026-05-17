import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps") as Array<{
    n: string;
    title: string;
    text: string;
  }>;

  return (
    <section className="relative border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-8 pt-24 pb-12 sm:pt-32 sm:pb-16 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <div className="editorial-kicker text-muted-foreground">
              III · Как
            </div>
          </Reveal>
          <Reveal className="md:col-span-9" delay={120}>
            <h2 className="text-display text-balance text-[clamp(2.2rem,5vw,4.5rem)]">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
              <span className="text-serif-italic">{t("subtitle")}</span>
            </p>
          </Reveal>
        </div>

        <div className="border-t border-border/70">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 80}>
              <article className="group grid items-start gap-6 border-b border-border/60 py-10 md:grid-cols-12 md:gap-10 md:py-14">
                <div className="md:col-span-2">
                  <span className="num-lockup nums-tabular block text-[5rem] leading-none text-primary/40 transition-colors duration-500 group-hover:text-primary sm:text-[6rem]">
                    {step.n}
                  </span>
                </div>
                <div className="md:col-span-5">
                  <h3 className="text-display text-2xl leading-tight sm:text-3xl">
                    {step.title}
                  </h3>
                </div>
                <div className="md:col-span-5">
                  <p className="max-w-prose text-pretty text-base leading-[1.7] text-foreground/70 sm:text-lg">
                    {step.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
