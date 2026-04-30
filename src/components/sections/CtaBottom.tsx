import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CtaBottom() {
  const t = useTranslations("ctaBottom");

  return (
    <section className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-3 text-muted-foreground">{t("text")}</p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/plant"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group h-11 px-6 text-base",
            )}
          >
            {t("button")}
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
