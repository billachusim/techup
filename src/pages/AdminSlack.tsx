import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminNav from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useIsStaff } from "@/hooks/useIsStaff";
import { postCommunityUpdateNow, previewSlackAnswer } from "@/lib/slack-community.functions";

export default function AdminSlack() {
  const { isAdmin } = useIsStaff();
  const preview = useServerFn(previewSlackAnswer);
  const postNow = useServerFn(postCommunityUpdateNow);
  const [q, setQ] = useState("");
  const [reply, setReply] = useState<string | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const ask = async () => {
    setBusy(true); setNote("");
    try { setReply((await preview({ data: { question: q } })).reply); }
    catch (e) { setNote((e as Error).message); }
    finally { setBusy(false); }
  };
  const post = async () => {
    setBusy(true);
    try { const r = await postNow(); setNote(r.posted ? "Posted to #general." : r.reason ?? "Not posted."); }
    catch (e) { setNote((e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-16 max-w-3xl space-y-6">
        <AdminNav />
        <div>
          <h1 className="text-2xl font-bold">Slack assistant</h1>
          <p className="text-sm text-muted-foreground">
            Test how Tech Faculty NG answers questions in Slack. Nothing here is posted unless you press "Post weekly update now".
          </p>
        </div>
        {!isAdmin ? <p className="text-sm text-muted-foreground">Admins only.</p> : (
          <>
            <Card><CardContent className="space-y-3 p-4">
              <Textarea value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. How do I apply for the sales rep role?" rows={3} />
              <Button onClick={ask} disabled={busy || !q.trim()}>
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Preview answer
              </Button>
              {reply !== undefined && (
                <div className="rounded-md border bg-muted/40 p-3 text-sm whitespace-pre-wrap">
                  {reply ?? "The assistant would stay quiet (not a question)."}
                </div>
              )}
            </CardContent></Card>
            <Card><CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <p className="text-sm">Weekly update posts to #general every Monday at 8:00 (Lagos).</p>
              <Button variant="outline" onClick={post} disabled={busy}>Post weekly update now</Button>
            </CardContent></Card>
            {note && <p className="text-sm text-muted-foreground">{note}</p>}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
