import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { photos } from "@/lib/data/gallery";

export function Hero() {
  const t = useTranslations("hero");
  const stats = t.raw("stats") as Array<{ value: string; label: string }>;

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={photos.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/85" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-24 pb-12 sm:px-6 sm:pt-32 sm:pb-16 lg:pt-40">
        <div className="mx-auto max-w-3xl text-center text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-white/85 backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
            {t("badge")}
          </span>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            {t("tagline")}
          </p>
          <h1 className="mt-6 text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            {t("slogan")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-white/85 sm:text-xl">
            {t("lead")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/plant"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group h-12 px-7 text-base shadow-lg shadow-black/20",
              )}
            >
              {t("cta")}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/how"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-12 border-white/30 bg-white/10 px-7 text-base text-white backdrop-blur hover:bg-white/20 hover:text-white",
              )}
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>

        <dl className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/5 backdrop-blur sm:mt-24">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white/5 px-4 py-5 text-center sm:px-6 sm:py-6"
            >
              <dt className="text-[10px] font-medium uppercase tracking-widest text-white/60 sm:text-xs">
                {s.label}
              </dt>
              <dd className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
