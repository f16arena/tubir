"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  plantRequestSchema,
  SPECIES_CODES,
  type PlantRequestInput,
} from "@/lib/validation/plant";
import { submitPlantRequest, type PlantActionResult } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SpeciesCode = (typeof SPECIES_CODES)[number];

function getDefaultValues(locale: string, species: SpeciesCode): PlantRequestInput {
  return {
    name: "",
    email: "",
    phone: "",
    country: "",
    species,
    quantity: 1,
    dedication: "",
    locale,
    website: "",
    startedAt: Date.now(),
  };
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium text-destructive">{children}</p>;
}

export function PlantForm() {
  const locale = useLocale();
  const t = useTranslations("plant.form");
  const tSpecies = useTranslations("trees.list");
  const search = useSearchParams();
  const presetSpecies = search.get("species") as SpeciesCode | null;
  const initialSpecies: SpeciesCode = SPECIES_CODES.includes(
    (presetSpecies ?? "") as SpeciesCode,
  )
    ? (presetSpecies as SpeciesCode)
    : "pine";

  const [speciesValue, setSpeciesValue] = useState<SpeciesCode>(initialSpecies);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<PlantRequestInput>({
    resolver: zodResolver(plantRequestSchema),
    defaultValues: getDefaultValues(locale, initialSpecies),
  });

  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function resetForm() {
    setSpeciesValue(initialSpecies);
    reset(getDefaultValues(locale, initialSpecies));
  }

  function getErrorText(error: Exclude<PlantActionResult, { ok: true }>["error"]) {
    return t(`errors.${error}`);
  }

  const onSubmit = (values: PlantRequestInput) => {
    startTransition(async () => {
      const res = await submitPlantRequest({ ...values, locale });
      if (res.ok) {
        toast.success(t("successTitle"), { description: t("successText") });
        resetForm();
        setDone(true);
      } else {
        toast.error(t("errorTitle"), { description: getErrorText(res.error) });
      }
    });
  };

  if (done) {
    return (
      <div className="rounded-lg border border-primary/40 bg-primary/5 p-6 text-center">
        <h3 className="text-lg font-semibold">{t("successTitle")}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{t("successText")}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDone(false)}
          className="mt-4"
        >
          ←
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="sr-only" aria-hidden="true">
        <Label htmlFor="plant-website">Website</Label>
        <Input
          id="plant-website"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>
      <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            placeholder={t("namePlaceholder")}
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name ? <FieldError>{t("fieldRequired")}</FieldError> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email ? <FieldError>{t("emailInvalid")}</FieldError> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t("phonePlaceholder")}
            {...register("phone")}
          />
          {errors.phone ? <FieldError>{t("fieldInvalid")}</FieldError> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="country">{t("country")}</Label>
          <Input
            id="country"
            placeholder={t("countryPlaceholder")}
            {...register("country")}
          />
          {errors.country ? <FieldError>{t("fieldInvalid")}</FieldError> : null}
        </div>
        <div className="space-y-1.5">
          <Label>{t("species")}</Label>
          <Select
            value={speciesValue}
            onValueChange={(v) => {
              const nextSpecies = v as SpeciesCode;
              setSpeciesValue(nextSpecies);
              setValue("species", nextSpecies, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("speciesPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {SPECIES_CODES.map((code) => (
                <SelectItem key={code} value={code}>
                  {tSpecies(`${code}.name`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.species ? <FieldError>{t("fieldRequired")}</FieldError> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="quantity">{t("quantity")}</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            max={1000}
            aria-invalid={!!errors.quantity}
            {...register("quantity", { valueAsNumber: true })}
          />
          {errors.quantity ? <FieldError>{t("quantityInvalid")}</FieldError> : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dedication">{t("dedication")}</Label>
        <Textarea
          id="dedication"
          rows={3}
          placeholder={t("dedicationPlaceholder")}
          {...register("dedication")}
        />
        {errors.dedication ? <FieldError>{t("fieldInvalid")}</FieldError> : null}
      </div>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
