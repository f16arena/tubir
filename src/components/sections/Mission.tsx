import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { RootDraw } from "@/components/motion/RootDraw";

export function Mission() {
  const t = useTranslations("mission");
  const items = t.raw("items") as Array<{ title: string; text: string }>;

  return (
    <section className="relative border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Section header */}
        <div className="grid gap-8 pt-24 pb-10 sm:pt-32 sm:pb-14 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <div className="editorial-kicker text-muted-foreground">
              I · Зачем
            </div>
          </Reveal>
          <Reveal className="md:col-span-9" delay={120}>
            <h2 className="text-display text-balance text-[clamp(2.2rem,5vw,4.5rem)]">
              {t("title")}
            </h2>
          </Reveal>
        </div>

        <div className="h-px w-full editorial-rule bg-foreground" />

        {/* Three editorial blocks */}
        <div className="divide-y divide-border/60">
          {items.map((item, i) => (
            <article
              key={item.title}
              className="grid gap-8 py-16 sm:py-24 md:grid-cols-12 md:gap-10"
            >
              <Reveal className="md:col-span-3" delay={i * 60}>
                <div className="flex items-baseline gap-4 md:flex-col md:items-start">
                  <span className="num-lockup nums-tabular text-[5rem] leading-none text-primary sm:text-[6rem]">
                    0{i + 1}
                  </span>
                  <div className="text-serif-italic text-xl text-foreground/85 sm:text-2xl">
                    {item.title}
                  </div>
                </div>
              </Reveal>
              <Reveal className="md:col-span-9" delay={i * 60 + 120}>
                <p className="drop-cap text-pretty text-[1.05rem] leading-[1.75] text-foreground/85 sm:text-lg md:max-w-[58ch]">
                  {item.text}
                </p>
              </Reveal>
            </article>
          ))}
        </div>
      </div>

      <RootDraw
        className="-mt-2 mb-2 text-primary/40"
        height={140}
        width={80}
      />
    </section>
  );
}
