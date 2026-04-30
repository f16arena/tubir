import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

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
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {lastUpdated}
      </div>
      <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 text-pretty text-lg text-muted-foreground leading-relaxed">
        {lead}
      </p>

      <div className="mt-12 space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-xl font-semibold tracking-tight">{s.title}</h2>
            <p className="mt-2 text-pretty text-muted-foreground leading-relaxed">
              {s.text}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
