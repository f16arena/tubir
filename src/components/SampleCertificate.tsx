import { useTranslations } from "next-intl";
import { QrCode } from "lucide-react";

export function SampleCertificate() {
  const t = useTranslations("certificate.sample");

  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-muted/40 p-8 shadow-2xl shadow-primary/5 sm:p-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--accent)_0%,_transparent_60%)] opacity-40"
      />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
            {t("issuer")}
          </div>
          <QrCode className="h-12 w-12 text-foreground/30" />
        </div>

        <h3 className="mt-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {t("title")}
        </h3>
        <p className="mt-2 max-w-md text-pretty text-sm text-foreground/80">
          {t("subtitle")}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {t("owner")}
            </div>
            <div className="mt-1 font-semibold text-foreground">{t("ownerValue")}</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {t("species")}
            </div>
            <div className="mt-1 font-semibold text-foreground">{t("speciesValue")}</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {t("date")}
            </div>
            <div className="mt-1 font-mono text-foreground">{t("dateValue")}</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {t("gps")}
            </div>
            <div className="mt-1 font-mono text-foreground">{t("gpsValue")}</div>
          </div>
          <div className="col-span-2">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {t("dedication")}
            </div>
            <div className="mt-1 italic text-foreground/90">«{t("dedicationValue")}»</div>
          </div>
        </div>

        <div className="mt-10 flex items-end justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <span className="font-mono">{t("idValue")}</span>
          <span className="italic">{t("footerLine")}</span>
        </div>
      </div>
    </div>
  );
}
