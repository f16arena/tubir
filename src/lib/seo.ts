import { routing, type Locale } from "@/i18n/routing";

export const siteName = "Túbir";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tubir.kz").replace(/\/$/, "");
}

export function getLocalizedUrl(locale: Locale, pathname = "/") {
  const cleanPath = pathname === "/" ? "" : pathname;
  return `${getSiteUrl()}/${locale}${cleanPath}`;
}

export function getLanguageAlternates(pathname = "/") {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, getLocalizedUrl(locale, pathname)]),
  ) as Record<Locale, string>;
}

export function getOgLocale(locale: Locale) {
  const map: Record<Locale, string> = {
    ru: "ru_KZ",
    kz: "kk_KZ",
    en: "en_US",
  };
  return map[locale];
}

export const publicRoutes = [
  "/",
  "/trees",
  "/how",
  "/about",
  "/plant",
  "/pledge",
  "/letter",
  "/team",
  "/press",
  "/press/one-pager",
  "/numbers",
  "/map",
  "/partners",
  "/roadmap",
  "/business",
  "/diaspora",
  "/projects/polygon",
  "/projects/atameken",
  "/products",
  "/gift",
  "/certificate",
  "/legal/offer",
  "/legal/privacy",
  "/legal/refund",
] as const;
