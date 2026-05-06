import "server-only";

import { headers } from "next/headers";

function firstForwardedIp(value: string | null): string | null {
  if (!value) return null;
  return value
    .split(",")
    .map((part) => part.trim())
    .find(Boolean) ?? null;
}

export async function getSubmissionRequestContext() {
  const headerStore = await headers();
  const ip =
    firstForwardedIp(headerStore.get("cf-connecting-ip")) ??
    firstForwardedIp(headerStore.get("x-real-ip")) ??
    firstForwardedIp(headerStore.get("x-forwarded-for"));

  return {
    ip,
    userAgent: headerStore.get("user-agent")?.slice(0, 600) ?? null,
  };
}
