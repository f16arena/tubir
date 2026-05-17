"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { photos } from "@/lib/data/gallery";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { CountUp } from "@/components/motion/CountUp";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { useInView } from "@/components/motion/useInView";

function SloganDisplay({ text }: { text: string }) {
  const { ref, inView } = useInView<HTMLHeadingElement>({ threshold: 0.1 });
  const words = text.split(/\s+/);
  const last = words.pop() ?? "";

  return (
    <h1
      ref={ref}
      className="text-display mt-8 text-balance text-[clamp(2.6rem,7.5vw,6.5rem)] text-white"
    >
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className={cn("split-word mr-[0.18em]", inView && "is-in")}
        >
          <span style={{ transitionDelay: `${120 + i * 70}ms` }}>{w}</span>
        </span>
      ))}
      <span className={cn("split-word", inView && "is-in")}>
        <span
          className="text-serif-italic"
          style={{
            transitionDelay: `${120 + words.length * 70}ms`,
            color: "oklch(0.92 0.1 130)",
          }}
        >
          {last}
        </span>
      </span>
    </h1>
  );
}

export function Hero() {
  const t = useTranslations("hero");
  const stats = t.raw("stats") as Array<{ value: string; label: string }>;

  return (
    <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
      {/* Background photo with Ken Burns + grain */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 ken-burns">
          <Image
            src={photos.hero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_80%)]" />
        <div className="grain absolute inset-0" />
      </div>

      <div className="mx-auto grid min-h-[92vh] max-w-7xl grid-rows-[1fr_auto] gap-12 px-4 pt-28 pb-10 sm:px-8 sm:pt-32 lg:pt-40">
        {/* Top — editorial cover */}
        <div className="max-w-5xl">
          <Parallax speed={28}>
            <Reveal>
              <div className="flex items-center gap-3 text-white/80">
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-300/60" />
                  <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-emerald-300" />
                </span>
                <span className="editorial-kicker text-white/85">
                  {t("tagline")} · ВКО · 2026—
                </span>
              </div>
            </Reveal>
          </Parallax>

          <Parallax speed={48} className="mt-2">
            <SloganDisplay text={t("slogan")} />
          </Parallax>

          <Parallax speed={20}>
            <Reveal delay={400}>
              <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-start">
                <span
                  aria-hidden
                  className="hidden h-[1.6em] w-px translate-y-1 bg-white/30 sm:block"
                />
                <p className="max-w-2xl text-pretty text-[1.05rem] leading-[1.6] text-white/85 sm:text-lg">
                  {t("lead")}
                </p>
              </div>
            </Reveal>
          </Parallax>

          <Reveal delay={620}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <MagneticButton>
                <Link
                  href="/plant"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group relative h-14 rounded-full px-8 text-base shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]",
                  )}
                >
                  <span className="relative z-10 inline-flex items-center gap-2">
                    {t("cta")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </MagneticButton>
              <Link
                href="/how"
                className="group inline-flex items-center gap-2 border-b border-white/30 pb-1 text-sm text-white/85 transition-colors hover:border-white hover:text-white"
              >
                <span className="editorial-kicker">{t("ctaSecondary")}</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={900}>
            <div className="mt-16 flex items-center gap-3 text-white/55">
              <ArrowDown className="h-3.5 w-3.5 animate-bounce [animation-duration:2.4s]" />
              <span className="editorial-kicker">scroll</span>
            </div>
          </Reveal>
        </div>

        {/* Bottom editorial stats strip */}
        <Reveal delay={300}>
          <dl className="grid grid-cols-1 gap-y-8 border-t border-white/15 pt-10 sm:grid-cols-3 sm:gap-x-12">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  "flex items-baseline gap-6 sm:flex-col sm:items-start sm:gap-3",
                  i > 0 && "sm:border-l sm:border-white/15 sm:pl-12",
                )}
              >
                <span className="num-lockup nums-tabular text-4xl text-white sm:text-5xl md:text-6xl">
                  <CountUp value={s.value} duration={1800} />
                </span>
                <span className="editorial-kicker max-w-[12rem] text-white/55">
                  {s.label}
                </span>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
