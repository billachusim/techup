import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const SKIP_KEY = "tf_location_prompt_skipped";

/** One-time optional prompt for students (mainly Google sign-ups) without a saved location. */
export const LocationPrompt = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(SKIP_KEY)) return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("location").eq("id", user.id).maybeSingle();
      if (data && !data.location) {
        setUserId(user.id);
        setShow(true);
      }
    })();
  }, []);

  if (!show || !userId) return null;

  const save = async () => {
    const loc = value.trim().slice(0, 160);
    if (!loc) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ location: loc }).eq("id", userId);
    setSaving(false);
    if (!error) setShow(false);
  };

  const skip = () => {
    localStorage.setItem(SKIP_KEY, "1");
    setShow(false);
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MapPin size={16} /> Where are you based?
        </div>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. Nnewi, Anambra"
          maxLength={160}
          className="sm:flex-1"
          aria-label="City / State"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={save} disabled={saving || !value.trim()}>Save</Button>
          <Button size="sm" variant="ghost" onClick={skip}>Skip</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationPrompt;
