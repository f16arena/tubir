import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";

export function TazaQazaqstan() {
  const t = useTranslations("tazaQazaqstan");

  return (
    <section className="relative border-t border-border/60 paper">
      <div className="mx-auto max-w-4xl px-4 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <span
            aria-hidden
            className="block text-serif-italic text-[5rem] leading-none text-primary/25 sm:text-[7rem]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            &ldquo;
          </span>
          <h2 className="text-display -mt-4 text-balance text-[clamp(1.7rem,3.5vw,3rem)] leading-[1.1]">
            {t("title")}
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-8 max-w-[60ch] text-pretty leading-[1.8] text-foreground/75 sm:text-lg">
            <span className="text-serif-italic">{t("text")}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
