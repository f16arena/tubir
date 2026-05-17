import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { PageIntro } from "@/components/editorial/PageIntro";
import { ArrowRight } from "lucide-react";

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
    <>
      <PageIntro
        kicker="Особые форматы"
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="border-t border-border/70">
          {list.map((p, i) => (
            <Reveal key={p.code} delay={(i % 2) * 80}>
              <article className="group grid items-start gap-8 border-b border-border/60 py-14 md:grid-cols-12 md:gap-10 md:py-20">
                <div className="md:col-span-3">
                  <div className="flex items-baseline gap-4 md:flex-col md:items-start">
                    <span className="num-lockup nums-tabular text-[4.5rem] leading-none text-primary sm:text-[5.5rem]">
                      0{i + 1}
                    </span>
                    <span className="editorial-kicker text-muted-foreground">
                      {p.status}
                    </span>
                  </div>
                </div>
                <div className="md:col-span-6">
                  <h2 className="text-display text-balance text-3xl leading-tight sm:text-4xl">
                    {p.title}
                  </h2>
                  <p className="mt-3 text-serif-italic text-lg text-primary sm:text-xl">
                    {p.subtitle}
                  </p>
                  <p className="mt-6 max-w-prose text-pretty text-[1.05rem] leading-[1.75] text-foreground/80 sm:text-lg">
                    {p.description}
                  </p>
                </div>
                <div className="md:col-span-3 md:flex md:justify-end">
                  <Link
                    href={HREFS[p.code] ?? "/plant"}
                    className={cn(
                      buttonVariants({ size: "sm", variant: "outline" }),
                      "group/btn h-11 rounded-full px-6 text-base",
                    )}
                  >
                    {p.cta}
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
