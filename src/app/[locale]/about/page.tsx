import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { photos } from "@/lib/data/gallery";
import { CtaBottom } from "@/components/sections/CtaBottom";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tFlag = await getTranslations("flagship");
  const tTaza = await getTranslations("tazaQazaqstan");

  return (
    <>
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        {t("title")}
      </h1>

      <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border/60">
        <Image
          src={photos.about}
          alt=""
          fill
          sizes="(min-width: 1024px) 768px, 100vw"
          className="object-cover"
        />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("missionTitle")}
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
          {t("missionText")}
        </p>
      </section>

      <section className="mt-12 rounded-2xl border border-border/60 bg-muted/30 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          {tFlag("title")}
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
          {tFlag("text")}
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          {tTaza("title")}
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
          {tTaza("text")}
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("teamTitle")}
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
          {t("teamText")}
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("joinTitle")}
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
          {t("joinText")}
        </p>
      </section>
    </article>
    <CtaBottom />
    </>
  );
}
