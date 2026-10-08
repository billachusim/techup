import { useState } from "react";
import { Loader2, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSupabase } from "@/integrations/supabase/lazy";
import { useToast } from "@/hooks/use-toast";

/**
 * Resubmits every sitemap URL to IndexNow (Bing, Yandex and others). The weekly
 * blog job pings on its own; this is for posts or pages changed by hand.
 */
export function NotifySearchEngines() {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const notify = async () => {
    setBusy(true);
    const supabase = await getSupabase();
    const { data, error } = await supabase.functions.invoke("indexnow-ping", { body: {} });
    setBusy(false);
    if (error || !data?.ok) {
      toast({
        title: "Search engines not notified",
        description: data?.error ?? error?.message ?? `IndexNow returned ${data?.status}`,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Search engines notified", description: `Sent ${data.sent} URLs to IndexNow.` });
  };

  return (
    <Card>
      <CardContent className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-semibold flex items-center gap-2">
            <Radar className="h-5 w-5 text-primary" />
            Notify search engines
          </p>
          <p className="text-sm text-muted-foreground">
            After publishing or editing a post or page by hand, send the sitemap to Bing and other IndexNow engines.
          </p>
        </div>
        <Button onClick={notify} disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Notify now
        </Button>
      </CardContent>
    </Card>
  );
}
