import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useBlogLikeCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("blog_post_likes")
        .select("post_slug");
      if (cancelled || error || !data) return;
      const tally: Record<string, number> = {};
      for (const row of data as { post_slug: string }[]) {
        tally[row.post_slug] = (tally[row.post_slug] ?? 0) + 1;
      }
      setCounts(tally);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return counts;
}