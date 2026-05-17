import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { PageIntro } from "@/components/editorial/PageIntro";
import { contacts } from "@/lib/data/contacts";

export default async function PressPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("press");
  const facts = t.raw("facts") as Array<{ k: string; v: string }>;
  const quotes = t.raw("quotes") as string[];

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

      {/* Key facts */}
      <section className="mx-auto mt-20 grid max-w-7xl gap-8 px-4 sm:mt-28 sm:px-8 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <div className="editorial-kicker text-muted-foreground">
            {t("factsKicker")}
          </div>
        </Reveal>
        <Reveal className="md:col-span-9" delay={120}>
          <dl className="border-t border-border/70">
            {facts.map((f) => (
              <div
                key={f.k}
                className="grid items-baseline gap-4 border-b border-border/60 py-4 md:grid-cols-[12rem_1fr]"
              >
                <dt className="editorial-kicker text-muted-foreground">
                  {f.k}
                </dt>
                <dd className="text-pretty text-base text-foreground/85 sm:text-lg">
                  {f.v}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* Pull-quotes for citation */}
      <section className="mx-auto mt-20 grid max-w-7xl gap-8 px-4 sm:mt-28 sm:px-8 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <div className="editorial-kicker text-muted-foreground">
            {t("quotesKicker")}
          </div>
          <p className="mt-3 max-w-prose text-sm text-muted-foreground">
            <span className="text-serif-italic">{t("quotesNote")}</span>
          </p>
        </Reveal>
        <div className="md:col-span-9">
          <div className="grid gap-6">
            {quotes.map((q, i) => (
              <Reveal key={i} delay={i * 80}>
                <blockquote className="relative border-l-2 border-primary pl-6">
                  <span
                    aria-hidden
                    className="absolute -left-2 -top-6 select-none text-serif-italic text-6xl text-primary/30"
                  >
                    &ldquo;
                  </span>
                  <p className="text-pretty text-serif-italic text-xl leading-[1.5] text-foreground/90 sm:text-2xl">
                    {q}
                  </p>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Brand assets */}
      <section className="mx-auto mt-20 grid max-w-7xl gap-8 px-4 sm:mt-28 sm:px-8 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <div className="editorial-kicker text-muted-foreground">
            {t("assetsKicker")}
          </div>
        </Reveal>
        <Reveal className="md:col-span-9" delay={120}>
          <h2 className="text-display text-balance text-[clamp(2rem,4vw,3.2rem)] leading-[1.05]">
            {t("assetsTitle")}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <BrandTile
              label={t("logoWord")}
              variant="light"
              value="Túbir"
            />
            <BrandTile
              label={t("logoWord")}
              variant="dark"
              value="Túbir"
            />
            <BrandTile label="OG · 1200×630" variant="og" value="/ru/opengraph-image" />
          </div>
          <div className="mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <div>
              <span className="editorial-kicker">Primary</span>{" "}
              <span className="font-mono">oklch(0.42 0.13 148)</span>
            </div>
            <div>
              <span className="editorial-kicker">Paper</span>{" "}
              <span className="font-mono">oklch(0.985 0.012 95)</span>
            </div>
            <div>
              <span className="editorial-kicker">Heading</span>{" "}
              <span className="text-serif-italic">Spectral</span>
            </div>
            <div>
              <span className="editorial-kicker">Body</span>{" "}
              <span className="font-mono text-xs">Inter</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* One-pager */}
      <section className="mx-auto mt-20 grid max-w-7xl gap-8 px-4 sm:mt-28 sm:px-8 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <div className="editorial-kicker text-muted-foreground">
            {t("onePagerKicker")}
          </div>
        </Reveal>
        <Reveal className="md:col-span-9" delay={120}>
          <h2 className="text-display text-balance text-[clamp(2rem,4vw,3.2rem)] leading-[1.05]">
            {t("onePagerTitle")}
          </h2>
          <p className="mt-5 max-w-[58ch] text-pretty leading-[1.75] text-foreground/80 sm:text-lg">
            {t("onePagerText")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/press/one-pager"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-foreground/20 px-5 text-sm font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
            >
              {t("onePagerOpen")}
            </Link>
            <a
              href="/press/one-pager"
              target="_blank"
              rel="noopener"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-foreground/20 px-5 text-sm font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
            >
              {t("onePagerPrint")}
            </a>
          </div>
        </Reveal>
      </section>

      {/* Press contact */}
      <section className="relative isolate mt-24 overflow-hidden border-t border-border/60 paper sm:mt-32">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-24 sm:px-8 sm:py-32 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <div className="editorial-kicker text-muted-foreground">
              {t("contactKicker")}
            </div>
          </Reveal>
          <Reveal className="md:col-span-9" delay={120}>
            <h2 className="text-display text-balance text-[clamp(2rem,4vw,3.6rem)] leading-[1.05]">
              {t("contactTitle")}
            </h2>
            <p className="mt-6 max-w-[58ch] text-pretty leading-[1.75] text-foreground/80">
              <span className="text-serif-italic">{t("contactText")}</span>
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div>
                <div className="editorial-kicker text-muted-foreground">
                  Email
                </div>
                <a
                  href={`mailto:${contacts.email}?subject=Press`}
                  className="text-serif-italic mt-1 block text-2xl text-foreground ink-underline sm:text-3xl"
                >
                  {contacts.email}
                </a>
              </div>
              <div>
                <div className="editorial-kicker text-muted-foreground">
                  WhatsApp
                </div>
                <a
                  href={contacts.whatsapp}
                  className="text-serif-italic mt-1 block text-2xl text-foreground ink-underline sm:text-3xl"
                >
                  {contacts.phone}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function BrandTile({
  label,
  variant,
  value,
}: {
  label: string;
  variant: "light" | "dark" | "og";
  value: string;
}) {
  if (variant === "og") {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener"
        className="group relative flex aspect-[1200/630] flex-col justify-end overflow-hidden rounded-sm border border-border bg-muted/30 p-4 transition-colors hover:border-primary"
      >
        <div className="absolute inset-3 grid place-items-center rounded-sm bg-gradient-to-br from-[oklch(0.985_0.012_95)] to-[oklch(0.96_0.04_95)] text-2xl text-foreground/40">
          <span className="text-serif-italic">Túbir</span>
        </div>
        <span className="relative editorial-kicker text-muted-foreground">
          {label}
        </span>
      </a>
    );
  }
  return (
    <div
      className={
        "flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-sm border p-5 " +
        (variant === "light"
          ? "border-border bg-background"
          : "border-foreground bg-foreground text-background")
      }
    >
      <span
        className={
          "text-display text-5xl " +
          (variant === "light" ? "text-foreground" : "text-background")
        }
      >
        {value}
      </span>
      <span
        className={
          "editorial-kicker " +
          (variant === "light"
            ? "text-muted-foreground"
            : "text-background/60")
        }
      >
        {label}
      </span>
    </div>
  );
}
