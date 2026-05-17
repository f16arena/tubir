import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatKzt } from "@/lib/data/species";
import { getSpeciesCatalog } from "@/lib/data/public-supabase";
import { speciesPhotos } from "@/lib/data/gallery";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { PageIntro } from "@/components/editorial/PageIntro";

export default async function TreesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("trees");
  const tPlant = await getTranslations("plant");
  const species = await getSpeciesCatalog();

  return (
    <>
      <PageIntro
        kicker="I · Породы"
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="border-t border-border/70">
          {species.map((s, i) => (
            <Reveal key={s.code} delay={(i % 3) * 80}>
              <article className="group grid items-center gap-6 border-b border-border/60 py-10 md:grid-cols-12 md:gap-10 md:py-14">
                <div className="md:col-span-2">
                  <span className="num-lockup nums-tabular block text-[4.5rem] leading-none text-primary/35 transition-colors duration-500 group-hover:text-primary sm:text-[5.5rem]">
                    0{i + 1}
                  </span>
                </div>

                <div className="md:col-span-3">
                  <div className="relative aspect-square overflow-hidden rounded-sm bg-muted">
                    <Image
                      src={speciesPhotos[s.code]}
                      alt={t(`list.${s.code}.name`)}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
                      className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                    />
                  </div>
                </div>

                <div className="md:col-span-4">
                  <h2 className="text-display text-2xl leading-tight sm:text-3xl">
                    {t(`list.${s.code}.name`)}
                  </h2>
                  <p className="mt-3 max-w-prose text-pretty text-base leading-[1.7] text-foreground/70">
                    {t(`list.${s.code}.description`)}
                  </p>
                  <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 py-1">
                      <dt className="editorial-kicker text-muted-foreground">
                        {t("yearsToMaturity")}
                      </dt>
                      <dd className="nums-tabular font-mono text-foreground">
                        ~{s.years_to_maturity}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 py-1">
                      <dt className="editorial-kicker text-muted-foreground">
                        CO₂
                      </dt>
                      <dd className="nums-tabular font-mono text-foreground">
                        {s.co2_kg_per_year} kg/y
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex items-end justify-between gap-4 md:col-span-3 md:flex-col md:items-end md:gap-6">
                  <div className="text-right">
                    <div className="editorial-kicker text-muted-foreground">
                      {t("perTree")}
                    </div>
                    <div className="num-lockup nums-tabular mt-2 text-4xl text-foreground sm:text-5xl">
                      {formatKzt(s.price_kzt, locale)}
                    </div>
                  </div>
                  <Link
                    href={{ pathname: "/plant", query: { species: s.code } }}
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "group/btn h-10 rounded-full px-5",
                    )}
                  >
                    {t("select")}
                    <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-xl text-center text-xs text-muted-foreground">
          <span className="text-serif-italic">{tPlant("noOnlinePay")}</span>
        </p>
      </section>
    </>
  );
}

export const dynamic = "force-static";
