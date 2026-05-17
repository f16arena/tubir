import { renderOg, ogSize, ogContentType } from "@/lib/og/render";
import { routing, type Locale } from "@/i18n/routing";

export const alt = "Túbir — посади дерево в Восточном Казахстане";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return renderOg(locale);
}
