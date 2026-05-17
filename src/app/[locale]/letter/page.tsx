import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";

export default async function LetterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("letter");
  const paragraphs = t.raw("paragraphs") as Array<{
    title?: string;
    body: string;
  }>;

  return (
    <>
      <header className="mx-auto max-w-7xl px-4 pt-24 sm:px-8 sm:pt-32">
        <Reveal>
          <div className="editorial-kicker text-muted-foreground">
            {t("eyebrow")}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="text-display mt-6 max-w-5xl text-balance text-[clamp(2.4rem,6vw,5.5rem)] leading-[1.02]">
            {t("title")}
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-8 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            <span className="text-serif-italic">{t("lead")}</span>
          </p>
        </Reveal>
      </header>

      <article className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-8 sm:pt-24 sm:pb-16">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-3">
            <div className="sticky top-24 space-y-3 text-sm">
              <div className="editorial-kicker text-muted-foreground">
                {t("metaLabel")}
              </div>
              <div className="text-serif-italic text-base text-foreground">
                {t("metaAuthor")}
              </div>
              <div className="text-muted-foreground">{t("metaLocation")}</div>
              <div className="text-muted-foreground">{t("metaDate")}</div>
            </div>
          </Reveal>

          <div className="md:col-span-9">
            <div className="border-t border-border/70">
              {paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 60}>
                  <section className="grid items-start gap-6 border-b border-border/60 py-10 md:grid-cols-[auto_1fr] md:gap-10 md:py-14">
                    <div className="md:w-20">
                      <span className="num-lockup nums-tabular text-3xl text-primary/55 sm:text-4xl">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {p.title ? (
                        <div className="mt-3 hidden text-serif-italic text-lg text-foreground/85 md:block">
                          {p.title}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      {p.title ? (
                        <h2 className="text-display text-2xl leading-tight text-foreground/95 md:hidden">
                          {p.title}
                        </h2>
                      ) : null}
                      <p
                        className={cn(
                          "text-pretty text-[1.1rem] leading-[1.85] text-foreground/85 sm:text-[1.15rem]",
                          i === 0 && "drop-cap",
                        )}
                      >
                        {p.body}
                      </p>
                    </div>
                  </section>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120}>
              <div className="mt-12 flex flex-col items-start gap-3 border-l-2 border-primary pl-6">
                <div className="text-serif-italic text-2xl text-foreground sm:text-3xl">
                  — {t("signatureName")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("signatureMeta")}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </article>

      {/* Pledge CTA */}
      <section className="relative isolate overflow-hidden border-t border-border/60 paper">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-24 sm:px-8 sm:py-32 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <div className="flex items-center gap-3 text-primary">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <span className="editorial-kicker">{t("ctaKicker")}</span>
            </div>
          </Reveal>
          <Reveal className="md:col-span-9" delay={120}>
            <h2 className="text-display text-balance text-[clamp(2rem,4.5vw,4rem)] leading-[1.04]">
              {t("ctaTitle")}
            </h2>
            <p className="mt-6 max-w-[58ch] text-pretty leading-[1.75] text-foreground/80 sm:text-lg">
              <span className="text-serif-italic">{t("ctaText")}</span>
            </p>
            <div className="mt-10">
              <MagneticButton>
                <Link
                  href="/pledge"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group h-12 rounded-full px-7 text-base",
                  )}
                >
                  {t("ctaButton")}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
