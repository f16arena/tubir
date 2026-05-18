import type { CallbackStatus, PledgeStatus, RequestStatus } from "@/lib/db/types";

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

export const PLEDGE_STATUSES = [
  "pending",
  "contacted",
  "converted",
  "cancelled",
  "spam",
] as const satisfies readonly PledgeStatus[];

export function isTreeRequestStatus(value: string): value is RequestStatus {
  return TREE_REQUEST_STATUSES.includes(value as RequestStatus);
}

export function isCallbackRequestStatus(value: string): value is CallbackStatus {
  return CALLBACK_REQUEST_STATUSES.includes(value as CallbackStatus);
}

export function isPledgeStatus(value: string): value is PledgeStatus {
  return PLEDGE_STATUSES.includes(value as PledgeStatus);
}
