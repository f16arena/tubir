import { z } from "zod";

export const SPECIES_CODES = [
  "pine",
  "birch",
  "spruce",
  "oak",
  "apple",
  "apricot",
] as const;

export const plantRequestSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  species: z.enum(SPECIES_CODES),
  quantity: z.number().int().min(1).max(1000),
  dedication: z.string().trim().max(200).optional().or(z.literal("")),
  locale: z.string().trim().min(2).max(5),
});

export type PlantRequestInput = z.infer<typeof plantRequestSchema>;
