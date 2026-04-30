import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import { contacts } from "@/lib/data/contacts";

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("business");
  const blocks = t.raw("blocks") as Array<{ title: string; text: string }>;
  const idealItems = t.raw("idealItems") as string[];

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
        <div className="mt-16 rounded-2xl border border-border/60 bg-muted/30 p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight">{t("ideal")}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {idealItems.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-16 overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground sm:p-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("ctaTitle")}
          </h2>
          <p className="mt-3 max-w-xl text-primary-foreground/85">{t("ctaText")}</p>
          <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <a
              href={`mailto:${contacts.email}?subject=Túbir%20%E2%80%94%20%D0%9A%D0%BE%D1%80%D0%BF%D0%BE%D1%80%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D0%B0%D1%8F%20%D0%BF%D0%BE%D1%81%D0%B0%D0%B4%D0%BA%D0%B0`}
              className={cn(
                buttonVariants({ size: "lg", variant: "secondary" }),
                "group h-11 px-6 text-base",
              )}
            >
              {t("ctaButton")}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <Link
              href="/plant"
              className="text-sm text-primary-foreground/80 underline-offset-4 hover:text-primary-foreground hover:underline"
            >
              {contacts.email}
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
