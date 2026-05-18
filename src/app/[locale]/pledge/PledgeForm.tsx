"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { pledgeSchema, type PledgeInput } from "@/lib/validation/pledge";
import { submitPledge, type PledgeResult } from "@/lib/actions/pledge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TurnstileField } from "@/components/security/TurnstileField";

function getDefaults(locale: string): PledgeInput {
  return {
    name: "",
    email: "",
    speciesCode: "",
    locale,
    source: "",
    website: "",
    startedAt: undefined,
    turnstileToken: "",
  };
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium text-destructive">{children}</p>;
}

export function PledgeForm() {
  const t = useTranslations("pledge");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PledgeInput>({
    resolver: zodResolver(pledgeSchema),
    defaultValues: getDefaults(locale),
  });

  const handleTurnstileToken = useCallback(
    (token: string) => {
      setValue("turnstileToken", token, {
        shouldDirty: true,
        shouldValidate: false,
      });
    },
    [setValue],
  );

  useEffect(() => {
    reset(getDefaults(locale));
    if (typeof window !== "undefined") {
      setValue("source", window.location.pathname, { shouldDirty: false });
      setValue("startedAt", Date.now(), { shouldDirty: false });
      const params = new URLSearchParams(window.location.search);
      const prefillName = params.get("name");
      if (prefillName) {
        setValue("name", prefillName.slice(0, 120), { shouldDirty: false });
      }
    }
  }, [locale, reset, setValue]);

  function errorText(error: Exclude<PledgeResult, { ok: true }>["error"]) {
    return t(`errors.${error}`);
  }

  const onSubmit = (values: PledgeInput) => {
    startTransition(async () => {
      const res = await submitPledge({ ...values, locale });
      if (res.ok) {
        toast.success(t("successTitle"), { description: t("successText") });
        setDone(true);
        setTurnstileResetKey((k) => k + 1);
      } else {
        toast.error(t("errorTitle"), { description: errorText(res.error) });
        setTurnstileResetKey((k) => k + 1);
      }
    });
  };

  if (done) {
    return (
      <div className="rounded-sm border-l-2 border-primary bg-muted/30 p-8">
        <div className="num-lockup nums-tabular text-5xl text-primary sm:text-6xl">
          ·
        </div>
        <h3 className="text-display mt-3 text-2xl leading-tight sm:text-3xl">
          {t("successTitle")}
        </h3>
        <p className="mt-3 text-base leading-[1.7] text-foreground/80">
          <span className="text-serif-italic">{t("successText")}</span>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-sm border border-border bg-card p-6 sm:p-8"
    >
      <div className="sr-only" aria-hidden="true">
        <Label htmlFor="pledge-website">Website</Label>
        <Input
          id="pledge-website"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>
      <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />
      <input type="hidden" {...register("source")} />
      <input type="hidden" {...register("turnstileToken")} />

      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="pledge-name" className="editorial-kicker">
            {t("name")}
          </Label>
          <Input
            id="pledge-name"
            placeholder={t("namePh")}
            autoComplete="name"
            className="h-12 rounded-none border-0 border-b border-border bg-transparent text-lg focus-visible:border-primary"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name ? <FieldError>{t("fieldRequired")}</FieldError> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pledge-email" className="editorial-kicker">
            {t("email")}
          </Label>
          <Input
            id="pledge-email"
            type="email"
            placeholder={t("emailPh")}
            autoComplete="email"
            className="h-12 rounded-none border-0 border-b border-border bg-transparent text-lg focus-visible:border-primary"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email ? (
            <FieldError>
              {errors.email.message
                ? t("emailInvalid")
                : t("fieldRequired")}
            </FieldError>
          ) : null}
        </div>
      </div>

      <div className="mt-6">
        <TurnstileField
          action="pledge"
          resetKey={turnstileResetKey}
          onToken={handleTurnstileToken}
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="mt-8 h-12 w-full rounded-full text-base"
      >
        {isPending ? t("submitting") : t("submit")}
      </Button>

      <p className="mt-4 text-xs text-muted-foreground">
        <span className="text-serif-italic">{t("disclaimer")}</span>
      </p>
    </form>
  );
}
