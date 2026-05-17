import { setRequestLocale, getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { PageIntro } from "@/components/editorial/PageIntro";
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
    <>
      <PageIntro
        kicker="B2B · ESG"
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

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-8">
        <div className="border-t border-border/70">
          {blocks.map((b, i) => (
            <Reveal key={b.title} delay={(i % 2) * 80}>
              <article className="grid items-start gap-6 border-b border-border/60 py-12 md:grid-cols-12 md:gap-10 md:py-16">
                <div className="md:col-span-3">
                  <div className="flex items-baseline gap-4 md:flex-col md:items-start">
                    <span className="num-lockup nums-tabular text-[3.5rem] leading-none text-primary sm:text-[4.5rem]">
                      0{i + 1}
                    </span>
                  </div>
                </div>
                <div className="md:col-span-5">
                  <h2 className="text-display text-balance text-2xl leading-tight sm:text-3xl">
                    {b.title}
                  </h2>
                </div>
                <div className="md:col-span-4">
                  <p className="max-w-prose text-pretty text-base leading-[1.75] text-foreground/75">
                    {b.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-8">
        <Reveal>
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="editorial-kicker text-muted-foreground">
                Для кого
              </div>
              <h2 className="text-display mt-3 text-3xl leading-tight sm:text-4xl">
                {t("ideal")}
              </h2>
            </div>
            <ul className="md:col-span-8">
              {idealItems.map((item, i) => (
                <li
                  key={item}
                  className="flex items-start gap-6 border-b border-border/60 py-5"
                >
                  <span className="num-lockup nums-tabular w-8 text-2xl leading-none text-primary/55">
                    0{i + 1}
                  </span>
                  <span className="text-pretty text-base leading-[1.7] text-foreground/85 sm:text-lg">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
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
              Договоримся
            </div>
          </Reveal>
          <Reveal delay={120} className="md:col-span-9">
            <h2 className="text-display text-balance text-[clamp(2rem,4vw,3.6rem)] leading-[1.05]">
              {t("ctaTitle")}
            </h2>
            <p className="mt-6 max-w-[60ch] text-pretty leading-[1.75] text-primary-foreground/85">
              {t("ctaText")}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <MagneticButton>
                <a
                  href={`mailto:${contacts.email}?subject=T%C3%BAbir%20%E2%80%94%20%D0%9A%D0%BE%D1%80%D0%BF%D0%BE%D1%80%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D0%B0%D1%8F%20%D0%BF%D0%BE%D1%81%D0%B0%D0%B4%D0%BA%D0%B0`}
                  className={cn(
                    buttonVariants({ size: "lg", variant: "secondary" }),
                    "group h-12 rounded-full px-7 text-base",
                  )}
                >
                  {t("ctaButton")}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </MagneticButton>
              <a
                href={`mailto:${contacts.email}`}
                className="text-serif-italic text-primary-foreground/80 ink-underline hover:text-primary-foreground"
              >
                {contacts.email}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
