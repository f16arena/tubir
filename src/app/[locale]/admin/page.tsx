import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  CALLBACK_REQUEST_STATUSES,
  PLEDGE_STATUSES,
  TREE_REQUEST_STATUSES,
  isCallbackRequestStatus,
  isPledgeStatus,
  isTreeRequestStatus,
} from "@/lib/admin/constants";
import { requireAdminUser } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  CallbackRequest,
  Pledge,
  PledgeStatus,
  RequestStatus,
  TreeRequest,
} from "@/lib/db/types";
import {
  signOutAdmin,
  updateCallbackRequest,
  updatePledge,
  updateTreeRequest,
} from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { type Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

type Search = Record<string, string | string[] | undefined>;
type AdminTranslator = Awaited<ReturnType<typeof getTranslations>>;

function searchValue(search: Search, key: string): string {
  const value = search[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function formatDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function adminTextValue(value: string | null | undefined): string {
  return value && value.trim() ? value : "-";
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm">{value}</dd>
    </div>
  );
}

function StatusSelect({
  name,
  value,
  statuses,
  getLabel,
}: {
  name: string;
  value: string;
  statuses: readonly string[];
  getLabel: (status: string) => string;
}) {
  return (
    <select
      name={name}
      defaultValue={value}
      className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
    >
      {statuses.map((status) => (
        <option key={status} value={status}>
          {getLabel(status)}
        </option>
      ))}
    </select>
  );
}

function TreeRequestCard({
  request,
  locale,
  t,
}: {
  request: TreeRequest;
  locale: Locale;
  t: AdminTranslator;
}) {
  return (
    <article className="rounded-lg border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-medium">{request.name}</h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(request.created_at, locale)}
          </p>
        </div>
        <span className="w-fit rounded-md bg-muted px-2 py-1 text-xs font-medium">
          {t(`statuses.tree.${request.status}`)}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label={t("email")} value={request.email} />
        <Field label={t("phone")} value={adminTextValue(request.phone)} />
        <Field label={t("species")} value={request.species_code} />
        <Field label={t("quantity")} value={request.quantity} />
        <Field label={t("country")} value={adminTextValue(request.country)} />
        <Field label={t("locale")} value={request.locale} />
        <Field label={t("dedication")} value={adminTextValue(request.dedication)} />
        <Field label={t("updatedAt")} value={formatDate(request.updated_at, locale)} />
      </dl>

      <form action={updateTreeRequest} className="mt-4 grid gap-3 sm:grid-cols-[180px_1fr_auto]">
        <input type="hidden" name="id" value={request.id} />
        <input type="hidden" name="locale" value={locale} />
        <StatusSelect
          name="status"
          value={request.status}
          statuses={TREE_REQUEST_STATUSES}
          getLabel={(status) => t(`statuses.tree.${status}`)}
        />
        <input
          name="admin_note"
          defaultValue={request.admin_note ?? ""}
          placeholder={t("adminNote")}
          className="h-8 rounded-lg border border-input bg-background px-3 text-sm"
        />
        <Button type="submit" size="sm">
          {t("save")}
        </Button>
      </form>
    </article>
  );
}

function PledgeCard({
  pledge,
  locale,
  t,
}: {
  pledge: Pledge;
  locale: Locale;
  t: AdminTranslator;
}) {
  return (
    <article className="rounded-lg border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-medium">{pledge.name}</h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(pledge.created_at, locale)}
          </p>
        </div>
        <span className="w-fit rounded-md bg-muted px-2 py-1 text-xs font-medium">
          {t(`statuses.pledge.${pledge.status}`)}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label={t("email")} value={pledge.email} />
        <Field label={t("species")} value={adminTextValue(pledge.species_code)} />
        <Field label={t("source")} value={adminTextValue(pledge.source_page)} />
        <Field label={t("locale")} value={pledge.locale} />
        <Field label={t("updatedAt")} value={formatDate(pledge.updated_at, locale)} />
      </dl>

      <form
        action={updatePledge}
        className="mt-4 grid gap-3 sm:grid-cols-[180px_1fr_auto]"
      >
        <input type="hidden" name="id" value={pledge.id} />
        <input type="hidden" name="locale" value={locale} />
        <StatusSelect
          name="status"
          value={pledge.status}
          statuses={PLEDGE_STATUSES}
          getLabel={(status) => t(`statuses.pledge.${status}`)}
        />
        <input
          name="admin_note"
          defaultValue={pledge.admin_note ?? ""}
          placeholder={t("adminNote")}
          className="h-8 rounded-lg border border-input bg-background px-3 text-sm"
        />
        <Button type="submit" size="sm">
          {t("save")}
        </Button>
      </form>
    </article>
  );
}

function CallbackRequestCard({
  request,
  locale,
  t,
}: {
  request: CallbackRequest;
  locale: Locale;
  t: AdminTranslator;
}) {
  return (
    <article className="rounded-lg border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-medium">{request.name}</h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(request.created_at, locale)}
          </p>
        </div>
        <span className="w-fit rounded-md bg-muted px-2 py-1 text-xs font-medium">
          {t(`statuses.callback.${request.status}`)}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label={t("phone")} value={request.phone} />
        <Field label={t("source")} value={adminTextValue(request.source_page)} />
        <Field label={t("locale")} value={request.locale} />
        <Field label={t("updatedAt")} value={formatDate(request.updated_at, locale)} />
      </dl>

      <form
        action={updateCallbackRequest}
        className="mt-4 grid gap-3 sm:grid-cols-[180px_1fr_auto]"
      >
        <input type="hidden" name="id" value={request.id} />
        <input type="hidden" name="locale" value={locale} />
        <StatusSelect
          name="status"
          value={request.status}
          statuses={CALLBACK_REQUEST_STATUSES}
          getLabel={(status) => t(`statuses.callback.${status}`)}
        />
        <input
          name="admin_note"
          defaultValue={request.admin_note ?? ""}
          placeholder={t("adminNote")}
          className="h-8 rounded-lg border border-input bg-background px-3 text-sm"
        />
        <Button type="submit" size="sm">
          {t("save")}
        </Button>
      </form>
    </article>
  );
}

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Search>;
}) {
  const { locale } = await params;
  const search = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "admin.dashboard" });
  const user = await requireAdminUser(locale);

  const rawTreeStatus = searchValue(search, "treeStatus");
  const rawCallbackStatus = searchValue(search, "callbackStatus");
  const rawPledgeStatus = searchValue(search, "pledgeStatus");
  const treeStatus: RequestStatus | "all" = isTreeRequestStatus(rawTreeStatus)
    ? rawTreeStatus
    : "all";
  const callbackStatus = isCallbackRequestStatus(rawCallbackStatus)
    ? rawCallbackStatus
    : "all";
  const pledgeStatus: PledgeStatus | "all" = isPledgeStatus(rawPledgeStatus)
    ? rawPledgeStatus
    : "all";

  let treeRequests: TreeRequest[] = [];
  let callbackRequests: CallbackRequest[] = [];
  let pledges: Pledge[] = [];
  let loadError = "";

  try {
    const supabase = createAdminClient();
    let treeQuery = supabase
      .from("tree_requests")
      .select(
        "id,name,email,phone,country,species_code,quantity,dedication,project_code,status,locale,user_agent,ip_hash,identity_hash,admin_note,created_at,updated_at",
      )
      .order("created_at", { ascending: false })
      .limit(100);
    let callbackQuery = supabase
      .from("callback_requests")
      .select(
        "id,name,phone,locale,source_page,status,user_agent,ip_hash,identity_hash,admin_note,created_at,updated_at",
      )
      .order("created_at", { ascending: false })
      .limit(100);
    let pledgeQuery = supabase
      .from("pledges")
      .select(
        "id,name,email,species_code,locale,source_page,status,user_agent,ip_hash,identity_hash,admin_note,created_at,updated_at",
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (treeStatus !== "all") {
      treeQuery = treeQuery.eq("status", treeStatus);
    }
    if (callbackStatus !== "all") {
      callbackQuery = callbackQuery.eq("status", callbackStatus);
    }
    if (pledgeStatus !== "all") {
      pledgeQuery = pledgeQuery.eq("status", pledgeStatus);
    }

    const [treeResult, callbackResult, pledgeResult] = await Promise.all([
      treeQuery,
      callbackQuery,
      pledgeQuery,
    ]);
    if (treeResult.error || callbackResult.error || pledgeResult.error) {
      loadError = t("loadError");
      console.error(
        "[admin] load error:",
        treeResult.error,
        callbackResult.error,
        pledgeResult.error,
      );
    }
    treeRequests = (treeResult.data ?? []) as TreeRequest[];
    callbackRequests = (callbackResult.data ?? []) as CallbackRequest[];
    pledges = (pledgeResult.data ?? []) as Pledge[];
  } catch (err) {
    loadError = t("configError");
    console.error("[admin] config error:", err);
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">{t("eyebrow")}</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-normal">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("signedInAs", { email: user.email ?? "-" })}
          </p>
        </div>
        <form action={signOutAdmin.bind(null, locale)}>
          <Button type="submit" variant="outline" size="sm">
            {t("signOut")}
          </Button>
        </form>
      </div>

      {loadError ? (
        <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          {loadError}
        </div>
      ) : null}

      <form className="mt-6 flex flex-wrap items-end gap-3" method="get">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">{t("treeFilter")}</span>
          <select
            name="treeStatus"
            defaultValue={treeStatus}
            className="block h-8 rounded-lg border border-input bg-background px-2"
          >
            <option value="all">{t("allStatuses")}</option>
            {TREE_REQUEST_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`statuses.tree.${status}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">{t("callbackFilter")}</span>
          <select
            name="callbackStatus"
            defaultValue={callbackStatus}
            className="block h-8 rounded-lg border border-input bg-background px-2"
          >
            <option value="all">{t("allStatuses")}</option>
            {CALLBACK_REQUEST_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`statuses.callback.${status}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">{t("pledgeFilter")}</span>
          <select
            name="pledgeStatus"
            defaultValue={pledgeStatus}
            className="block h-8 rounded-lg border border-input bg-background px-2"
          >
            <option value="all">{t("allStatuses")}</option>
            {PLEDGE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`statuses.pledge.${status}`)}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" variant="outline" size="sm">
          {t("applyFilters")}
        </Button>
      </form>

      <div className="mt-8 grid gap-8">
        <section>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-heading text-2xl font-semibold">{t("treeRequests")}</h2>
            <Link
              href="/api/admin/export?type=tree_requests"
              className="text-sm font-medium text-primary hover:underline"
            >
              {t("exportCsv")}
            </Link>
          </div>
          <div className="grid gap-3">
            {treeRequests.length ? (
              treeRequests.map((request) => (
                <TreeRequestCard
                  key={request.id}
                  request={request}
                  locale={locale}
                  t={t}
                />
              ))
            ) : (
              <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
                {t("noRequests")}
              </p>
            )}
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-heading text-2xl font-semibold">{t("pledges")}</h2>
            <Link
              href="/api/admin/export?type=pledges"
              className="text-sm font-medium text-primary hover:underline"
            >
              {t("exportCsv")}
            </Link>
          </div>
          <div className="grid gap-3">
            {pledges.length ? (
              pledges.map((pledge) => (
                <PledgeCard
                  key={pledge.id}
                  pledge={pledge}
                  locale={locale}
                  t={t}
                />
              ))
            ) : (
              <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
                {t("noRequests")}
              </p>
            )}
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-heading text-2xl font-semibold">
              {t("callbackRequests")}
            </h2>
            <Link
              href="/api/admin/export?type=callback_requests"
              className="text-sm font-medium text-primary hover:underline"
            >
              {t("exportCsv")}
            </Link>
          </div>
          <div className="grid gap-3">
            {callbackRequests.length ? (
              callbackRequests.map((request) => (
                <CallbackRequestCard
                  key={request.id}
                  request={request}
                  locale={locale}
                  t={t}
                />
              ))
            ) : (
              <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
                {t("noRequests")}
              </p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
