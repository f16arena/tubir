import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { CountUp } from "@/components/motion/CountUp";
import { ArrowRight } from "lucide-react";
import { getPublicStats } from "@/lib/data/public-supabase";

export async function Honest() {
  const t = await getTranslations("honest");
  const stats = await getPublicStats();
  const live = stats.bookings_count;

  return (
    <section className="relative isolate overflow-hidden border-t border-border/60 paper">
      {/* Decorative gigantic letter */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-16 select-none text-[26rem] leading-none text-primary/[0.04] sm:text-[34rem]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Túbir
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-24 sm:px-8 sm:py-32 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <div className="flex items-center gap-3 text-primary">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="editorial-kicker">{t("label")}</span>
          </div>
        </Reveal>

        <div className="md:col-span-9">
          <Reveal>
            <span
              aria-hidden
              className="block text-serif-italic text-[6rem] leading-none text-primary/30"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              &ldquo;
            </span>
            <h2 className="text-display -mt-6 text-balance text-[clamp(1.9rem,4vw,3.6rem)] leading-[1.05]">
              {t("title")}
            </h2>
          </Reveal>

          <Reveal delay={150}>
            <p className="mt-8 max-w-[60ch] text-pretty text-[1.05rem] leading-[1.8] text-foreground/80 sm:text-lg">
              {t("text")}
            </p>
          </Reveal>

          <Reveal delay={280}>
            <div className="mt-12 grid items-end gap-8 sm:grid-cols-[1fr_auto]">
              <div>
                <div className="editorial-kicker text-muted-foreground">
                  {t("counterLabel")}
                </div>
                <div className="mt-3 flex items-baseline gap-4">
                  <span className="num-lockup nums-tabular inline-flex items-baseline text-7xl text-foreground sm:text-8xl">
                    <CountUp value={live} duration={1800} />
                    <span className="caret ml-1 inline-block h-[0.7em] w-[6px] -translate-y-1 bg-primary" />
                  </span>
                  <span className="text-serif-italic text-lg text-muted-foreground sm:text-xl">
                    {t("counterOf")}
                  </span>
                </div>
                <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  <span className="inline-block h-px w-6 bg-primary" />
                  {t("counterHint")}
                </div>
              </div>

              <MagneticButton>
                <Link
                  href="/pledge"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group h-12 rounded-full px-7 text-base",
                  )}
                >
                  {t("cta")}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
