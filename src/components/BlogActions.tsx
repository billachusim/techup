import { useEffect, useState } from "react";
import { Heart, Share2, Link as LinkIcon, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BlogActionsProps {
  slug: string;
  title: string;
  description: string;
}

const getVisitorId = (): string => {
  const key = "tf_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
};

const BlogActions = ({ slug, title, description }: BlogActionsProps) => {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  const url = `https://techfaculty.ng/blog/${slug}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const visitorId = getVisitorId();
      const { count: c } = await supabase
        .from("blog_post_likes")
        .select("*", { count: "exact", head: true })
        .eq("post_slug", slug);
      if (!cancelled && typeof c === "number") setCount(c);

      const { data } = await supabase
        .from("blog_post_likes")
        .select("id")
        .eq("post_slug", slug)
        .eq("visitor_id", visitorId)
        .maybeSingle();
      if (!cancelled) setLiked(!!data);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const toggleLike = async () => {
    if (busy) return;
    setBusy(true);
    const visitorId = getVisitorId();
    const { data: userRes } = await supabase.auth.getUser();
    const userId = userRes.user?.id ?? null;

    if (liked) {
      setLiked(false);
      setCount((c) => Math.max(0, c - 1));
      const { error } = await supabase
        .from("blog_post_likes")
        .delete()
        .eq("post_slug", slug)
        .eq("visitor_id", visitorId);
      if (error) {
        setLiked(true);
        setCount((c) => c + 1);
        toast.error("Couldn't remove like");
      }
    } else {
      setLiked(true);
      setCount((c) => c + 1);
      const { error } = await supabase.from("blog_post_likes").insert({
        post_slug: slug,
        visitor_id: visitorId,
        user_id: userId,
      });
      if (error) {
        setLiked(false);
        setCount((c) => Math.max(0, c - 1));
        if (!error.message.toLowerCase().includes("duplicate")) {
          toast.error("Couldn't save like");
        }
      }
    }
    setBusy(false);
  };

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title, text: description, url });
        return true;
      } catch {
        return true; // user cancelled
      }
    }
    return false;
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${title}\n${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const handleShareClick = async () => {
    const used = await nativeShare();
    if (!used) {
      // fallback handled by DropdownMenu below
    }
  };

  const hasNativeShare =
    typeof navigator !== "undefined" && !!(navigator as any).share;

  return (
    <div className="flex items-center gap-2 my-6">
      <Button
        variant={liked ? "default" : "outline"}
        size="sm"
        onClick={toggleLike}
        disabled={busy}
        aria-pressed={liked}
        aria-label={liked ? "Unlike article" : "Like article"}
      >
        <Heart
          size={16}
          className="mr-1.5"
          fill={liked ? "currentColor" : "none"}
        />
        {liked ? "Liked" : "Like"}
        {count > 0 && (
          <span className="ml-1.5 text-xs opacity-80">{count}</span>
        )}
      </Button>

      {hasNativeShare ? (
        <Button variant="outline" size="sm" onClick={handleShareClick}>
          <Share2 size={16} className="mr-1.5" /> Share
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Share2 size={16} className="mr-1.5" /> Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={shareWhatsApp}>
              <MessageCircle size={16} className="mr-2" /> Share on WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem onClick={copyLink}>
              <LinkIcon size={16} className="mr-2" /> Copy link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default BlogActions;