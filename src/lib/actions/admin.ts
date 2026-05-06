"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  isCallbackRequestStatus,
  isTreeRequestStatus,
} from "@/lib/admin/constants";
import {
  getAdminEmails,
  isAdminEmail,
  normalizeAdminLocale,
  requireAdminUser,
} from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type AdminLoginResult =
  | { ok: true; sent: boolean }
  | { ok: false; error: "validation" | "config" | "auth" };

type MagicLinkInput = {
  email: string;
  locale: string;
};

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function formText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function cleanAdminNote(value: string): string | null {
  const trimmed = value.trim().slice(0, 1000);
  return trimmed || null;
}

export async function sendAdminMagicLink({
  email,
  locale,
}: MagicLinkInput): Promise<AdminLoginResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const safeLocale = normalizeAdminLocale(locale);

  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return { ok: false, error: "validation" };
  }

  if (getAdminEmails().length === 0) {
    return { ok: false, error: "config" };
  }

  if (!isAdminEmail(normalizedEmail)) {
    return { ok: true, sent: false };
  }

  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";
  const redirectTo = `${origin}/auth/callback?next=/${safeLocale}/admin`;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      emailRedirectTo: redirectTo,
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error("[admin] magic link error:", error);
    return { ok: false, error: "auth" };
  }

  return { ok: true, sent: true };
}

export async function signOutAdmin(locale: string) {
  const safeLocale = normalizeAdminLocale(locale);
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${safeLocale}/admin/login`);
}

export async function updateTreeRequest(formData: FormData) {
  const locale = normalizeAdminLocale(formText(formData, "locale"));
  await requireAdminUser(locale);

  const id = formText(formData, "id");
  const status = formText(formData, "status");
  const adminNote = cleanAdminNote(formText(formData, "admin_note"));

  if (!isUuid(id) || !isTreeRequestStatus(status)) {
    return;
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("tree_requests")
    .update({ status, admin_note: adminNote })
    .eq("id", id);

  if (error) {
    console.error("[admin] tree update error:", error);
  }

  revalidatePath(`/${locale}/admin`);
}

export async function updateCallbackRequest(formData: FormData) {
  const locale = normalizeAdminLocale(formText(formData, "locale"));
  await requireAdminUser(locale);

  const id = formText(formData, "id");
  const status = formText(formData, "status");
  const adminNote = cleanAdminNote(formText(formData, "admin_note"));

  if (!isUuid(id) || !isCallbackRequestStatus(status)) {
    return;
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("callback_requests")
    .update({ status, admin_note: adminNote })
    .eq("id", id);

  if (error) {
    console.error("[admin] callback update error:", error);
  }

  revalidatePath(`/${locale}/admin`);
}
