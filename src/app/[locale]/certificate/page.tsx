import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { PageIntro } from "@/components/editorial/PageIntro";
import { SampleCertificate } from "@/components/SampleCertificate";

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
    <>
      <PageIntro
        kicker="Документ"
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

      <section className="mx-auto mt-16 max-w-5xl px-4 sm:mt-24 sm:px-8">
        <Reveal>
          <SampleCertificate />
        </Reveal>
      </section>

      <section className="mx-auto mt-20 grid max-w-7xl gap-12 px-4 sm:mt-28 sm:px-8 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <div className="editorial-kicker text-muted-foreground">
            {t("elementsTitle")}
          </div>
          <ul className="mt-6 border-t border-border/70">
            {elements.map((el, i) => (
              <li
                key={el}
                className="flex items-baseline gap-6 border-b border-border/60 py-5"
              >
                <span className="num-lockup nums-tabular w-12 text-3xl leading-none text-primary/60">
                  0{i + 1}
                </span>
                <span className="text-pretty text-base leading-[1.7] text-foreground/85 sm:text-lg">
                  {el}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="md:col-span-5" delay={120}>
          <div className="sticky top-24 border-l-2 border-primary pl-6">
            <div className="editorial-kicker text-primary">{t("noteTitle")}</div>
            <p className="mt-3 max-w-prose text-pretty text-base leading-[1.7] text-foreground/85">
              {t("noteText")}
            </p>
            <div className="mt-8">
              <MagneticButton>
                <Link
                  href="/plant"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group h-12 rounded-full px-7 text-base",
                  )}
                >
                  {tHero("cta")}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="h-24 sm:h-32" />
    </>
  );
}
