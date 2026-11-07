import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, PlayCircle, Trash2 } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useIsStaff } from "@/hooks/useIsStaff";
import { getSupabase } from "@/integrations/supabase/lazy";
import {
  parseVideoLine,
  videoSource,
} from "../../supabase/functions/_shared/class-videos.ts";

type Course = { id: string; name: string; department: string };
type ClassVideo = {
  id: string;
  course_id: string;
  class_number: number;
  title: string;
  url: string;
  source: string;
  position: number;
};

// class_videos comes from a migration that generated types may not include yet.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LooseClient = { from: (table: string) => any };

const AdminClassVideos = () => {
  const { toast } = useToast();
  const { loading, isStaff } = useIsStaff();
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<ClassVideo[]>([]);
  const [courseId, setCourseId] = useState("");
  const [form, setForm] = useState({ classNumber: "1", title: "", url: "" });
  const [bulk, setBulk] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const supabase = (await getSupabase()) as unknown as LooseClient;
    const [{ data: c }, { data: v }] = await Promise.all([
      supabase.from("courses").select("id, name, department").order("name"),
      supabase
        .from("class_videos")
        .select("id, course_id, class_number, title, url, source, position")
        .order("class_number")
        .order("position"),
    ]);
    setCourses(c ?? []);
    setVideos(v ?? []);
    setCourseId((prev) => prev || c?.[0]?.id || "");
  }, []);

  useEffect(() => {
    if (isStaff) void load();
  }, [isStaff, load]);

  const forCourse = useMemo(
    () => videos.filter((v) => v.course_id === courseId),
    [videos, courseId],
  );

  const insert = async (
    rows: { class_number: number; title: string; url: string }[],
  ) => {
    if (!courseId || !rows.length) return;
    setBusy(true);
    const supabase = (await getSupabase()) as unknown as LooseClient;
    const payload = rows.map((r, i) => ({
      course_id: courseId,
      class_number: r.class_number,
      title: r.title,
      url: r.url,
      source: videoSource(r.url),
      position:
        forCourse.filter((v) => v.class_number === r.class_number).length + i,
    }));
    const { error } = await supabase
      .from("class_videos")
      .upsert(payload, { onConflict: "course_id,class_number,url" });
    setBusy(false);
    if (error) {
      toast({
        title: "Could not save",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: `Saved ${rows.length} video link${rows.length === 1 ? "" : "s"}`,
      description:
        "Students get them with that class on the dashboard and in Slack.",
    });
    await load();
  };

  const addOne = async (e: React.FormEvent) => {
    e.preventDefault();
    const row = parseVideoLine(
      `${form.classNumber} | ${form.title} | ${form.url}`,
    );
    if (!row) {
      toast({
        title: "Check the fields",
        description:
          "Class number 1-52, a title, and a link starting with https://",
        variant: "destructive",
      });
      return;
    }
    await insert([row]);
    setForm({ ...form, title: "", url: "" });
  };

  const addBulk = async () => {
    const lines = bulk.split("\n").filter((l) => l.trim());
    const rows = lines
      .map(parseVideoLine)
      .filter((r): r is NonNullable<typeof r> => !!r);
    if (rows.length !== lines.length) {
      toast({
        title: `${lines.length - rows.length} line(s) skipped`,
        description: "Each line must be: class number | title | link",
      });
    }
    await insert(rows);
    if (rows.length) setBulk("");
  };

  const remove = async (id: string) => {
    const supabase = (await getSupabase()) as unknown as LooseClient;
    const { error } = await supabase.from("class_videos").delete().eq("id", id);
    if (error)
      toast({
        title: "Could not remove",
        description: error.message,
        variant: "destructive",
      });
    else setVideos((v) => v.filter((x) => x.id !== id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <section className="mx-auto max-w-3xl space-y-6">
          <AdminNav />
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <PlayCircle className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Class videos</h1>
            <p className="text-muted-foreground text-sm">
              YouTube or Google Drive links saved here go out with that class
              automatically: on the student dashboard and in the Slack "next
              class" post. Add at least one real video to every class. Drive
              videos must be shared "Anyone with the link" so students can open
              them.
            </p>
          </div>

          {loading ? (
            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
          ) : !isStaff ? (
            <Card>
              <CardContent className="pt-6 text-center text-sm text-muted-foreground">
                This page is for Tech Faculty staff. Sign in with a staff
                account to manage class videos.
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <select
                    aria-label="Course"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.department})
                      </option>
                    ))}
                  </select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add a video</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form
                    onSubmit={addOne}
                    className="grid gap-4 md:grid-cols-[6rem_1fr]"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="classNumber">Class</Label>
                      <Input
                        id="classNumber"
                        type="number"
                        min={1}
                        max={52}
                        value={form.classNumber}
                        onChange={(e) =>
                          setForm({ ...form, classNumber: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="videoTitle">Title</Label>
                      <Input
                        id="videoTitle"
                        placeholder="Linux file system and permissions"
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="videoUrl">Link</Label>
                      <Input
                        id="videoUrl"
                        placeholder="https://drive.google.com/file/d/... or https://youtu.be/..."
                        value={form.url}
                        onChange={(e) =>
                          setForm({ ...form, url: e.target.value })
                        }
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={busy || !courseId}
                      className="md:col-span-2"
                    >
                      Add video
                    </Button>
                  </form>
                  <div className="space-y-2">
                    <Label htmlFor="bulk">
                      Or paste many, one per line: class number | title | link
                    </Label>
                    <Textarea
                      id="bulk"
                      rows={5}
                      placeholder={
                        "1 | Introduction to the internet | https://drive.google.com/file/d/...\n2 | HTTP and HTTPS | https://youtu.be/..."
                      }
                      value={bulk}
                      onChange={(e) => setBulk(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={busy || !bulk.trim() || !courseId}
                      onClick={addBulk}
                    >
                      Add all
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    Saved for this course ({forCourse.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {forCourse.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No videos yet. Students of this course get no class video
                      until one is added here.
                    </p>
                  ) : (
                    <ul className="divide-y">
                      {forCourse.map((v) => (
                        <li
                          key={v.id}
                          className="flex items-start justify-between gap-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium">
                              Class {v.class_number}: {v.title}
                            </p>
                            <a
                              href={v.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-link hover:underline break-all"
                            >
                              {v.url}
                            </a>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={`Remove ${v.title}`}
                            onClick={() => remove(v.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AdminClassVideos;
