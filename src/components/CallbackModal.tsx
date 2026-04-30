"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { X } from "lucide-react";
import { callbackSchema, type CallbackInput } from "@/lib/validation/callback";
import { submitCallback } from "@/lib/actions/callback";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = { open: boolean; onClose: () => void };

export function CallbackModal({ open, onClose }: Props) {
  const t = useTranslations("callback");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CallbackInput>({
    resolver: zodResolver(callbackSchema),
    defaultValues: { name: "", phone: "", locale, source: "" },
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setDone(false);
      reset({
        name: "",
        phone: "",
        locale,
        source: typeof window !== "undefined" ? window.location.pathname : "",
      });
    }
  }, [open, locale, reset]);

  if (!open) return null;

  const onSubmit = (values: CallbackInput) => {
    startTransition(async () => {
      const res = await submitCallback({ ...values, locale });
      if (res.ok) {
        toast.success(t("successTitle"), { description: t("successText") });
        setDone(true);
      } else {
        toast.error(t("errorTitle"), { description: t("errorText") });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label={t("close")}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <button
          type="button"
          onClick={onClose}
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
              <Button variant="ghost" size="sm" onClick={onClose} className="mt-3">
                {t("close")}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="cb-name">{t("name")}</Label>
                <Input
                  id="cb-name"
                  placeholder={t("namePh")}
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
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
              </div>
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
