import Image from "next/image";
import { useTranslations } from "next-intl";
import { photos } from "@/lib/data/gallery";
import { Reveal } from "@/components/Reveal";

export function Future() {
  const t = useTranslations("future");

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={photos.future}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/85" />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-28 text-center text-white sm:px-6 sm:py-36">
        <Reveal>
          <h2 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
            {t("title")}
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-8 max-w-xl text-pretty text-base text-white/75 sm:text-lg">
            {t("text")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
