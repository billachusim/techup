import { useEffect, useState } from "react";
import { getSupabase } from "@/integrations/supabase/lazy";

export function useBlogLikeCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = await getSupabase();
      // Totals only; who liked what stays private.
      const { data, error } = await supabase.rpc("blog_like_counts", {});
      if (cancelled || error || !data) return;
      const tally: Record<string, number> = {};
      for (const row of data as { post_slug: string; likes: number }[]) {
        tally[row.post_slug] = Number(row.likes) || 0;
      }
      setCounts(tally);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return counts;
}
