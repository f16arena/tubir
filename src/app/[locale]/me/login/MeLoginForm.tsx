"use client";

import { useLocale, useTranslations } from "next-intl";
import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { sendMeMagicLink, type MeLoginResult } from "@/lib/actions/me";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MeLoginForm() {
  const t = useTranslations("me.login");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<MeLoginResult | null>(null);
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
      setResult(await sendMeMagicLink({ email, locale }));
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="me-email" className="editorial-kicker">
          {t("email")}
        </Label>
        <Input
          id="me-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          placeholder={t("emailPlaceholder")}
          autoComplete="email"
          required
          className="h-12 rounded-none border-0 border-b border-border bg-transparent text-lg focus-visible:border-primary"
        />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="h-12 w-full rounded-full text-base"
      >
        {isPending ? t("sending") : t("sendLink")}
      </Button>
      {message ? (
        <div
          className={
            message.tone === "success"
              ? "rounded-sm border-l-2 border-primary bg-muted/30 p-4 text-sm"
              : "rounded-sm border-l-2 border-destructive bg-destructive/5 p-4 text-sm"
          }
        >
          <p className="font-medium">{message.title}</p>
          <p className="mt-1 text-muted-foreground">{message.text}</p>
        </div>
      ) : null}
      <p className="text-xs text-muted-foreground">
        <span className="text-serif-italic">{t("hint")}</span>
      </p>
    </form>
  );
}
