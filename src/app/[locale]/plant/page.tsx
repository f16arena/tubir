import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PlantForm } from "./PlantForm";

export default async function PlantPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("plant");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-12 rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
        <Suspense fallback={null}>
          <PlantForm />
        </Suspense>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        {t("noOnlinePay")}
      </p>
    </div>
  );
}
