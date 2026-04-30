import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Gift, Check } from "lucide-react";
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
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Gift className="h-5 w-5" />
          </div>
          <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg text-foreground/90 leading-relaxed">
            {t("lead")}
          </p>
        </div>
      </Reveal>

      <div className="mt-16 grid gap-10 md:grid-cols-2 md:items-start">
        <Reveal>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{t("stepsTitle")}</h2>
            <ol className="mt-5 space-y-4">
              {steps.map((step, i) => (
                <li key={step} className="flex items-start gap-3 text-sm">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>

            <h3 className="mt-10 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("occasionsTitle")}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {occasions.map((o) => (
                <li
                  key={o}
                  className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground/80"
                >
                  {o}
                </li>
              ))}
            </ul>

            <Card className="mt-8 border-primary/30 bg-primary/5">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <div className="text-sm font-semibold">{t("noteTitle")}</div>
                    <p className="mt-1 text-sm text-foreground/80">{t("noteText")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <SampleCertificate />
        </Reveal>
      </div>

      <Reveal>
        <div className="mt-16 rounded-2xl bg-primary p-8 text-primary-foreground sm:p-12">
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            {t("ctaText")}
          </p>
          <div className="mt-6">
            <Link
              href={{ pathname: "/plant", query: { gift: "1" } }}
              className={cn(
                buttonVariants({ size: "lg", variant: "secondary" }),
                "group h-11 px-6 text-base",
              )}
            >
              {t("ctaButton")}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
