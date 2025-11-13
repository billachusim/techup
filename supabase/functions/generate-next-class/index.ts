import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { courses, facultyId } = await req.json();
    
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      throw new Error("Backend not configured");
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

    if (!courses || courses.length === 0) {
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

    // Find the course with the least progress
    let targetCourse = courses[0];
    let minProgress = courses[0]?.course_progress?.[0]?.classes_completed || 0;

    for (const course of courses) {
      const progress = course.course_progress?.[0]?.classes_completed || 0;
      if (progress < minProgress) {
        minProgress = progress;
        targetCourse = course;
      }
    }

    const courseId = targetCourse.courses?.id || targetCourse.course_id;
    
    // Get saved lectures for this course
    const { data: lectures, error: lecturesErr } = await admin
      .from("lectures")
      .select("*")
      .eq("course_id", courseId)
      .eq("status", "scheduled")
      .order("scheduled_at", { ascending: true })
      .limit(1);

    if (lecturesErr) throw lecturesErr;

    if (!lectures || lectures.length === 0) {
      // No lectures found, ensure they're created
      await admin.rpc('ensure_course_lectures', { course_uuid: courseId });
      
      // Fetch again
      const { data: newLectures } = await admin
        .from("lectures")
        .select("*")
        .eq("course_id", courseId)
        .eq("status", "scheduled")
        .order("scheduled_at", { ascending: true })
        .limit(1);

      if (!newLectures || newLectures.length === 0) {
        throw new Error("Failed to create lectures");
      }

      const nextLecture = newLectures[0];
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
    }

    const nextLecture = lectures[0];

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
