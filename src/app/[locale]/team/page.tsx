import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { PageIntro } from "@/components/editorial/PageIntro";
import { contacts } from "@/lib/data/contacts";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("team");
  const founders = t.raw("founders") as Array<{
    name: string;
    role: string;
    bio: string;
  }>;
  const advisorSlots = t.raw("advisorSlots") as Array<{
    discipline: string;
    note: string;
  }>;

  return (
    <>
      <PageIntro
        kicker={t("kicker")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {/* Founders */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="border-t border-border/70">
          {founders.map((f, i) => (
            <Reveal key={f.name + i} delay={i * 80}>
              <article className="grid items-start gap-8 border-b border-border/60 py-14 md:grid-cols-12 md:gap-12 md:py-20">
                <div className="md:col-span-4">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-muted">
                    {/* Photo placeholder — replace by real photo in /public/team/founder.jpg */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-muted">
                      <span
                        className="text-display text-[8rem] text-primary/30"
                        aria-hidden
                      >
                        {f.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 editorial-kicker text-muted-foreground">
                    {t("photoNote")}
                  </div>
                </div>
                <div className="md:col-span-8">
                  <div className="editorial-kicker text-muted-foreground">
                    0{i + 1} · {f.role}
                  </div>
                  <h2 className="text-display mt-3 text-balance text-3xl leading-tight sm:text-4xl">
                    {f.name}
                  </h2>
                  <p className="mt-6 max-w-[60ch] text-pretty text-[1.05rem] leading-[1.8] text-foreground/80 sm:text-lg">
                    {f.bio}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Advisory board — placeholders */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-8">
        <div className="grid gap-8 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <div className="editorial-kicker text-muted-foreground">
              {t("advisorsKicker")}
            </div>
          </Reveal>
          <Reveal className="md:col-span-9" delay={120}>
            <h2 className="text-display text-balance text-[clamp(2rem,4vw,3.4rem)] leading-[1.05]">
              {t("advisorsTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-pretty text-muted-foreground sm:text-lg">
              <span className="text-serif-italic">{t("advisorsLead")}</span>
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {advisorSlots.map((slot, i) => (
            <Reveal key={i} delay={i * 80}>
              <article className="flex h-full flex-col border-l-2 border-dashed border-border bg-muted/20 p-6">
                <div className="num-lockup nums-tabular text-3xl text-primary/40">
                  0{i + 1}
                </div>
                <h3 className="text-display mt-3 text-xl leading-tight sm:text-2xl">
                  {slot.discipline}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="text-serif-italic">{slot.note}</span>
                </p>
                <div className="mt-auto pt-6 editorial-kicker text-muted-foreground">
                  {t("openSlot")}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Join CTA */}
      <section className="relative isolate mt-24 overflow-hidden bg-primary text-primary-foreground sm:mt-32">
        <div
          aria-hidden
          className="halftone absolute inset-0 text-primary-foreground"
        />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-24 sm:px-8 sm:py-32 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <div className="editorial-kicker text-primary-foreground/70">
              {t("joinKicker")}
            </div>
          </Reveal>
          <Reveal className="md:col-span-9" delay={120}>
            <h2 className="text-display text-balance text-[clamp(2rem,4vw,3.6rem)] leading-[1.05]">
              {t("joinTitle")}
            </h2>
            <p className="mt-6 max-w-[58ch] text-pretty leading-[1.75] text-primary-foreground/85">
              {t("joinText")}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <MagneticButton>
                <a
                  href={`mailto:${contacts.email}?subject=Túbir%20%C2%B7%20Advisory`}
                  className={cn(
                    buttonVariants({ size: "lg", variant: "secondary" }),
                    "group h-12 rounded-full px-7 text-base",
                  )}
                >
                  {t("joinButton")}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </MagneticButton>
              <Link
                href="/letter"
                className="text-serif-italic text-primary-foreground/80 ink-underline hover:text-primary-foreground"
              >
                {t("readLetter")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
