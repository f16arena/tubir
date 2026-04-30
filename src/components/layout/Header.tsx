import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("header.nav");

  const links = [
    { href: "/trees", label: t("trees") },
    { href: "/how", label: t("how") },
    { href: "/about", label: t("about") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <Link
            href="/plant"
            className={cn(buttonVariants({ size: "sm" }), "hidden md:inline-flex")}
          >
            {t("plant")}
          </Link>
          <MobileMenu items={links} plantLabel={t("plant")} />
        </div>
      </div>
    </header>
  );
}
