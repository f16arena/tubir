import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  InstagramIcon,
  TelegramIcon,
  WhatsAppIcon,
} from "./SocialIcons";
import { contacts } from "@/lib/data/contacts";

const social = [
  { href: contacts.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: contacts.telegram, label: "Telegram", Icon: TelegramIcon },
  { href: contacts.whatsapp, label: "WhatsApp", Icon: WhatsAppIcon },
];

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("header.nav");

  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-4 text-pretty text-sm text-muted-foreground leading-relaxed">
              {t("tagline")}
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {t("region")}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/70">
              {tNav("home")}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/trees" className="hover:text-foreground">
                  {tNav("trees")}
                </Link>
              </li>
              <li>
                <Link href="/how" className="hover:text-foreground">
                  {tNav("how")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground">
                  {tNav("about")}
                </Link>
              </li>
              <li>
                <Link href="/plant" className="hover:text-foreground">
                  {tNav("plant")}
                </Link>
              </li>
            </ul>

            <h4 className="mt-7 text-xs font-semibold uppercase tracking-widest text-foreground/70">
              {t("extras")}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/letter" className="hover:text-foreground">
                  {t("letterLink")}
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-foreground">
                  {t("teamLink")}
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-foreground">
                  {t("pressLink")}
                </Link>
              </li>
              <li>
                <Link href="/numbers" className="hover:text-foreground">
                  {t("numbersLink")}
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-foreground">
                  {t("mapLink")}
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground">
                  {t("roadmapLink")}
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-foreground">
                  {t("partnersLink")}
                </Link>
              </li>
              <li>
                <Link href="/business" className="hover:text-foreground">
                  {t("businessLink")}
                </Link>
              </li>
              <li>
                <Link href="/diaspora" className="hover:text-foreground">
                  {t("diasporaLink")}
                </Link>
              </li>
              <li>
                <Link href="/pledge" className="hover:text-foreground">
                  {t("pledgeLink")}
                </Link>
              </li>
            </ul>

            <h4 className="mt-7 text-xs font-semibold uppercase tracking-widest text-foreground/70">
              {t("projects")}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/projects/polygon" className="hover:text-foreground">
                  {t("polygonLink")}
                </Link>
              </li>
              <li>
                <Link href="/projects/atameken" className="hover:text-foreground">
                  {t("atamekenLink")}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-foreground">
                  {t("productsLink")}
                </Link>
              </li>
              <li>
                <Link href="/gift" className="hover:text-foreground">
                  {t("giftLink")}
                </Link>
              </li>
              <li>
                <Link href="/certificate" className="hover:text-foreground">
                  {t("certificateLink")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/70">
              {t("contact")}
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${contacts.email}`}
                  className="inline-flex items-center gap-2 text-foreground hover:text-primary"
                >
                  <Mail className="h-4 w-4" />
                  {contacts.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contacts.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 text-foreground hover:text-primary"
                >
                  <Phone className="h-4 w-4" />
                  {contacts.phone}
                </a>
              </li>
            </ul>

            <h4 className="mt-7 text-xs font-semibold uppercase tracking-widest text-foreground/70">
              {t("social")}
            </h4>
            <div className="mt-3 flex items-center gap-2">
              {social.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground/70 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/70">
              {t("legal")}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/legal/offer" className="hover:text-foreground">
                  {t("offerLink")}
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-foreground">
                  {t("privacyLink")}
                </Link>
              </li>
              <li>
                <Link href="/legal/refund" className="hover:text-foreground">
                  {t("refundLink")}
                </Link>
              </li>
            </ul>
            <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
              {t("company")}
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          {t("rights")}
        </div>
      </div>
    </footer>
  );
}
