import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Reveal } from "@/components/motion/Reveal";

const TYPES = ["offer", "privacy", "refund"] as const;
type LegalType = (typeof TYPES)[number];

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    TYPES.map((type) => ({ locale, type })),
  );
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale, type } = await params;
  if (!TYPES.includes(type as LegalType)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("legal");
  const titleKey = `${type}Title` as const;
  const leadKey = `${type}Lead` as const;
  const sectionsKey = `${type}Sections` as const;

  const title = t(titleKey);
  const lead = t(leadKey);
  const sections = t.raw(sectionsKey) as Array<{ title: string; text: string }>;
  const lastUpdated = t("lastUpdated");

  return (
    <>
      <header className="mx-auto grid max-w-7xl gap-8 px-4 pt-24 pb-12 sm:px-8 sm:pt-32 sm:pb-16 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <div className="editorial-kicker text-muted-foreground">
            {lastUpdated}
          </div>
        </Reveal>
        <Reveal className="md:col-span-9" delay={120}>
          <h1 className="text-display text-balance text-[clamp(2.4rem,5vw,4.5rem)]">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            <span className="text-serif-italic">{lead}</span>
          </p>
        </Reveal>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="border-t border-border/70">
          {sections.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 60}>
              <article className="grid items-start gap-6 border-b border-border/60 py-10 md:grid-cols-12 md:gap-10 md:py-12">
                <div className="md:col-span-4">
                  <h2 className="text-display text-balance text-xl leading-tight sm:text-2xl">
                    {s.title}
                  </h2>
                </div>
                <div className="md:col-span-8">
                  <p className="max-w-prose text-pretty text-base leading-[1.75] text-foreground/80">
                    {s.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
