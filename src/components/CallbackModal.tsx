"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { X } from "lucide-react";
import { callbackSchema, type CallbackInput } from "@/lib/validation/callback";
import { submitCallback, type CallbackResult } from "@/lib/actions/callback";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TurnstileField } from "@/components/security/TurnstileField";

type Props = { open: boolean; onClose: () => void };

function getStartedAt(): number {
  return Date.now();
}

function getDefaultValues(locale: string): CallbackInput {
  return {
    name: "",
    phone: "",
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

export function CallbackModal({ open, onClose }: Props) {
  const t = useTranslations("callback");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const nameRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CallbackInput>({
    resolver: zodResolver(callbackSchema),
    defaultValues: getDefaultValues(locale),
  });

  const nameRegistration = register("name");

  const handleTurnstileToken = useCallback(
    (token: string) => {
      setValue("turnstileToken", token, {
        shouldDirty: true,
        shouldValidate: false,
      });
    },
    [setValue],
  );

  const handleClose = useCallback(() => {
    setDone(false);
    onClose();
  }, [onClose]);

  function getErrorText(error: Exclude<CallbackResult, { ok: true }>["error"]) {
    return t(`errors.${error}`);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", onKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [handleClose, open]);

  useEffect(() => {
    if (!open) return;
    reset(getDefaultValues(locale));
    setValue("source", window.location.pathname, { shouldDirty: false });
    setValue("startedAt", getStartedAt(), { shouldDirty: false });
    const timer = window.setTimeout(() => nameRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open, locale, reset, setValue]);

  if (!open) return null;

  const onSubmit = (values: CallbackInput) => {
    startTransition(async () => {
      const res = await submitCallback({ ...values, locale });
      if (res.ok) {
        toast.success(t("successTitle"), { description: t("successText") });
        setDone(true);
        setTurnstileResetKey((key) => key + 1);
      } else {
        toast.error(t("errorTitle"), { description: getErrorText(res.error) });
        setTurnstileResetKey((key) => key + 1);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label={t("close")}
        onClick={handleClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          aria-label={t("close")}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-7">
          <h3 className="pr-8 text-xl font-semibold tracking-tight">{t("title")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>

          {done ? (
            <div className="mt-6 rounded-lg border border-primary/40 bg-primary/5 p-4 text-center">
              <h4 className="text-base font-semibold">{t("successTitle")}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{t("successText")}</p>
              <Button variant="ghost" size="sm" onClick={handleClose} className="mt-3">
                {t("close")}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
              <div className="sr-only" aria-hidden="true">
                <Label htmlFor="cb-website">Website</Label>
                <Input
                  id="cb-website"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("website")}
                />
              </div>
              <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />
              <input type="hidden" {...register("source")} />
              <input type="hidden" {...register("turnstileToken")} />

              <div className="space-y-1.5">
                <Label htmlFor="cb-name">{t("name")}</Label>
                <Input
                  id="cb-name"
                  placeholder={t("namePh")}
                  aria-invalid={!!errors.name}
                  {...nameRegistration}
                  ref={(node) => {
                    nameRegistration.ref(node);
                    nameRef.current = node;
                  }}
                />
                {errors.name ? <FieldError>{t("fieldRequired")}</FieldError> : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cb-phone">{t("phone")}</Label>
                <Input
                  id="cb-phone"
                  type="tel"
                  placeholder={t("phonePh")}
                  aria-invalid={!!errors.phone}
                  {...register("phone")}
                />
                {errors.phone ? <FieldError>{t("phoneInvalid")}</FieldError> : null}
              </div>
              <TurnstileField
                action="callback"
                resetKey={turnstileResetKey}
                onToken={handleTurnstileToken}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? t("submitting") : t("submit")}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
