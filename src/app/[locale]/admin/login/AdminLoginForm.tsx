"use client";

import { useLocale, useTranslations } from "next-intl";
import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { sendAdminMagicLink, type AdminLoginResult } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const t = useTranslations("admin.login");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<AdminLoginResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const message = result
    ? result.ok
      ? {
          title: t("sentTitle"),
          text: t("sentText"),
          tone: "success" as const,
        }
      : {
          title: t("errorTitle"),
          text: t(`errors.${result.error}`),
          tone: "error" as const,
        }
    : null;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      setResult(await sendAdminMagicLink({ email, locale }));
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="admin-email">{t("email")}</Label>
        <Input
          id="admin-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          placeholder={t("emailPlaceholder")}
          autoComplete="email"
          required
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? t("sending") : t("sendLink")}
      </Button>
      {message ? (
        <div
          className={
            message.tone === "success"
              ? "rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm"
              : "rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm"
          }
        >
          <p className="font-medium">{message.title}</p>
          <p className="mt-1 text-muted-foreground">{message.text}</p>
        </div>
      ) : null}
    </form>
  );
}
