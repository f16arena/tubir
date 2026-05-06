import type { CallbackStatus, RequestStatus } from "@/lib/db/types";

export const TREE_REQUEST_STATUSES = [
  "pending",
  "contacted",
  "paid",
  "planted",
  "cancelled",
] as const satisfies readonly RequestStatus[];

export const CALLBACK_REQUEST_STATUSES = [
  "pending",
  "called",
  "missed",
  "closed",
  "spam",
] as const satisfies readonly CallbackStatus[];

export function isTreeRequestStatus(value: string): value is RequestStatus {
  return TREE_REQUEST_STATUSES.includes(value as RequestStatus);
}

export function isCallbackRequestStatus(value: string): value is CallbackStatus {
  return CALLBACK_REQUEST_STATUSES.includes(value as CallbackStatus);
}
