import { useEffect, useState } from "react";
import { getSupabase, mightHaveSession } from "@/integrations/supabase/lazy";

/**
 * Server-enforced staff check. The user_roles policies only ever return the
 * signed-in user's own rows, so this cannot be spoofed from the client — and
 * every write is guarded again by RLS on the server.
 */
export function useIsStaff() {
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const notStaff = () => {
        if (active) { setIsStaff(false); setIsAdmin(false); setLoading(false); }
      };
      // Signed-out visitors can't be staff, so skip loading the client for them.
      if (!mightHaveSession()) return notStaff();
      const supabase = await getSupabase();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return notStaff();
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", auth.user.id);
      if (!active) return;
      const roles = (data ?? []).map((r) => r.role);
      setIsAdmin(roles.includes("admin"));
      setIsStaff(roles.includes("admin") || roles.includes("recruiter"));
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  return { loading, isStaff, isAdmin };
}
