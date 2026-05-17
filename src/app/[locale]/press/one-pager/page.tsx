import { setRequestLocale, getTranslations } from "next-intl/server";
import { contacts } from "@/lib/data/contacts";
import { PrintButton } from "./PrintButton";

export default async function OnePagerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("onePager");
  const stats = t.raw("stats") as Array<{ value: string; label: string }>;
  const pillars = t.raw("pillars") as Array<{ title: string; text: string }>;

  return (
    <div className="bg-background py-12 print:py-0">
      {/* On-screen toolbar */}
      <div className="mx-auto mb-8 max-w-[210mm] px-4 print-hide">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-border bg-muted/30 px-5 py-3 text-sm">
          <div className="text-muted-foreground">
            <span className="editorial-kicker">
              A4 · one-pager · {t("date")}
            </span>
          </div>
          <PrintButton label={t("printButton")} />
        </div>
      </div>

      <article
        className="print-page mx-auto bg-white text-neutral-900 shadow-2xl print:shadow-none"
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "16mm 16mm 14mm 16mm",
          boxSizing: "border-box",
          fontFamily: "var(--font-sans)",
        }}
      >
        <header className="flex items-start justify-between border-b border-neutral-300 pb-5">
          <div>
            <div
              style={{ fontFamily: "var(--font-heading)" }}
              className="text-3xl font-medium tracking-tight text-neutral-900"
            >
              Túbir
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.28em] text-neutral-500">
              {t("tagline")}
            </div>
          </div>
          <div className="text-right text-[10px] uppercase tracking-[0.28em] text-neutral-500">
            <div>{t("doc")}</div>
            <div className="mt-1">{t("date")}</div>
          </div>
        </header>

        <div className="mt-8">
          <div className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
            {t("kicker")}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              letterSpacing: "-0.025em",
            }}
            className="mt-3 text-[2.4rem] font-medium leading-[1.02] text-neutral-900"
          >
            {t("title")}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
            }}
            className="mt-4 max-w-[15cm] text-[1.05rem] leading-[1.5] text-neutral-700"
          >
            {t("lead")}
          </p>
        </div>

        <dl className="mt-8 grid grid-cols-4 gap-4 border-y border-neutral-300 py-5">
          {stats.map((s) => (
            <div key={s.label}>
              <dt
                style={{
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "-0.03em",
                }}
                className="text-[2rem] font-medium leading-none text-neutral-900"
              >
                {s.value}
              </dt>
              <dd className="mt-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>

        <section className="mt-8 grid grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <div key={p.title}>
              <div className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                0{i + 1}
              </div>
              <h3
                style={{ fontFamily: "var(--font-heading)" }}
                className="mt-2 text-base font-medium text-neutral-900"
              >
                {p.title}
              </h3>
              <p className="mt-2 text-[11px] leading-[1.55] text-neutral-700">
                {p.text}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid grid-cols-[1fr_2fr] gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
              {t("conceptKicker")}
            </div>
            <h2
              style={{ fontFamily: "var(--font-heading)" }}
              className="mt-2 text-xl font-medium leading-tight text-neutral-900"
            >
              {t("conceptTitle")}
            </h2>
          </div>
          <p className="text-[12px] leading-[1.7] text-neutral-800">
            {t("conceptText")}
          </p>
        </section>

        <section className="mt-6 grid grid-cols-[1fr_2fr] gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
              {t("askKicker")}
            </div>
            <h2
              style={{ fontFamily: "var(--font-heading)" }}
              className="mt-2 text-xl font-medium leading-tight text-neutral-900"
            >
              {t("askTitle")}
            </h2>
          </div>
          <p className="text-[12px] leading-[1.7] text-neutral-800">
            {t("askText")}
          </p>
        </section>

        <footer className="mt-10 grid grid-cols-3 gap-6 border-t border-neutral-300 pt-5 text-[11px] text-neutral-700">
          <div>
            <div className="text-[9px] uppercase tracking-[0.28em] text-neutral-500">
              Контакт
            </div>
            <div className="mt-1.5 font-medium">{contacts.email}</div>
            <div>{contacts.phone}</div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.28em] text-neutral-500">
              Локация
            </div>
            <div className="mt-1.5 font-medium">Усть-Каменогорск, ВКО</div>
            <div>Республика Казахстан</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] uppercase tracking-[0.28em] text-neutral-500">
              Подробнее
            </div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontStyle: "italic",
              }}
              className="mt-1.5 text-base text-neutral-900"
            >
              tubir.kz
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
