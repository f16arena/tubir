import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "lucide-react";

export function Honest() {
  const t = useTranslations("honest");

  return (
    <section className="border-t border-border/60 bg-card">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            {t("label")}
          </span>
          <h2 className="mt-5 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("text")}
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 flex flex-col items-start gap-6 rounded-2xl border border-border/60 bg-muted/30 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {t("counterLabel")}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-4xl font-bold tracking-tight">
                  {t("counterValue")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {t("counterOf")}
                </span>
              </div>
              <div className="mt-1 text-xs font-medium text-primary">
                {t("counterHint")}
              </div>
            </div>
            <Link
              href="/plant"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group h-11 px-6 text-base",
              )}
            >
              {t("cta")}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
