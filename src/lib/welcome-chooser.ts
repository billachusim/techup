// Who sees the one-time "What brings you here?" welcome after creating an account.
// New accounts only (first few days), not yet a student (no Faculty ID) and with
// no talent profile, and never on pages where they are already mid-task.

export const WELCOME_WINDOW_DAYS = 3;

const QUIET_PREFIXES = [
  "/login", "/admin", "/talent", "/hire", "/careers", "/payment-success", "/order-complete",
  "/pay-balance", "/lovable", "/.lovable", "/verify", "/r/", "/virtual-siwes", "/siwes-success-kit",
];

export function isQuietPath(path: string): boolean {
  return QUIET_PREFIXES.some((p) => path === p || path.startsWith(p.endsWith("/") ? p : `${p}/`) || path.startsWith(`${p}?`));
}

export function shouldOfferWelcome(o: {
  accountCreatedAt: string | null | undefined;
  now: Date;
  path: string;
  hasFacultyId: boolean;
  hasTalentProfile: boolean;
  dismissed: boolean;
}): boolean {
  if (o.dismissed || o.hasFacultyId || o.hasTalentProfile || !o.accountCreatedAt) return false;
  if (isQuietPath(o.path)) return false;
  const created = new Date(o.accountCreatedAt).getTime();
  if (Number.isNaN(created)) return false;
  return o.now.getTime() - created <= WELCOME_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}
