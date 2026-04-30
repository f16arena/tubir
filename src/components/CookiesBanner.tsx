"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "tubir_cookies_accepted_v1";

export function CookiesBanner() {
  const t = useTranslations("cookies");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEY)) {
      const id = setTimeout(() => setShow(true), 700);
      return () => clearTimeout(id);
    }
  }, []);

  if (!show) return null;

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // localStorage may be blocked — silently ignore.
    }
    setShow(false);
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 sm:inset-x-auto sm:right-5 sm:max-w-md">
      <div className="rounded-2xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur-md">
        <p className="text-sm text-foreground/90">{t("text")}</p>
        <div className="mt-3 flex items-center justify-end gap-3">
          <Link
            href="/legal/privacy"
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {t("more")}
          </Link>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
