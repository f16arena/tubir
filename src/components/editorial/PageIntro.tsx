import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

type Props = {
  /** Roman or short label shown left of the title. */
  kicker: string;
  /** Big serif title. */
  title: string;
  /** Optional italic-serif subtitle / lede. */
  subtitle?: string;
  className?: string;
};

export function PageIntro({ kicker, title, subtitle, className }: Props) {
  return (
    <header
      className={cn(
        "mx-auto grid max-w-7xl gap-8 px-4 pt-24 pb-12 sm:px-8 sm:pt-32 sm:pb-16 md:grid-cols-12",
        className,
      )}
    >
      <Reveal className="md:col-span-3">
        <div className="editorial-kicker text-muted-foreground">{kicker}</div>
      </Reveal>
      <Reveal className="md:col-span-9" delay={120}>
        <h1 className="text-display text-balance text-[clamp(2.4rem,5.5vw,5rem)]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            <span className="text-serif-italic">{subtitle}</span>
          </p>
        ) : null}
      </Reveal>
    </header>
  );
}
