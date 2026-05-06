import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/ru/admin";
  }
  return value;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));
  const errorRedirect = new URL("/ru/admin/login?error=auth", request.url);

  if (!code) {
    return NextResponse.redirect(errorRedirect);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth] callback exchange error:", error);
    return NextResponse.redirect(errorRedirect);
  }

  return NextResponse.redirect(new URL(next, request.url));
}
