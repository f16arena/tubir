import { setRequestLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { PageIntro } from "@/components/editorial/PageIntro";

type Stat = {
  value: string;
  unit?: string;
  label: string;
  source: string;
  sourceUrl?: string;
};

type Block = {
  title: string;
  stats: Stat[];
};

export default async function NumbersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("numbers");
  const blocks = t.raw("blocks") as Block[];

  return (
    <>
      <PageIntro
        kicker={t("kicker")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-8">
        <Reveal>
          <p className="mx-auto max-w-[58ch] text-pretty text-[1.05rem] leading-[1.85] text-foreground/85 sm:text-xl">
            <span className="text-serif-italic">{t("lead")}</span>
          </p>
        </Reveal>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-8">
        <div className="space-y-20 sm:space-y-28">
          {blocks.map((b, bi) => (
            <Reveal key={b.title} delay={bi * 60}>
              <div className="grid gap-8 md:grid-cols-12">
                <div className="md:col-span-3">
                  <div className="editorial-kicker text-muted-foreground">
                    {String(bi + 1).padStart(2, "0")} · {t("blockMeta")}
                  </div>
                  <h2 className="text-display mt-3 text-balance text-2xl leading-tight sm:text-3xl">
                    {b.title}
                  </h2>
                </div>
                <div className="md:col-span-9">
                  <dl className="border-t border-border/70">
                    {b.stats.map((s, i) => (
                      <Reveal key={s.label + i} delay={i * 60}>
                        <div className="grid items-baseline gap-4 border-b border-border/60 py-7 md:grid-cols-[12rem_1fr_auto] md:gap-8">
                          <dt className="order-2 md:order-1">
                            <div className="num-lockup nums-tabular text-4xl text-foreground sm:text-5xl">
                              <CountUp value={s.value} duration={1500} />
                              {s.unit ? (
                                <span className="ml-1 text-2xl text-foreground/60 sm:text-3xl">
                                  {s.unit}
                                </span>
                              ) : null}
                            </div>
                          </dt>
                          <dd className="order-1 max-w-prose text-pretty text-base leading-[1.6] text-foreground/85 md:order-2 sm:text-lg">
                            {s.label}
                          </dd>
                          <div className="order-3 max-w-[12rem] text-xs text-muted-foreground">
                            <div className="editorial-kicker mb-1 text-muted-foreground">
                              {t("source")}
                            </div>
                            {s.sourceUrl ? (
                              <a
                                href={s.sourceUrl}
                                target="_blank"
                                rel="noopener nofollow"
                                className="ink-underline text-serif-italic"
                              >
                                {s.source}
                              </a>
                            ) : (
                              <span className="text-serif-italic">
                                {s.source}
                              </span>
                            )}
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </dl>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-20 max-w-2xl pb-24 text-center text-sm text-muted-foreground sm:pb-32">
          <span className="text-serif-italic">{t("disclaimer")}</span>
        </p>
      </section>
    </>
  );
}
