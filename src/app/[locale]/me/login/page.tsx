import { getTranslations, setRequestLocale } from "next-intl/server";
import { MeLoginForm } from "./MeLoginForm";
import { PageIntro } from "@/components/editorial/PageIntro";
import { type Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function MeLoginPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "me.login" });

  return (
    <>
      <PageIntro
        kicker={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <section className="mx-auto max-w-lg px-4 pb-24 sm:px-8 sm:pb-32">
        <MeLoginForm />
      </section>
    </>
  );
}
