import { getTranslations, setRequestLocale } from "next-intl/server";
import { AdminLoginForm } from "./AdminLoginForm";
import { type Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin.login" });

  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <div>
        <p className="text-sm font-medium text-primary">{t("eyebrow")}</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-normal">
          {t("title")}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{t("subtitle")}</p>
      </div>
      <AdminLoginForm />
    </section>
  );
}
