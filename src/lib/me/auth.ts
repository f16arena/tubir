import "server-only";

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { routing, type Locale } from "@/i18n/routing";

export function normalizeMeLocale(locale: string | null | undefined): Locale {
  return routing.locales.includes(locale as Locale) ? (locale as Locale) : "ru";
}

export async function getMeUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return null;
  return data.user;
}

export async function requireMeUser(locale?: string): Promise<User> {
  const safeLocale = normalizeMeLocale(locale);
  const user = await getMeUser();
  if (!user) {
    redirect(`/${safeLocale}/me/login`);
  }
  return user;
}
