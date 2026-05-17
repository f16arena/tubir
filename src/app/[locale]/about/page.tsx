import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { photos } from "@/lib/data/gallery";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { PageIntro } from "@/components/editorial/PageIntro";
import { CtaBottom } from "@/components/sections/CtaBottom";

type Section = {
  num: string;
  title: string;
  text: string;
  dropCap?: boolean;
};

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

  const sections: Section[] = [
    {
      num: "01",
      title: t("missionTitle"),
      text: t("missionText"),
      dropCap: true,
    },
    {
      num: "02",
      title: tFlag("title"),
      text: tFlag("text"),
    },
    {
      num: "03",
      title: tTaza("title"),
      text: tTaza("text"),
    },
    {
      num: "04",
      title: t("teamTitle"),
      text: t("teamText"),
    },
    {
      num: "05",
      title: t("joinTitle"),
      text: t("joinText"),
    },
  ];

  return (
    <>
      <PageIntro kicker="III · О проекте" title={t("title")} />

      {/* Full-bleed image */}
      <section className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <Reveal>
            <div className="relative aspect-[21/9] overflow-hidden rounded-sm bg-muted">
              <Image
                src={photos.about}
                alt=""
                fill
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-8 sm:pt-28 sm:pb-32">
        <div className="border-t border-border/70">
          {sections.map((s, i) => (
            <Reveal key={s.num} delay={(i % 3) * 90}>
              <article className="grid items-start gap-6 border-b border-border/60 py-14 md:grid-cols-12 md:gap-10 md:py-20">
                <div className="md:col-span-3">
                  <div className="flex items-baseline gap-4 md:flex-col md:items-start">
                    <span className="num-lockup nums-tabular text-[4.5rem] leading-none text-primary sm:text-[5.5rem]">
                      {s.num}
                    </span>
                    <div className="text-serif-italic text-lg text-foreground/85 sm:text-xl">
                      {s.title}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-9">
                  <p
                    className={cn(
                      "max-w-[60ch] text-pretty text-[1.05rem] leading-[1.8] text-foreground/85 sm:text-lg",
                      s.dropCap && "drop-cap",
                    )}
                  >
                    {s.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBottom />
    </>
  );
}

