import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type PlanKey = "free_bootcamp" | "bootcamp_starter" | "developer_pro" | "data_wizard" | "security_shield" | "ai_innovator" | "cloud_architect" | "design_master" | "digital_marketing_pro";

const planMapping: Record<string, PlanKey> = {
  "Free Bootcamp": "free_bootcamp",
  "Bootcamp Starter": "bootcamp_starter",
  "Developer Pro": "developer_pro",
  "Data Wizard": "data_wizard",
  "Security Shield": "security_shield",
  "AI Innovator": "ai_innovator",
  "Cloud Architect": "cloud_architect",
  "Design Master": "design_master",
  "Digital Marketing Pro": "digital_marketing_pro",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { facultyId } = await req.json();
    if (!facultyId || typeof facultyId !== "string") {
      return new Response(JSON.stringify({ error: "facultyId is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      throw new Error("Backend not configured (missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)");
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

    // 1) Get latest enrollment for this facultyId
    const { data: enrollment, error: enrollmentErr } = await admin
      .from("enrollments")
      .select("plan_name")
      .eq("faculty_id", facultyId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (enrollmentErr) throw enrollmentErr;

    const planName = enrollment?.plan_name ?? "Free Bootcamp";
    const dbPlan: PlanKey = planMapping[planName] || "free_bootcamp";

    // 2) Fetch courses for this plan
    const { data: planCourses, error: coursesErr } = await admin
      .from("courses")
      .select("id, name, description, department, plan_required")
      .eq("plan_required", dbPlan);

    if (coursesErr) throw coursesErr;

    // 3) Ensure course_enrollments exist for each course
    if (planCourses && planCourses.length > 0) {
      for (const course of planCourses) {
        const { data: existing } = await admin
          .from("course_enrollments")
          .select("id")
          .eq("faculty_id", facultyId)
          .eq("course_id", course.id)
          .maybeSingle();

        if (!existing) {
          const { error: insertErr } = await admin
            .from("course_enrollments")
            .insert({ faculty_id: facultyId, course_id: course.id, status: "active" });
          if (insertErr) throw insertErr;
        }
      }
    }

    // 4) Return course_enrollments with nested courses only
    const { data: enrollments, error: enrollmentsErr } = await admin
      .from("course_enrollments")
      .select(`
        *,
        courses (*)
      `)
      .eq("faculty_id", facultyId);

    if (enrollmentsErr) throw enrollmentsErr;

    // 5) Fetch course_progress separately for this faculty
    const { data: progressRecords } = await admin
      .from("course_progress")
      .select("*")
      .eq("faculty_id", facultyId);

    // 6) Manually attach progress to each enrollment
    const enrichedEnrollments = (enrollments || []).map((enrollment: any) => {
      const progress = (progressRecords || []).filter(
        (p: any) => p.course_id === enrollment.course_id
      );
      return {
        ...enrollment,
        course_progress: progress
      };
    });

    return new Response(
      JSON.stringify({ plan: planName, planKey: dbPlan, enrollments: enrichedEnrollments }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("user-courses error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});