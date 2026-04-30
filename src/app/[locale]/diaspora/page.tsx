import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

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
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg text-foreground/90 leading-relaxed">
            {t("lead")}
          </p>
        </div>
      </Reveal>

      <div className="mt-16 grid gap-5 sm:grid-cols-2">
        {blocks.map((b, i) => (
          <Reveal key={b.title} delay={i * 80}>
            <Card className="h-full border-border/60 transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {b.text}
                </p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-card p-6 text-center sm:p-7">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t("currencies")}
          </div>
          <div className="mt-3 flex items-center justify-center gap-3 text-2xl font-semibold tracking-tight">
            <span>USD</span>
            <span className="text-border">·</span>
            <span>EUR</span>
            <span className="text-border">·</span>
            <span>KZT</span>
          </div>
          <p className="mx-auto mt-3 max-w-md text-xs text-muted-foreground">
            {t("currenciesNote")}
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-16 rounded-2xl border border-border/60 bg-muted/30 p-8 text-center sm:p-12">
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t("ctaText")}</p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/plant"
              className={cn(
                buttonVariants({ size: "lg" }),
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
