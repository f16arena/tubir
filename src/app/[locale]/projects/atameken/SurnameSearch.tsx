"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Search, ArrowRight } from "lucide-react";

// Suggestions surfaced as quick chips below the input.
const SUGGESTED_SURNAMES = [
  "Абеуов",
  "Жумабаев",
  "Сейфуллин",
  "Кунанбаев",
  "Алтынсарин",
  "Калиев",
  "Нурпеисов",
  "Айтматов",
];

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("ru-RU");
}

export function SurnameSearch() {
  const t = useTranslations("atameken.search");
  const [query, setQuery] = useState("");
  const submitted = query.trim().length > 0;

  const displayed = useMemo(() => {
    const n = normalize(query);
    if (!n) return "";
    // Title-case first letter for display
    return query.trim().charAt(0).toLocaleUpperCase("ru-RU") + query.trim().slice(1);
  }, [query]);

  return (
    <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
      <label className="block">
        <span className="editorial-kicker text-muted-foreground">
          {t("label")}
        </span>
        <div className="mt-3 flex items-center gap-3 border-b border-border focus-within:border-primary">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            className="h-12 flex-1 bg-transparent text-xl text-foreground outline-none placeholder:text-muted-foreground sm:text-2xl"
            autoComplete="off"
          />
        </div>
      </label>

      {!submitted ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {SUGGESTED_SURNAMES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQuery(s)}
              className="rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground/80 transition-colors hover:border-primary hover:text-primary"
            >
              <span className="text-serif-italic">{s}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-6 border-l-2 border-primary pl-5">
          <div className="editorial-kicker text-primary">
            {t("resultLabel")}
          </div>
          <p className="mt-2 max-w-prose text-pretty text-base leading-[1.7] text-foreground/85 sm:text-lg">
            {t("noTreesYet", { name: displayed })}
          </p>
          <p className="mt-3 max-w-prose text-sm text-muted-foreground">
            <span className="text-serif-italic">{t("beFirst")}</span>
          </p>
          <Link
            href={{ pathname: "/pledge", query: { name: displayed } }}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-primary"
          >
            {t("ctaButton", { name: displayed })}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
