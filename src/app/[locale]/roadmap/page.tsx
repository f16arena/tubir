import { setRequestLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { PageIntro } from "@/components/editorial/PageIntro";
import { cn } from "@/lib/utils";

type DevlogEntry = {
  date: string;
  title: string;
  body: string;
  location?: string;
};

const STATUS_DOT: Record<string, string> = {
  current: "bg-primary shadow-[0_0_0_4px_oklch(0.42_0.13_148_/_0.18)]",
  next: "bg-primary/70",
  planned: "bg-foreground/30",
  vision: "bg-foreground/15 border border-dashed border-foreground/40",
};

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("roadmap");
  const stages = t.raw("stages") as Array<{
    label: string;
    title: string;
    text: string;
    status: keyof typeof STATUS_DOT;
  }>;
  const devlog = (t.raw("devlog") as DevlogEntry[] | undefined) ?? [];

  return (
    <>
      <PageIntro
        kicker="Дорожная карта"
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {devlog.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-8 sm:pb-16">
          <div className="grid gap-8 border-t border-border/70 pt-12 md:grid-cols-12">
            <Reveal className="md:col-span-3">
              <div className="editorial-kicker text-muted-foreground">
                {t("devlogKicker")}
              </div>
              <p className="mt-3 max-w-prose text-sm text-muted-foreground">
                <span className="text-serif-italic">{t("devlogNote")}</span>
              </p>
            </Reveal>
            <ol className="md:col-span-9">
              {devlog.map((entry, i) => (
                <Reveal key={entry.date + i} delay={i * 60}>
                  <li className="grid items-start gap-6 border-b border-border/60 py-8 md:grid-cols-[8rem_1fr] md:gap-10">
                    <div>
                      <div className="num-lockup nums-tabular text-2xl text-foreground sm:text-3xl">
                        {entry.date}
                      </div>
                      {entry.location ? (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {entry.location}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <h3 className="text-display text-xl leading-tight sm:text-2xl">
                        {entry.title}
                      </h3>
                      <p className="mt-3 max-w-prose text-pretty text-base leading-[1.7] text-foreground/80">
                        {entry.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="mb-12 grid gap-8 border-t border-border/70 pt-12 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <div className="editorial-kicker text-muted-foreground">
              {t("stagesKicker")}
            </div>
          </Reveal>
        </div>
        <ol className="border-t border-border/70">
          {stages.map((s, i) => (
            <Reveal key={s.label} delay={i * 60}>
              <li className="group grid items-start gap-6 border-b border-border/60 py-10 md:grid-cols-12 md:gap-10 md:py-14">
                <div className="md:col-span-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-block h-3 w-3 rounded-full",
                        STATUS_DOT[s.status],
                      )}
                    />
                    <span className="editorial-kicker text-muted-foreground">
                      {s.label}
                    </span>
                  </div>
                </div>
                <div className="md:col-span-5">
                  <h2 className="text-display text-balance text-2xl leading-tight sm:text-3xl">
                    {s.title}
                  </h2>
                </div>
                <div className="md:col-span-4">
                  <p className="max-w-prose text-pretty text-base leading-[1.75] text-foreground/75">
                    {s.text}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

        <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-muted-foreground">
          <span className="text-serif-italic">{t("honestNote")}</span>
        </p>
      </section>
    </>
  );
}
