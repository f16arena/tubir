import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { photos } from "@/lib/data/gallery";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { getProjectProgress } from "@/lib/data/public-supabase";

export async function Flagship() {
  const t = await getTranslations("flagship");
  const progress = await getProjectProgress();
  const pct =
    progress.target_trees > 0
      ? Math.min(100, (progress.current_trees / progress.target_trees) * 100)
      : 0;

  return (
    <section className="relative isolate overflow-hidden border-t border-primary/30 bg-primary text-primary-foreground">
      <div
        aria-hidden
        className="halftone absolute inset-0 text-primary-foreground"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/85" />

      <div className="relative mx-auto grid max-w-7xl items-stretch gap-0 md:grid-cols-12">
        <div className="relative min-h-[320px] md:col-span-5 md:min-h-[560px]">
          <Image
            src={photos.flagship}
            alt=""
            fill
            sizes="(min-width: 768px) 42vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-primary/70 md:bg-gradient-to-l md:from-transparent md:to-primary" />
        </div>

        <div className="md:col-span-7">
          <Reveal className="px-4 py-20 sm:px-10 sm:py-24 md:px-14 lg:px-20">
            <div className="flex items-center gap-3 text-primary-foreground/80">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-foreground" />
              <span className="editorial-kicker">{t("label")}</span>
            </div>

            <h2 className="text-display mt-6 text-balance text-[clamp(2rem,4.5vw,4rem)] leading-[1.05]">
              {t("title")}
            </h2>

            <p className="mt-6 max-w-[58ch] text-pretty leading-[1.75] text-primary-foreground/85">
              {t("text")}
            </p>

            <div className="mt-12 rounded-sm border border-primary-foreground/20 bg-primary-foreground/[0.06] p-6 backdrop-blur-sm sm:p-8">
              <div className="editorial-kicker text-primary-foreground/70">
                {t("progressLabel")}
              </div>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="num-lockup nums-tabular text-6xl text-primary-foreground sm:text-7xl">
                  <CountUp value={progress.current_trees} duration={1800} />
                </span>
                <span className="text-serif-italic text-base text-primary-foreground/65 sm:text-lg">
                  {t("progressOf")}{" "}
                  {progress.target_trees.toLocaleString("ru-RU")}
                </span>
              </div>
              <div className="mt-6 h-[2px] w-full bg-primary-foreground/20">
                <div
                  className="block h-full origin-left bg-primary-foreground transition-[width] duration-[1800ms] ease-out"
                  style={{ width: `${Math.max(pct, 0.4)}%` }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
