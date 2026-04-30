import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps") as Array<{
    n: string;
    title: string;
    text: string;
  }>;

  return (
    <section className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 80}>
              <div className="relative">
                <span className="font-mono text-sm font-semibold text-primary">
                  {step.n}
                </span>
                <h3 className="mt-3 text-lg font-semibold leading-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
