"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeMeLocale } from "@/lib/me/auth";

export type MeLoginResult =
  | { ok: true; sent: boolean }
  | { ok: false; error: "validation" | "auth" };

type MagicLinkInput = {
  email: string;
  locale: string;
};

export async function sendMeMagicLink({
  email,
  locale,
}: MagicLinkInput): Promise<MeLoginResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const safeLocale = normalizeMeLocale(locale);

  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return { ok: false, error: "validation" };
  }

  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";
  const redirectTo = `${origin}/auth/callback?next=/${safeLocale}/me`;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      emailRedirectTo: redirectTo,
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error("[me] magic link error:", error);
    return { ok: false, error: "auth" };
  }

  return { ok: true, sent: true };
}

export async function signOutMe(locale: string) {
  const safeLocale = normalizeMeLocale(locale);
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${safeLocale}`);
}
