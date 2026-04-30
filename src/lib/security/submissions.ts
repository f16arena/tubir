type SubmissionGuardInput = {
  bucket: string;
  identity: string;
  honeypot?: string;
  startedAt?: number;
  maxAttempts?: number;
  windowMs?: number;
  minDelayMs?: number;
};

export type SubmissionGuardError = "spam" | "rate_limited";
export type SubmissionGuardResult =
  | { ok: true }
  | { ok: false; error: SubmissionGuardError };

const attempts = new Map<string, number[]>();

function normalizeIdentity(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export function checkSubmissionGuard({
  bucket,
  identity,
  honeypot,
  startedAt,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000,
  minDelayMs = 1800,
}: SubmissionGuardInput): SubmissionGuardResult {
  if (honeypot?.trim()) {
    return { ok: false, error: "spam" };
  }

  const now = Date.now();
  if (startedAt && now - startedAt < minDelayMs) {
    return { ok: false, error: "spam" };
  }

  const key = `${bucket}:${normalizeIdentity(identity) || "anonymous"}`;
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < windowMs);

  if (recent.length >= maxAttempts) {
    attempts.set(key, recent);
    return { ok: false, error: "rate_limited" };
  }

  recent.push(now);
  attempts.set(key, recent);
  return { ok: true };
}
