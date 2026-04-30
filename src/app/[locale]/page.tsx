import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { Mission } from "@/components/sections/Mission";
import { Honest } from "@/components/sections/Honest";
import { Future } from "@/components/sections/Future";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Process } from "@/components/sections/Process";
import { Flagship } from "@/components/sections/Flagship";
import { TazaQazaqstan } from "@/components/sections/TazaQazaqstan";
import { CtaBottom } from "@/components/sections/CtaBottom";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Mission />
      <Honest />
      <Future />
      <HowItWorks />
      <Process />
      <Flagship />
      <TazaQazaqstan />
      <CtaBottom />
    </>
  );
}
