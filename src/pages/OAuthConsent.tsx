import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type AuthOAuth = {
  getAuthorizationDetails: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: AuthorizationResult | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: AuthorizationResult | null; error: { message: string } | null }>;
};

type AuthorizationDetails = {
  client?: { name?: string; client_name?: string; redirect_uri?: string };
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
};

type AuthorizationResult = { redirect_url?: string; redirect_to?: string };

function getAuthOAuth(): AuthOAuth | null {
  const authAny = supabase.auth as unknown as { oauth?: AuthOAuth };
  return authAny.oauth ?? null;
}

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<AuthorizationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id in the URL.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      setUserEmail(sess.session.user.email ?? null);
      const oauth = getAuthOAuth();
      if (!oauth) {
        setError("OAuth authorization is not available in this build.");
        return;
      }
      const { data, error: err } = await oauth.getAuthorizationDetails(authorizationId);
      if (cancelled) return;
      if (err) return setError(err.message);
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [authorizationId]);

  const decide = async (approve: boolean) => {
    const oauth = getAuthOAuth();
    if (!oauth) return;
    setBusy(true);
    const { data, error: err } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("Authorization completed but no redirect URL was returned.");
      return;
    }
    window.location.href = target;
  };

  const clientName = details?.client?.name ?? details?.client?.client_name ?? "an application";
  const scopes = (details?.scope ?? "").split(/\s+/).filter(Boolean);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-8 shadow-sm">
        {error ? (
          <>
            <h1 className="text-xl font-bold text-foreground">Authorization error</h1>
            <p className="text-sm text-muted-foreground">{error}</p>
          </>
        ) : !details ? (
          <p className="text-sm text-muted-foreground text-center">Loading authorization request…</p>
        ) : (
          <>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-foreground">Connect {clientName} to Tech Faculty</h1>
              <p className="text-sm text-muted-foreground">
                This lets <strong>{clientName}</strong> use Tech Faculty as you{userEmail ? ` (${userEmail})` : ""}.
                It can call Tech Faculty's tools while you are signed in. This does not bypass row-level security or backend policies.
              </p>
            </div>

            {scopes.length > 0 && (
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">Requested access</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {scopes.map((s) => (
                    <li key={s}>
                      {s === "openid" && "Verify your identity"}
                      {s === "email" && "Share your email address"}
                      {s === "profile" && "Share your basic profile"}
                      {!["openid", "email", "profile"].includes(s) && `Additional permission: ${s}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <Button onClick={() => decide(true)} disabled={busy} className="w-full">
                {busy ? "Working…" : `Approve and connect ${clientName}`}
              </Button>
              <Button onClick={() => decide(false)} disabled={busy} variant="outline" className="w-full">
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default OAuthConsent;