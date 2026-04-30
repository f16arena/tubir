import { setRequestLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/Reveal";
import { SampleCertificate } from "@/components/SampleCertificate";
import { Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("certificate");
  const tHero = await getTranslations("hero");
  const elements = t.raw("elements") as string[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
          <p className="mx-auto mt-8 max-w-xl text-pretty text-base text-foreground/80 leading-relaxed">
            {t("lead")}
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-12">
          <SampleCertificate />
        </div>
      </Reveal>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        <Reveal>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              {t("elementsTitle")}
            </h2>
            <ul className="mt-4 space-y-3">
              {elements.map((el) => (
                <li key={el} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{el}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-6 sm:p-7">
            <h2 className="text-xl font-semibold tracking-tight">{t("noteTitle")}</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {t("noteText")}
            </p>
            <div className="mt-6">
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
        </Reveal>
      </div>
    </div>
  );
}
