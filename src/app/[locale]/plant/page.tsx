import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PlantForm } from "./PlantForm";
import { PageIntro } from "@/components/editorial/PageIntro";

export default async function PlantPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("plant");
  const tHow = await getTranslations("howItWorks");
  const steps = tHow.raw("steps") as Array<{
    n: string;
    title: string;
    text: string;
  }>;

  return (
    <>
      <PageIntro kicker="·" title={t("title")} subtitle={t("subtitle")} />

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="grid gap-12 border-t border-border/70 pt-12 md:grid-cols-12 md:gap-16">
          <aside className="md:col-span-4">
            <div className="sticky top-24 space-y-8">
              <ol className="space-y-5">
                {steps.map((step, i) => (
                  <li
                    key={step.n}
                    className="grid grid-cols-[auto_1fr] items-baseline gap-4"
                  >
                    <span
                      className={
                        "num-lockup nums-tabular text-3xl " +
                        (i === 0 ? "text-primary" : "text-primary/30")
                      }
                    >
                      {step.n}
                    </span>
                    <div>
                      <div className="text-serif-italic text-base text-foreground sm:text-lg">
                        {step.title}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="rounded-sm border border-border/60 bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
                <span className="text-serif-italic">{t("noOnlinePay")}</span>
              </p>
            </div>
          </aside>

          <div className="md:col-span-8">
            <Suspense fallback={null}>
              <PlantForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
