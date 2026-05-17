"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Stroke colour — defaults to currentColor */
  color?: string;
  height?: number;
  /** SVG viewBox width — affects only proportions. */
  width?: number;
};

/**
 * A vertical "root" path that draws itself based on the element's scroll
 * progress through the viewport. Use as a connector between sections.
 */
export function RootDraw({
  className,
  color = "currentColor",
  height = 320,
  width = 80,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [len, setLen] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      setLen(pathRef.current.getTotalLength());
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    const p = pathRef.current;
    if (!el || !p || len === 0) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      p.style.strokeDashoffset = "0";
      return;
    }
    p.style.strokeDasharray = `${len}`;
    p.style.strokeDashoffset = `${len}`;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when element bottom is at viewport bottom, 1 when element top has crossed viewport top
      const startY = vh; // enters
      const endY = -rect.height * 0.2;
      const progress = Math.max(
        0,
        Math.min(1, (startY - rect.top) / (startY - endY)),
      );
      p.style.strokeDashoffset = `${len * (1 - progress)}`;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [len]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none flex justify-center", className)}
      style={{ color }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        className="block"
      >
        <path
          ref={pathRef}
          d={`M ${width / 2} 0
              C ${width / 2} ${height * 0.18},
                ${width * 0.35} ${height * 0.28},
                ${width * 0.42} ${height * 0.45}
              S ${width * 0.66} ${height * 0.62},
                ${width * 0.5}  ${height * 0.78}
              S ${width * 0.4}  ${height * 0.9},
                ${width / 2}    ${height}`}
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        {/* hair offshoots */}
        <path
          d={`M ${width * 0.42} ${height * 0.45} l -10 6`}
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d={`M ${width * 0.5} ${height * 0.78} l 10 5`}
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
