import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { PageIntro } from "@/components/editorial/PageIntro";
import { contacts } from "@/lib/data/contacts";

type Stream = {
  key: "b2b" | "b2g" | "grants";
  number: string;
  audience: string;
  title: string;
  text: string;
  ideal: string[];
  ctaTitle: string;
  ctaText: string;
  contactSubject: string;
  linkTo?: string;
  linkLabel?: string;
};

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("partners");
  const streams = t.raw("streams") as Stream[];

  return (
    <>
      <PageIntro
        kicker={t("kicker")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-8">
        <Reveal>
          <p className="drop-cap mx-auto max-w-[58ch] text-pretty text-[1.1rem] leading-[1.85] text-foreground/85 sm:text-xl">
            {t("lead")}
          </p>
        </Reveal>
      </section>

      {/* Index of streams */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-8">
        <nav className="grid gap-3 border-t border-border/70 sm:grid-cols-3 sm:gap-0">
          {streams.map((s) => (
            <a
              key={s.key}
              href={`#${s.key}`}
              className="group flex flex-col gap-3 border-b border-border/60 py-6 transition-colors hover:bg-muted/30 sm:border-b-0 sm:border-r sm:px-6 sm:py-8 sm:last:border-r-0"
            >
              <span className="num-lockup nums-tabular text-3xl text-primary/40 transition-colors group-hover:text-primary">
                {s.number}
              </span>
              <span className="text-serif-italic text-xl text-foreground sm:text-2xl">
                {s.title}
              </span>
              <span className="editorial-kicker text-muted-foreground">
                {s.audience}
              </span>
            </a>
          ))}
        </nav>
      </section>

      {/* Each stream as section */}
      {streams.map((s) => (
        <section
          key={s.key}
          id={s.key}
          className="mx-auto mt-24 max-w-7xl scroll-mt-20 px-4 sm:mt-32 sm:px-8"
        >
          <Reveal>
            <div className="grid gap-8 md:grid-cols-12">
              <div className="md:col-span-3">
                <div className="num-lockup nums-tabular text-7xl text-primary sm:text-8xl">
                  {s.number}
                </div>
                <div className="mt-4 editorial-kicker text-muted-foreground">
                  {s.audience}
                </div>
              </div>
              <div className="md:col-span-9">
                <h2 className="text-display text-balance text-[clamp(2rem,4.5vw,4rem)] leading-[1.04]">
                  {s.title}
                </h2>
                <p className="mt-6 max-w-[60ch] text-pretty text-[1.05rem] leading-[1.8] text-foreground/85 sm:text-lg">
                  {s.text}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-12 grid gap-8 md:grid-cols-12">
              <div className="md:col-span-3 md:col-start-4">
                <div className="editorial-kicker text-muted-foreground">
                  {t("idealKicker")}
                </div>
              </div>
              <ul className="md:col-span-9">
                {s.ideal.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-6 border-b border-border/60 py-4"
                  >
                    <span className="num-lockup nums-tabular w-8 text-base leading-none text-primary/55">
                      0{i + 1}
                    </span>
                    <span className="text-pretty text-base leading-[1.7] text-foreground/85">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-12 rounded-sm border-l-2 border-primary bg-muted/20 p-8 md:ml-[25%]">
              <h3 className="text-display text-2xl leading-tight sm:text-3xl">
                {s.ctaTitle}
              </h3>
              <p className="mt-3 max-w-prose text-base leading-[1.7] text-foreground/80">
                <span className="text-serif-italic">{s.ctaText}</span>
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-5">
                <a
                  href={`mailto:${contacts.email}?subject=${encodeURIComponent(
                    s.contactSubject,
                  )}`}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-primary"
                >
                  {t("writeUs")}
                </a>
                {s.linkTo ? (
                  <Link
                    href={s.linkTo}
                    className="text-serif-italic text-lg text-foreground ink-underline"
                  >
                    {s.linkLabel ?? t("seeMore")}
                  </Link>
                ) : null}
              </div>
            </div>
          </Reveal>
        </section>
      ))}

      <div className="h-24 sm:h-32" />
    </>
  );
}
