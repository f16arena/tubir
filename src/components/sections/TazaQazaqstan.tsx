import { useTranslations } from "next-intl";

export function TazaQazaqstan() {
  const t = useTranslations("tazaQazaqstan");

  return (
    <section className="border-t border-border/60">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
          {t("text")}
        </p>
      </div>
    </section>
  );
}
