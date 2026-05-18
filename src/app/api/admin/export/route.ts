import { NextRequest } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const EXPORTS = {
  tree_requests: [
    "id",
    "created_at",
    "updated_at",
    "status",
    "name",
    "email",
    "phone",
    "country",
    "species_code",
    "quantity",
    "dedication",
    "project_code",
    "locale",
    "admin_note",
  ],
  callback_requests: [
    "id",
    "created_at",
    "updated_at",
    "status",
    "name",
    "phone",
    "source_page",
    "locale",
    "admin_note",
  ],
  pledges: [
    "id",
    "created_at",
    "updated_at",
    "status",
    "name",
    "email",
    "species_code",
    "source_page",
    "locale",
    "admin_note",
  ],
} as const;

type ExportType = keyof typeof EXPORTS;

function isExportType(value: string | null): value is ExportType {
  return (
    value === "tree_requests" ||
    value === "callback_requests" ||
    value === "pledges"
  );
}

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  const safeText = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) {
    return new Response("Forbidden", { status: 403 });
  }

  const type = request.nextUrl.searchParams.get("type");
  if (!isExportType(type)) {
    return new Response("Invalid export type", { status: 400 });
  }

  try {
    const columns = EXPORTS[type];
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(type)
      .select(columns.join(","))
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error) {
      console.error("[admin] export error:", error);
      return new Response("Export failed", { status: 500 });
    }

    const rows = data ?? [];
    const csv = [
      columns.map(csvCell).join(","),
      ...rows.map((row) => {
        const record = row as unknown as Record<string, unknown>;
        return columns.map((column) => csvCell(record[column])).join(",");
      }),
    ].join("\r\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${type}.csv"`,
      },
    });
  } catch (err) {
    console.error("[admin] export unexpected error:", err);
    return new Response("Export failed", { status: 500 });
  }
}
