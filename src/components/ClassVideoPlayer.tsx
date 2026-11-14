import { useEffect, useState } from "react";
import { ExternalLink, PlayCircle, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { embedUrl } from "@/lib/class-access";

export interface ClassVideo {
  type: string;
  title: string;
  url: string;
}

const label = (v: ClassVideo) => (v.type === "drive" ? "Class recording" : v.type === "youtube" ? "YouTube guide" : "Video");

/** One player for a class's videos, with a list to switch between them. */
export const ClassVideoPlayer = ({ videos, startIndex = 0 }: { videos: ClassVideo[]; startIndex?: number }) => {
  const [index, setIndex] = useState(startIndex);
  useEffect(() => setIndex(startIndex), [startIndex, videos]);
  if (!videos.length) return null;
  const current = videos[Math.min(index, videos.length - 1)];
  const src = embedUrl(current.url);
  return (
    <div className="space-y-3">
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
        {src ? (
          <iframe
            key={src}
            src={src}
            title={current.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
            This video opens outside the site.
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium break-words flex-1 min-w-0">{current.title}</p>
        <Button asChild size="sm" variant="outline">
          <a href={current.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            {current.type === "drive" ? "Open in Google Drive" : current.type === "youtube" ? "Open in YouTube" : "Open video"}
          </a>
        </Button>
      </div>
      {current.type === "drive" && (
        <p className="text-xs text-muted-foreground">
          Class recordings play when you are signed in to Google with the email you registered with.
        </p>
      )}
      {videos.length > 1 && (
        <ul className="space-y-1.5">
          {videos.map((v, i) => (
            <li key={v.url}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className={`flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm min-h-[44px] transition-colors ${
                  i === index ? "border-primary bg-primary/10" : "border-border hover:bg-accent"
                }`}
              >
                {v.type === "youtube" ? <Youtube className="h-4 w-4 shrink-0 text-primary" /> : <PlayCircle className="h-4 w-4 shrink-0 text-primary" />}
                <span className="flex-1 min-w-0 break-words">{v.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{label(v)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
