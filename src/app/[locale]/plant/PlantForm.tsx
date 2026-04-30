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
import { submitPlantRequest } from "./actions";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PlantRequestInput>({
    resolver: zodResolver(plantRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      species: initialSpecies,
      quantity: 1,
      dedication: "",
      locale,
    },
  });

  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const speciesValue = watch("species");

  const onSubmit = (values: PlantRequestInput) => {
    startTransition(async () => {
      const res = await submitPlantRequest({ ...values, locale });
      if (res.ok) {
        toast.success(t("successTitle"), { description: t("successText") });
        reset();
        setDone(true);
      } else {
        toast.error(t("errorTitle"), { description: t("errorText") });
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            placeholder={t("namePlaceholder")}
            aria-invalid={!!errors.name}
            {...register("name")}
          />
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
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t("phonePlaceholder")}
            {...register("phone")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="country">{t("country")}</Label>
          <Input
            id="country"
            placeholder={t("countryPlaceholder")}
            {...register("country")}
          />
        </div>
        <div className="space-y-1.5">
          <Label>{t("species")}</Label>
          <Select
            value={speciesValue}
            onValueChange={(v) => setValue("species", v as SpeciesCode, { shouldValidate: true })}
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
      </div>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
