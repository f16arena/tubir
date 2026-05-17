"use client";

import { cn } from "@/lib/utils";
import { useInView } from "./useInView";

type Props = {
  text: string;
  className?: string;
  /** Delay between word reveals in ms. */
  stagger?: number;
  /** Delay before first word reveals. */
  initialDelay?: number;
  /** Replace whole-words wrapped in *asterisks* with italic serif. */
  emphasis?: boolean;
};

export function SplitText({
  text,
  className,
  stagger = 70,
  initialDelay = 80,
  emphasis = true,
}: Props) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.25 });
  const words = text.split(/(\s+)/);

  return (
    <span ref={ref} className={cn("inline", className)}>
      {words.map((w, i) => {
        if (/^\s+$/.test(w)) return <span key={i}>{w}</span>;
        const isEm = emphasis && /^\*.+\*$/.test(w);
        const clean = isEm ? w.slice(1, -1) : w;
        return (
          <span key={i} className={cn("split-word", inView && "is-in")}>
            <span
              style={{
                transitionDelay: `${initialDelay + i * stagger}ms`,
              }}
              className={isEm ? "text-serif-italic text-primary" : undefined}
            >
              {clean}
            </span>
          </span>
        );
      })}
    </span>
  );
}
