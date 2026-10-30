import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { canUseCourse, getCaller } from "../_shared/caller.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      throw new Error("Backend not configured");
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

    // Meeting links are only for students enrolled in the course (or staff).
    const caller = await getCaller(req, admin);
    if (!caller) {
      return new Response(JSON.stringify({ error: "Please sign in" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const requested = Array.isArray(body?.courses) ? body.courses : [];
    const courses = [];
    for (const c of requested) {
      const id = c?.courses?.id || c?.course_id;
      if (typeof id === "string" && (await canUseCourse(admin, caller, id))) courses.push(c);
    }

    if (courses.length === 0) {
      return new Response(
        JSON.stringify({ 
          nextClass: {
            title: "No upcoming classes",
            description: "Please enroll in a plan to see your next class.",
            date: null,
            meetingLink: null
          }
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // The next class comes from the student's own timetable (counted from when they started)
    const facultyId = caller.isStaff ? (courses[0]?.faculty_id ?? caller.facultyId) : caller.facultyId;
    const nowIso = new Date().toISOString();
    const { data: timetable, error: ttErr } = await admin.rpc("student_timetable", { _faculty_id: facultyId });
    if (ttErr) throw ttErr;
    const allowed = new Set(courses.map((c: any) => c.courses?.id || c.course_id));
    const slot = (timetable ?? []).find(
      (t: any) => allowed.has(t.course_id) && t.scheduled_at >= nowIso,
    );

    if (!slot) {
      return new Response(
        JSON.stringify({ nextClass: { title: "No upcoming classes", description: "You've reached the end of your timetable.", date: null, meetingLink: null } }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const targetCourse = courses.find((c: any) => (c.courses?.id || c.course_id) === slot.course_id) ?? courses[0];
    const { data: lec } = await admin.from("lectures").select("*").eq("id", slot.lecture_id).single();
    const nextLecture = { ...lec, scheduled_at: slot.scheduled_at };

    return new Response(
      JSON.stringify({ 
        nextClass: {
          id: nextLecture.id,
          title: nextLecture.title,
          description: nextLecture.description,
          date: nextLecture.scheduled_at,
          duration: nextLecture.duration_minutes,
          course: targetCourse.courses?.name,
          meetingLink: nextLecture.meeting_link,
          status: nextLecture.status
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-next-class function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        nextClass: {
          title: "Error loading class",
          description: "Unable to load next class. Please try again later.",
          date: null,
          meetingLink: null
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
