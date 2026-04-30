import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { Box, Scroll, Heart, Gift } from "lucide-react";

const ICONS: Record<string, typeof Box> = {
  triple: Box,
  "coming-of-age": Scroll,
  memory: Heart,
  gift: Gift,
};

const HREFS: Record<string, string> = {
  triple: "/plant",
  "coming-of-age": "/plant",
  memory: "/plant",
  gift: "/plant",
};

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");
  const list = t.raw("list") as Array<{
    code: string;
    title: string;
    subtitle: string;
    description: string;
    status: string;
    cta: string;
  }>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
        </div>
      </Reveal>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {list.map((p, i) => {
          const Icon = ICONS[p.code] ?? Box;
          return (
            <Reveal key={p.code} delay={i * 80}>
              <article className="flex h-full flex-col rounded-2xl border border-border/60 bg-card p-6 transition-shadow hover:shadow-md sm:p-7">
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-widest">
                    {p.status}
                  </Badge>
                </div>
                <h2 className="mt-5 text-xl font-semibold leading-tight sm:text-2xl">
                  {p.title}
                </h2>
                <p className="mt-1 text-sm text-primary">{p.subtitle}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
                <div className="mt-auto pt-6">
                  <Link
                    href={HREFS[p.code] ?? "/plant"}
                    className={cn(
                      buttonVariants({ size: "sm", variant: "outline" }),
                    )}
                  >
                    {p.cta}
                  </Link>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
