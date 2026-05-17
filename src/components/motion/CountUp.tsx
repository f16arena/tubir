"use client";

import { useEffect, useState } from "react";
import { useInView } from "./useInView";

type Props = {
  /** Final numeric value. If string with non-numeric chars is passed, will render as-is. */
  value: string | number;
  /** Animation duration in ms. */
  duration?: number;
  /** Prefix/suffix kept around the animated number. */
  prefix?: string;
  suffix?: string;
  /** Force tabular numerals. */
  className?: string;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function parseNumeric(input: string | number): {
  num: number | null;
  pre: string;
  post: string;
  hasGroup: boolean;
} {
  if (typeof input === "number") {
    return { num: input, pre: "", post: "", hasGroup: false };
  }
  // strip non-breaking and regular spaces inside the number group
  const cleaned = input.replace(/ /g, " ");
  const match = cleaned.match(/^([^\d-]*)(-?\d[\d\s.,]*)(.*)$/);
  if (!match) return { num: null, pre: "", post: input, hasGroup: false };
  const [, pre, raw, post] = match;
  const hasGroup = /\s|,/.test(raw);
  const num = parseFloat(raw.replace(/[\s,]/g, "").replace(",", "."));
  if (!Number.isFinite(num)) {
    return { num: null, pre: "", post: input, hasGroup: false };
  }
  return { num, pre, post, hasGroup };
}

function formatGrouped(n: number, hasGroup: boolean) {
  if (!hasGroup) return String(Math.round(n));
  return Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ");
}

export function CountUp({
  value,
  duration = 1600,
  prefix = "",
  suffix = "",
  className,
}: Props) {
  const parsed = parseNumeric(value);
  const target = parsed.num;
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView || target === null) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setCurrent(target * easeOutCubic(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  if (target === null) {
    return (
      <span ref={ref} className={className}>
        {prefix}
        {value}
        {suffix}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {parsed.pre}
      {formatGrouped(current, parsed.hasGroup)}
      {parsed.post}
      {suffix}
    </span>
  );
}
