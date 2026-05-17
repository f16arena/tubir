"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { photos } from "@/lib/data/gallery";
import { Parallax } from "@/components/motion/Parallax";
import { useInView } from "@/components/motion/useInView";
import { cn } from "@/lib/utils";

function HeadingSplit({ text }: { text: string }) {
  const { ref, inView } = useInView<HTMLHeadingElement>({ threshold: 0.2 });
  const words = text.split(/\s+/);
  return (
    <h2
      ref={ref}
      className="text-display text-balance text-[clamp(2.2rem,6vw,5.2rem)] leading-[1.02]"
    >
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className={cn("split-word mr-[0.16em]", inView && "is-in")}
        >
          <span style={{ transitionDelay: `${80 + i * 65}ms` }}>{w}</span>
        </span>
      ))}
    </h2>
  );
}

export function Future() {
  const t = useTranslations("future");

  return (
    <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Parallax speed={120} className="absolute inset-0">
          <div className="absolute inset-0 scale-110">
            <Image
              src={photos.future}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/60 to-black/85" />
        <div className="grain absolute inset-0" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-32 sm:px-8 sm:py-44">
        <div className="editorial-kicker text-white/60">II · Время</div>
        <div className="mt-8">
          <HeadingSplit text={t("title")} />
        </div>
        <p className="mt-10 max-w-2xl text-pretty text-[1.05rem] leading-[1.7] text-white/75 sm:text-lg">
          <span className="text-serif-italic">{t("text")}</span>
        </p>
      </div>
    </section>
  );
}
