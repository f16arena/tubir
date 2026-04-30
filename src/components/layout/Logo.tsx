import { Link } from "@/i18n/navigation";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="transition-transform group-hover:rotate-3"
      >
        <path
          d="M16 4 C20 8, 22 11, 22 14 C22 17, 19 18, 17 18 L17 22 C17 22, 19 24, 19 26 L13 26 C13 24, 15 22, 15 22 L15 18 C13 18, 10 17, 10 14 C10 11, 12 8, 16 4 Z"
          fill="currentColor"
          className="text-primary"
        />
        <rect x="14.5" y="22" width="3" height="6" fill="currentColor" className="text-foreground/70" />
      </svg>
      <span className="text-xl">Túbir</span>
    </Link>
  );
}
