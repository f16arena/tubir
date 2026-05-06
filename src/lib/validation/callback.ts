import { z } from "zod";

export const callbackSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(5).max(40),
  locale: z.string().trim().min(2).max(5),
  source: z.string().trim().max(120).optional(),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  startedAt: z.number().int().positive().optional(),
  turnstileToken: z.string().trim().max(3000).optional().or(z.literal("")),
});

export type CallbackInput = z.infer<typeof callbackSchema>;
