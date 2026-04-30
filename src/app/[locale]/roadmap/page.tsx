import { setRequestLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/Reveal";

const STATUS_STYLES: Record<string, string> = {
  current: "border-primary bg-primary text-primary-foreground",
  next: "border-primary/50 bg-primary/10 text-primary",
  planned: "border-border bg-muted/40 text-muted-foreground",
  vision: "border-dashed border-border bg-transparent text-muted-foreground",
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
    status: keyof typeof STATUS_STYLES;
  }>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
        </div>
      </Reveal>

      <ol className="mt-16 relative">
        <div
          aria-hidden
          className="absolute left-4 top-2 bottom-2 w-px bg-border sm:left-1/2"
        />
        {stages.map((s, i) => (
          <Reveal key={s.label} delay={i * 60}>
            <li
              className={
                "relative pl-12 pb-10 sm:pl-0 sm:pb-14 " +
                (i % 2 === 0 ? "sm:pr-[55%]" : "sm:pl-[55%]")
              }
            >
              <span
                className={
                  "absolute left-2 top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 sm:left-1/2 sm:-translate-x-1/2 " +
                  STATUS_STYLES[s.status]
                }
              >
                {s.status === "current" ? (
                  <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                ) : null}
              </span>

              <div className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                {s.label}
              </div>
              <h2 className="mt-2 text-xl font-semibold leading-tight sm:text-2xl">
                {s.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed sm:text-base">
                {s.text}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>

      <p className="mx-auto mt-8 max-w-xl text-center text-xs italic text-muted-foreground">
        {t("honestNote")}
      </p>
    </div>
  );
}
