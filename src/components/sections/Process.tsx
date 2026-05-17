import Image from "next/image";
import { useTranslations } from "next-intl";
import { photos } from "@/lib/data/gallery";
import { Reveal } from "@/components/motion/Reveal";

export function Process() {
  const t = useTranslations("process");
  const items = t.raw("items") as Array<{ title: string; text: string }>;

  return (
    <section className="relative border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-8 pt-24 pb-12 sm:pt-32 sm:pb-16 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <div className="editorial-kicker text-muted-foreground">
              IV · Процесс
            </div>
          </Reveal>
          <Reveal className="md:col-span-9" delay={120}>
            <h2 className="text-display text-balance text-[clamp(2.2rem,5vw,4.5rem)]">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
              <span className="text-serif-italic">{t("subtitle")}</span>
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const photo = photos.process[i];
            return (
              <Reveal key={item.title} delay={i * 90}>
                <figure className="group relative">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted">
                    <Image
                      src={photo.src}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/35" />
                    <span className="absolute left-4 top-4 num-lockup nums-tabular text-white/90 text-xl drop-shadow-sm">
                      0{i + 1}
                    </span>
                  </div>
                  <figcaption className="mt-4 flex items-baseline gap-3">
                    <span className="text-serif-italic text-xl text-foreground sm:text-2xl">
                      {item.title}
                    </span>
                    <span aria-hidden className="h-px flex-1 bg-border" />
                  </figcaption>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </figure>
              </Reveal>
            );
          })}
        </div>

        <p className="mx-auto mt-14 max-w-xl pb-24 text-center text-xs text-muted-foreground sm:pb-32">
          <span className="text-serif-italic">{t("placeholderNote")}</span>
        </p>
      </div>
    </section>
  );
}
