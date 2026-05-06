import "server-only";

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { routing, type Locale } from "@/i18n/routing";

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(/[\s,;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}

export function normalizeAdminLocale(locale: string | null | undefined): Locale {
  return routing.locales.includes(locale as Locale) ? (locale as Locale) : "ru";
}

export async function getAdminUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const user = data.user;

  if (error || !isAdminEmail(user?.email)) {
    return null;
  }

  return user;
}

export async function requireAdminUser(locale?: string): Promise<User> {
  const safeLocale = normalizeAdminLocale(locale);
  const user = await getAdminUser();

  if (!user) {
    redirect(`/${safeLocale}/admin/login`);
  }

  return user;
}
