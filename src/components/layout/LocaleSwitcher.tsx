"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { useTransition } from "react";

const labels: Record<Locale, string> = {
  ru: "RU",
  kz: "KZ",
  en: "EN",
};

export function LocaleSwitcher() {
  const current = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(locale: Locale) {
    if (locale === current) return;
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 p-1 text-xs font-medium">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          disabled={isPending}
          aria-pressed={loc === current}
          className={
            "rounded-full px-2.5 py-1 transition-colors " +
            (loc === current
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground")
          }
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
