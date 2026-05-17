"use client";

import { cn } from "@/lib/utils";
import { useInView } from "./useInView";

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span";
};

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <Tag
      // @ts-expect-error — polymorphic ref
      ref={ref}
      style={inView ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal-fade", inView && "is-in", className)}
    >
      {children}
    </Tag>
  );
}
