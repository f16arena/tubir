import { z } from "zod";

export const pledgeSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  speciesCode: z.string().trim().min(1).max(40).optional().or(z.literal("")),
  locale: z.string().trim().min(2).max(5),
  source: z.string().trim().max(120).optional(),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  startedAt: z.number().int().positive().optional(),
  turnstileToken: z.string().trim().max(3000).optional().or(z.literal("")),
});

export type PledgeInput = z.infer<typeof pledgeSchema>;
