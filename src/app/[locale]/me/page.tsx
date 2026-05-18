import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/editorial/PageIntro";
import { Reveal } from "@/components/motion/Reveal";
import { createClient } from "@/lib/supabase/server";
import { requireMeUser } from "@/lib/me/auth";
import { signOutMe } from "@/lib/actions/me";
import type { Pledge, TreeRequest } from "@/lib/db/types";
import { type Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function MePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "me.dashboard" });
  const user = await requireMeUser(locale);

  // User-context Supabase client — respects RLS, so SELECT only returns
  // rows where the user's email matches the policy.
  const supabase = await createClient();
  const [pledgeRes, requestRes] = await Promise.all([
    supabase
      .from("pledges")
      .select(
        "id,name,email,species_code,locale,source_page,status,admin_note,created_at,updated_at",
      )
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("tree_requests")
      .select(
        "id,name,email,phone,country,species_code,quantity,dedication,project_code,status,locale,admin_note,created_at,updated_at",
      )
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const pledges = (pledgeRes.data ?? []) as Pledge[];
  const requests = (requestRes.data ?? []) as TreeRequest[];
  const loadError = pledgeRes.error || requestRes.error;
  if (loadError) {
    console.error("[me] load error:", pledgeRes.error, requestRes.error);
  }

  return (
    <>
      <PageIntro
        kicker={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle", { email: user.email ?? "" })}
      />

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-8">
          <div className="text-sm text-muted-foreground">
            <span className="editorial-kicker text-muted-foreground">
              {t("signedInAs")}
            </span>
            <span className="ml-2 text-serif-italic text-foreground">
              {user.email}
            </span>
          </div>
          <form action={signOutMe.bind(null, locale)}>
            <Button type="submit" variant="outline" size="sm">
              {t("signOut")}
            </Button>
          </form>
        </div>

        {loadError ? (
          <div className="mt-8 rounded-sm border border-destructive/30 bg-destructive/5 p-4 text-sm">
            {t("loadError")}
          </div>
        ) : null}

        {/* Pledges (Founders Circle) */}
        <div className="mt-16">
          <div className="grid gap-8 md:grid-cols-12">
            <Reveal className="md:col-span-3">
              <div className="editorial-kicker text-muted-foreground">
                {t("pledgesKicker")}
              </div>
              <h2 className="text-display mt-3 text-balance text-2xl leading-tight sm:text-3xl">
                {t("pledgesTitle")}
              </h2>
            </Reveal>
            <div className="md:col-span-9">
              {pledges.length > 0 ? (
                <ul className="border-t border-border/70">
                  {pledges.map((p) => (
                    <Reveal key={p.id}>
                      <li className="grid items-baseline gap-4 border-b border-border/60 py-5 md:grid-cols-[10rem_1fr_auto]">
                        <span className="num-lockup nums-tabular text-2xl text-foreground">
                          {formatDate(p.created_at, locale).split(",")[0]}
                        </span>
                        <span className="text-pretty text-base text-foreground/85 sm:text-lg">
                          <span className="text-serif-italic">{p.name}</span>
                          {p.species_code ? ` · ${p.species_code}` : ""}
                        </span>
                        <span className="editorial-kicker text-primary">
                          {t(`statuses.pledge.${p.status}`)}
                        </span>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              ) : (
                <p className="text-pretty text-base text-muted-foreground">
                  <span className="text-serif-italic">{t("noPledges")}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tree requests */}
        <div className="mt-20">
          <div className="grid gap-8 md:grid-cols-12">
            <Reveal className="md:col-span-3">
              <div className="editorial-kicker text-muted-foreground">
                {t("requestsKicker")}
              </div>
              <h2 className="text-display mt-3 text-balance text-2xl leading-tight sm:text-3xl">
                {t("requestsTitle")}
              </h2>
            </Reveal>
            <div className="md:col-span-9">
              {requests.length > 0 ? (
                <ul className="border-t border-border/70">
                  {requests.map((r) => (
                    <Reveal key={r.id}>
                      <li className="grid items-baseline gap-4 border-b border-border/60 py-5 md:grid-cols-[10rem_1fr_auto]">
                        <span className="num-lockup nums-tabular text-2xl text-foreground">
                          {formatDate(r.created_at, locale).split(",")[0]}
                        </span>
                        <span className="text-pretty text-base text-foreground/85 sm:text-lg">
                          <span className="text-serif-italic">
                            {r.species_code}
                          </span>{" "}
                          ×{r.quantity}
                          {r.dedication ? ` · ${r.dedication}` : ""}
                        </span>
                        <span className="editorial-kicker text-primary">
                          {t(`statuses.tree.${r.status}`)}
                        </span>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              ) : (
                <p className="text-pretty text-base text-muted-foreground">
                  <span className="text-serif-italic">{t("noRequests")}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
