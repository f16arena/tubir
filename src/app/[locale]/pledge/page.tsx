import { setRequestLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { PageIntro } from "@/components/editorial/PageIntro";
import { PledgeForm } from "./PledgeForm";
import { getPublicStats } from "@/lib/data/public-supabase";

const FOUNDERS_TARGET = 100;

export default async function PledgePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pledge");
  const stats = await getPublicStats();
  const claimed = stats.pledges_count;
  const remaining = Math.max(0, FOUNDERS_TARGET - claimed);

  return (
    <>
      <PageIntro
        kicker={t("kicker")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="grid gap-12 border-t border-border/70 pt-12 md:grid-cols-12 md:gap-16">
          {/* Left column — what you get */}
          <div className="md:col-span-5">
            <Reveal>
              <div className="editorial-kicker text-muted-foreground">
                {t("counterKicker")}
              </div>
              <div className="mt-4 flex items-baseline gap-4">
                <span className="num-lockup nums-tabular text-7xl text-primary sm:text-8xl">
                  <CountUp value={claimed} duration={1600} />
                </span>
                <span className="text-serif-italic text-lg text-muted-foreground sm:text-xl">
                  {t("counterOf")} {FOUNDERS_TARGET}
                </span>
              </div>
              <div className="mt-3 text-sm">
                <span className="editorial-kicker text-primary">
                  {remaining > 0
                    ? t("counterRemaining", { n: remaining })
                    : t("counterFull")}
                </span>
              </div>
              <div className="mt-6 h-[2px] w-full bg-border">
                <div
                  className="block h-full origin-left bg-primary transition-[width] duration-[1600ms] ease-out"
                  style={{
                    width: `${Math.max((claimed / FOUNDERS_TARGET) * 100, 0.4)}%`,
                  }}
                />
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-12 space-y-6">
                <div>
                  <div className="editorial-kicker text-muted-foreground">
                    {t("perksKicker")}
                  </div>
                  <ol className="mt-4 space-y-4">
                    {(t.raw("perks") as string[]).map((perk, i) => (
                      <li
                        key={perk}
                        className="grid grid-cols-[auto_1fr] items-baseline gap-4"
                      >
                        <span className="num-lockup nums-tabular text-xl text-primary">
                          0{i + 1}
                        </span>
                        <span className="text-pretty text-base leading-[1.6] text-foreground/85">
                          {perk}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <p className="mt-10 max-w-prose text-sm text-muted-foreground">
                <span className="text-serif-italic">{t("note")}</span>
              </p>
            </Reveal>
          </div>

          {/* Right column — form */}
          <div className="md:col-span-7">
            <Reveal delay={180}>
              <PledgeForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
