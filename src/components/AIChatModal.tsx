import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, LogIn } from "lucide-react";
import { getSupabase } from "@/integrations/supabase/lazy";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Keeps the conversation across the sign-in round trip (same browser tab).
const STORAGE_KEY = "faculty-ai-chat";

export const AIChatModal = ({ open, onOpenChange }: AIChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Visitors who aren't signed in get one free reply, then sign in to continue.
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [blockedBySignIn, setBlockedBySignIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved) as Message[]);
    } catch {
      /* ignore unreadable saved chat */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
    } catch {
      /* storage full or blocked */
    }
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    (async () => {
      const supabase = await getSupabase();
      const { data } = await supabase.auth.getSession();
      if (!cancelled) setSignedIn(!!data.session);
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!cancelled) setSignedIn(!!session);
      });
      unsubscribe = () => sub.subscription.unsubscribe();
    })();
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [open]);

  const usedFreeReply = messages.some((m) => m.role === "assistant");
  const needsSignIn = signedIn === false && (usedFreeReply || blockedBySignIn);

  const handleSend = async () => {
    if (!input.trim() || isLoading || needsSignIn || signedIn === null) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.functions.invoke("faculty-ai-chat", {
        body: { message: userMessage, conversationHistory: messages }
      });

      if (error) {
        const status = (error as { context?: { status?: number } }).context?.status;
        if (status === 401) {
          setBlockedBySignIn(true);
          return;
        }
        throw error;
      }

      if (data?.response) {
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch (error) {
      console.error("Error calling AI:", error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Talk to Faculty AI</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p className="mb-2">Hi! I'm Faculty AI 👋</p>
              <p className="text-sm">Tell me about your interests, goals, or what you'd like to learn, and I'll recommend the best courses for you!</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          {needsSignIn && !isLoading && (
            <div className="rounded-lg border bg-card p-4 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Want to keep chatting? Sign in for free (a few seconds with Google) and pick up right where you left off.
              </p>
              <Button asChild>
                <a href="/login?next=/">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign in to continue
                </a>
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={needsSignIn ? "Sign in to keep chatting..." : "Tell me about yourself and what you want to learn..."}
            className="min-h-[60px] resize-none"
            disabled={isLoading || needsSignIn}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || needsSignIn || signedIn === null}
            size="icon"
            className="h-[60px] w-[60px] shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
