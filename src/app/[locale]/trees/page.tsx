import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatKzt } from "@/lib/data/species";
import { getSpeciesCatalog } from "@/lib/data/public-supabase";
import { speciesPhotos } from "@/lib/data/gallery";
import { TreePine, TreeDeciduous, Apple, Cherry } from "lucide-react";
import type { SpeciesCode } from "@/lib/db/types";
import { Reveal } from "@/components/Reveal";

const ICONS: Record<SpeciesCode, typeof TreePine> = {
  pine: TreePine,
  birch: TreeDeciduous,
  spruce: TreePine,
  oak: TreeDeciduous,
  apple: Apple,
  apricot: Cherry,
};

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
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {species.map((s, i) => {
          const Icon = ICONS[s.code];
          return (
            <Reveal key={s.code} delay={(i % 3) * 80}>
              <article
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={speciesPhotos[s.code]}
                  alt={t(`list.${s.code}.name`)}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-background/90 text-primary shadow-sm backdrop-blur">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-semibold leading-tight">
                  {t(`list.${s.code}.name`)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {t(`list.${s.code}.description`)}
                </p>

                <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-muted/50 px-3 py-2">
                    <dt className="text-muted-foreground">
                      {t("yearsToMaturity")}
                    </dt>
                    <dd className="mt-0.5 font-mono text-sm font-semibold">
                      ~{s.years_to_maturity}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-muted/50 px-3 py-2">
                    <dt className="text-muted-foreground">{t("co2")}</dt>
                    <dd className="mt-0.5 font-mono text-sm font-semibold">
                      {s.co2_kg_per_year} kg/y
                    </dd>
                  </div>
                </dl>

                <div className="mt-auto flex items-end justify-between border-t border-border/60 pt-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {t("perTree")}
                    </div>
                    <div className="mt-0.5 text-2xl font-bold tracking-tight">
                      {formatKzt(s.price_kzt, locale)}
                    </div>
                  </div>
                  <Link
                    href={{ pathname: "/plant", query: { species: s.code } }}
                    className={cn(buttonVariants({ size: "sm" }))}
                  >
                    {t("select")}
                  </Link>
                </div>
              </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <p className="mx-auto mt-12 max-w-2xl rounded-lg border border-border/60 bg-muted/30 p-4 text-center text-xs text-muted-foreground">
        {tPlant("noOnlinePay")}
      </p>
    </div>
  );
}

// Trees page renders the catalogue inside <main>; the global footer follows.
// We surface a CTA right above the footer:
export const dynamic = "force-static";
