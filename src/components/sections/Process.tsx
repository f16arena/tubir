import Image from "next/image";
import { useTranslations } from "next-intl";
import { photos } from "@/lib/data/gallery";
import { Reveal } from "@/components/Reveal";

export function Process() {
  const t = useTranslations("process");
  const items = t.raw("items") as Array<{ title: string; text: string }>;

  return (
    <section className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const photo = photos.process[i];
            return (
              <Reveal key={item.title} delay={i * 80}>
                <article className="group h-full overflow-hidden rounded-2xl border border-border/60 bg-card transition-shadow hover:shadow-lg hover:shadow-primary/5">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <Image
                    src={photo.src}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="font-mono text-xs font-semibold text-white/80">
                      0{i + 1}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-white drop-shadow-sm">
                      {item.title}
                    </h3>
                  </div>
                </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-xs italic text-muted-foreground">
          {t("placeholderNote")}
        </p>
      </div>
    </section>
  );
}
