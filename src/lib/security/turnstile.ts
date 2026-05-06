import "server-only";

export type TurnstileError = "turnstile" | "turnstile_config";
export type TurnstileResult = { ok: true } | { ok: false; error: TurnstileError };

type SiteverifyResponse = {
  success?: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp?: string | null,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV !== "production") {
      return { ok: true };
    }
    return { ok: false, error: "turnstile_config" };
  }

  if (!token) {
    return { ok: false, error: "turnstile" };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        cache: "no-store",
      },
    );
    const result = (await response.json()) as SiteverifyResponse;
    return response.ok && result.success
      ? { ok: true }
      : { ok: false, error: "turnstile" };
  } catch (err) {
    console.error("[turnstile] verification failed:", err);
    return { ok: false, error: "turnstile" };
  }
}
