import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "lucide-react";
import { photos } from "@/lib/data/gallery";

export default async function PolygonPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("polygon");
  const blocks = t.raw("blocks") as Array<{ title: string; text: string }>;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 -z-10 opacity-25">
          <Image src={photos.future} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/80 to-foreground" />
        </div>
        <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <Badge variant="secondary" className="mb-5">
            {t("label")}
          </Badge>
          <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-background/85">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <p className="text-pretty text-xl leading-relaxed text-foreground/90">
            {t("lead")}
          </p>
        </Reveal>

        <Reveal>
          <h2 className="mt-16 text-2xl font-semibold tracking-tight">
            {t("concept")}
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            {t("conceptText")}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {blocks.map((b, i) => (
            <Reveal key={b.title} delay={i * 80}>
              <Card className="h-full border-border/60">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {b.text}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center sm:p-7">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("statusLabel")}
            </div>
            <p className="mt-2 text-base font-medium">{t("statusValue")}</p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-16 rounded-2xl bg-primary p-8 text-primary-foreground sm:p-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("cta")}
            </h2>
            <p className="mt-3 max-w-xl text-primary-foreground/85">{t("ctaText")}</p>
            <div className="mt-6">
              <Link
                href="/plant"
                className={cn(
                  buttonVariants({ size: "lg", variant: "secondary" }),
                  "group h-11 px-6 text-base",
                )}
              >
                {t("cta")}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </article>
    </>
  );
}
