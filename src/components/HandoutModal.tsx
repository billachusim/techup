import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, FileText, Loader2, Lock, Pencil, PlayCircle, BookOpen, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ClassVideoPlayer, type ClassVideo } from "@/components/ClassVideoPlayer";

export interface ClassPack {
  classNumber: number;
  courseName: string;
  title: string;
  summary: string | null;
  description: string | null;
  durationMinutes: number;
  handoutContent: string | null;
  task: string | null;
  videos: ClassVideo[];
  reading: ClassVideo[];
  submissions?: { title: string; proofUrl: string | null; status: string; score: number | null; note: string | null; createdAt: string }[];
}

const STATUS: Record<string, string> = { submitted: "Awaiting review", reviewed: "Accepted", needs_changes: "Needs changes" };

interface HandoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pack: ClassPack | null;
  loading?: boolean;
  locked?: boolean;
  scheduledAt?: string | null;
  isCurrent?: boolean;
  startVideo?: number;
  onSubmitTask?: () => void;
}

const stripMd = (s: string) => s.replace(/[#*`>_]/g, "").replace(/\[(.*?)\]\((.*?)\)/g, "$1 ($2)");

export const HandoutModal = ({ open, onOpenChange, pack, loading, locked, scheduledAt, isCurrent, startVideo = 0, onSubmitTask }: HandoutModalProps) => {
  const when = scheduledAt ? new Date(scheduledAt) : null;

  const generatePDF = async () => {
    if (!pack) return;
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const margin = 18;
    const width = doc.internal.pageSize.getWidth() - margin * 2;
    let y = 20;
    const write = (text: string, size = 11, gap = 6) => {
      doc.setFontSize(size);
      for (const line of doc.splitTextToSize(text, width) as string[]) {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(line, margin, y);
        y += gap;
      }
    };
    write(`Tech Faculty NG · ${pack.courseName}`, 10);
    write(`Class ${pack.classNumber}: ${pack.title}`, 17, 8);
    if (when) write(`${when.toDateString()} · ${when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · ${pack.durationMinutes} minutes`, 10);
    y += 4;
    if (pack.description) { write("Overview", 13, 7); write(stripMd(pack.description)); y += 4; }
    if (pack.videos.length) { write("Class videos", 13, 7); pack.videos.forEach((v) => write(`• ${v.title}: ${v.url}`, 10)); y += 4; }
    if (pack.task) { write("Your task", 13, 7); write(pack.task); y += 4; }
    if (pack.handoutContent) { write("Class notes", 13, 7); write(stripMd(pack.handoutContent)); y += 4; }
    if (pack.reading.length) { write("Further reading", 13, 7); pack.reading.forEach((r) => write(`• ${r.title}: ${r.url}`, 10)); }
    doc.save(`${pack.courseName}-Class-${pack.classNumber}-Handout.pdf`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[96vw] max-h-[92vh] overflow-y-auto p-4 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
            <DialogTitle className="sr-only">Loading class handout</DialogTitle>
            <Loader2 className="h-5 w-5 animate-spin" />Loading your class…
          </div>
        ) : locked || !pack ? (
          <div className="py-12 text-center space-y-2">
            <Lock className="mx-auto h-8 w-8 text-muted-foreground" />
            <DialogTitle>This class is locked</DialogTitle>
            <DialogDescription>It opens when the task for the class before it passes.</DialogDescription>
          </div>
        ) : (
          <div className="space-y-6">
            <DialogHeader className="space-y-2 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">Class {pack.classNumber}</Badge>
                {isCurrent ? <Badge>Current class</Badge> : <Badge variant="secondary">Completed</Badge>}
              </div>
              <DialogTitle className="text-xl sm:text-2xl leading-tight">{pack.title}</DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{pack.courseName}</span>
                {when && isCurrent && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {when.toDateString()}, {when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {pack.durationMinutes} min
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            {pack.videos.length > 0 && (
              <section className="space-y-3">
                <h3 className="flex items-center gap-2 font-semibold"><PlayCircle className="h-5 w-5 text-primary" />Class videos</h3>
                <ClassVideoPlayer videos={pack.videos} startIndex={startVideo} />
              </section>
            )}

            {(pack.description || pack.summary) && (
              <section className="space-y-2">
                <h3 className="flex items-center gap-2 font-semibold"><BookOpen className="h-5 w-5 text-primary" />Overview</h3>
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{pack.description || pack.summary}</p>
              </section>
            )}

            {pack.task && (
              <section className="space-y-2 rounded-lg border border-primary/40 bg-primary/5 p-4">
                <h3 className="flex items-center gap-2 font-semibold"><Pencil className="h-5 w-5 text-primary" />Your task</h3>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{pack.task}</p>
                {isCurrent && onSubmitTask && (
                  <Button size="sm" onClick={onSubmitTask} className="mt-1">Submit your work</Button>
                )}
              </section>
            )}

            {(pack.submissions?.length ?? 0) > 0 && (
              <section className="space-y-2">
                <h3 className="font-semibold">Your submission{pack.submissions!.length > 1 ? "s" : ""}</h3>
                <ul className="space-y-2">
                  {pack.submissions!.map((w) => (
                    <li key={w.createdAt} className="rounded-lg border border-border p-3 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-medium break-words">{w.title}</span>
                        <Badge variant={w.status === "reviewed" ? "default" : "outline"}>
                          {STATUS[w.status] ?? w.status}{w.score != null ? ` · ${w.score}%` : ""}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(w.createdAt).toLocaleDateString()}</p>
                      {w.proofUrl && (
                        <a href={w.proofUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-link hover:underline break-all">
                          <ExternalLink className="h-3.5 w-3.5 shrink-0" />View your work
                        </a>
                      )}
                      {w.note && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{w.note}</p>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {pack.handoutContent && (
              <section className="space-y-2">
                <h3 className="flex items-center gap-2 font-semibold"><FileText className="h-5 w-5 text-primary" />Class notes</h3>
                <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-headings:font-semibold prose-h1:text-lg prose-h2:text-base prose-h3:text-sm text-foreground">
                  <ReactMarkdown>{pack.handoutContent}</ReactMarkdown>
                </div>
              </section>
            )}

            {pack.reading.length > 0 && (
              <section className="space-y-2">
                <h3 className="font-semibold">Further reading</h3>
                <ul className="space-y-1.5">
                  {pack.reading.map((r) => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-link hover:underline break-words">
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />{r.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {!pack.videos.length && !pack.handoutContent && !pack.task && (
              <p className="text-sm text-muted-foreground">The notes for this class are being prepared. Check back soon.</p>
            )}

            <Button onClick={generatePDF} className="w-full" variant="outline">
              <Download className="mr-2 h-4 w-4" />Download handout (PDF)
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
