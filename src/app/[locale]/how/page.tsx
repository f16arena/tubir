import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { CtaBottom } from "@/components/sections/CtaBottom";

export default async function HowPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("howItWorks");
  const tHero = await getTranslations("hero");
  const steps = t.raw("steps") as Array<{
    n: string;
    title: string;
    text: string;
  }>;

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
          </div>
        </Reveal>

        <div className="mt-16 space-y-10">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 80}>
              <div className="grid gap-6 border-l-2 border-primary/30 pl-8 sm:grid-cols-[auto_1fr] sm:gap-10 sm:border-l-0 sm:pl-0">
                <div className="font-mono text-5xl font-bold text-primary/20 leading-none sm:text-7xl">
                  {step.n}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold leading-tight">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {step.text}
                  </p>
                  {i === steps.length - 1 ? null : (
                    <div aria-hidden className="mt-8 h-px w-12 bg-border" />
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <Link
            href="/plant"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group h-11 px-6 text-base",
            )}
          >
            {tHero("cta")}
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
      <CtaBottom />
    </>
  );
}
