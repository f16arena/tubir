import Image from "next/image";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { photos } from "@/lib/data/gallery";
import { Reveal } from "@/components/Reveal";

const TARGET_TREES = 100_000;
const PLANTED_TREES = 0;

export function Flagship() {
  const t = useTranslations("flagship");
  const pct = Math.min(100, (PLANTED_TREES / TARGET_TREES) * 100);

  return (
    <section className="relative isolate overflow-hidden border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl items-stretch gap-0 md:grid-cols-2">
        <div className="relative min-h-[280px] md:min-h-[480px]">
          <Image
            src={photos.flagship}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/10 md:bg-gradient-to-l" />
        </div>
        <Reveal className="px-4 py-16 sm:px-8 sm:py-20 md:px-12 lg:px-16">
          <Badge variant="secondary" className="mb-4">
            {t("label")}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-pretty text-primary-foreground/85 leading-relaxed">
            {t("text")}
          </p>

          <div className="mt-10 rounded-2xl bg-primary-foreground/10 p-5 backdrop-blur-sm">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-primary-foreground/80">
                {t("progressLabel")}
              </span>
              <span className="font-mono">
                {PLANTED_TREES.toLocaleString()}{" "}
                <span className="text-primary-foreground/60">
                  {t("progressOf")} {TARGET_TREES.toLocaleString()}
                </span>
              </span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-primary-foreground/15">
              <div
                className="h-full rounded-full bg-primary-foreground transition-all"
                style={{ width: `${Math.max(pct, 1.5)}%` }}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
