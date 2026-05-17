import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";

export function CtaBottom() {
  const t = useTranslations("ctaBottom");

  return (
    <section className="relative isolate overflow-hidden border-t border-border/60 bg-neutral-950 text-white">
      <div
        aria-hidden
        className="halftone absolute inset-0 text-white/80"
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent" />

      <div className="relative mx-auto max-w-5xl px-4 py-28 text-center sm:px-8 sm:py-40">
        <Reveal>
          <span className="editorial-kicker text-white/55">finale</span>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="text-display mx-auto mt-6 max-w-4xl text-balance text-[clamp(2.2rem,5.5vw,4.8rem)] leading-[1.02]">
            {t("title")}
          </h2>
        </Reveal>
        <Reveal delay={240}>
          <p className="mx-auto mt-8 max-w-xl text-pretty text-white/70 sm:text-lg">
            <span className="text-serif-italic">{t("text")}</span>
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div className="mt-12 flex justify-center">
            <MagneticButton strength={18}>
              <Link
                href="/plant"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group h-14 rounded-full px-9 text-base shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]",
                )}
              >
                {t("button")}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
