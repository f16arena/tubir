import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getLocalizedUrl, publicRoutes } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routing.locales.flatMap((locale) =>
    publicRoutes.map((pathname) => ({
      url: getLocalizedUrl(locale, pathname),
      lastModified,
      changeFrequency: pathname === "/" ? "weekly" : "monthly",
      priority: pathname === "/" ? 1 : pathname === "/plant" ? 0.9 : 0.7,
    })),
  );
}
