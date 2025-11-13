import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type PlanKey = "free_bootcamp" | "bootcamp_starter" | "developer_pro" | "data_wizard" | "security_shield" | "ai_innovator" | "cloud_architect" | "design_master" | "digital_marketing_pro";

const planMapping: Record<string, PlanKey> = {
  "Free Bootcamp": "bootcamp_starter",
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

    const planName = enrollment?.plan_name ?? "Bootcamp Starter";
    const dbPlan: PlanKey = planMapping[planName] || "bootcamp_starter";

    // Map plans to their departments
    const planDepartments: Record<PlanKey, string> = {
      "free_bootcamp": "General Tech",
      "bootcamp_starter": "General Tech",
      "developer_pro": "Developer Pro",
      "data_wizard": "Data Wizard",
      "security_shield": "Security Shield",
      "ai_innovator": "AI Innovator",
      "cloud_architect": "Cloud Architect",
      "design_master": "Design Master",
      "digital_marketing_pro": "Digital Marketing Pro"
    };

    const departmentForPlan = planDepartments[dbPlan] || "General Tech";

    // Update profile department if needed
    const { data: profile } = await admin
      .from("profiles")
      .select("id, faculty_id")
      .eq("faculty_id", facultyId)
      .maybeSingle();

    if (profile) {
      const { error: updateErr } = await admin
        .from("profiles")
        .update({ department: departmentForPlan })
        .eq("id", profile.id);
      
      if (updateErr) {
        console.error("Failed to update profile department:", updateErr);
      } else {
        console.log(`Updated profile department to: ${departmentForPlan}`);
      }
    }

    // 2) Fetch courses for this plan
    const { data: planCourses, error: coursesErr } = await admin
      .from("courses")
      .select("id, name, description, department, plan_required")
      .eq("plan_required", dbPlan);

    if (coursesErr) throw coursesErr;

    // 3) Get all current course_enrollments for this faculty
    const { data: currentEnrollments } = await admin
      .from("course_enrollments")
      .select("id, course_id, courses(plan_required)")
      .eq("faculty_id", facultyId);

    // 4) Remove course enrollments that don't belong to the current plan
    if (currentEnrollments && currentEnrollments.length > 0) {
      const enrollmentsToRemove = currentEnrollments.filter((enrollment: any) => {
        const coursePlan = enrollment.courses?.plan_required;
        return coursePlan && coursePlan !== dbPlan;
      });

      if (enrollmentsToRemove.length > 0) {
        const idsToRemove = enrollmentsToRemove.map((e: any) => e.id);
        console.log(`Removing ${idsToRemove.length} outdated course enrollments for plan switch`);
        
        const { error: deleteErr } = await admin
          .from("course_enrollments")
          .delete()
          .in("id", idsToRemove);
        
        if (deleteErr) throw deleteErr;

        // Also clean up related progress records
        const courseIdsToRemove = enrollmentsToRemove.map((e: any) => e.course_id);
        await admin
          .from("course_progress")
          .delete()
          .eq("faculty_id", facultyId)
          .in("course_id", courseIdsToRemove);
      }
    }

    // 5) Ensure course_enrollments exist for each course in the current plan
    if (planCourses && planCourses.length > 0) {
      for (const course of planCourses) {
        const { data: existing } = await admin
          .from("course_enrollments")
          .select("id")
          .eq("faculty_id", facultyId)
          .eq("course_id", course.id)
          .maybeSingle();

        if (!existing) {
          console.log(`Adding course enrollment: ${course.name}`);
          const { error: insertErr } = await admin
            .from("course_enrollments")
            .insert({ faculty_id: facultyId, course_id: course.id, status: "active" });
          if (insertErr) throw insertErr;
        }

        // Ensure lectures exist for this course
        await admin.rpc('ensure_course_lectures', { course_uuid: course.id });
      }
    }

    // 6) Return course_enrollments with nested courses only (for current plan)
    const { data: enrollments, error: enrollmentsErr } = await admin
      .from("course_enrollments")
      .select(`
        *,
        courses (*)
      `)
      .eq("faculty_id", facultyId);

    if (enrollmentsErr) throw enrollmentsErr;

    // 7) Fetch course_progress separately for this faculty
    const { data: progressRecords } = await admin
      .from("course_progress")
      .select("*")
      .eq("faculty_id", facultyId);

    // 8) Fetch lectures for all courses
    const courseIds = (enrollments || []).map((e: any) => e.course_id);
    const { data: lecturesData } = await admin
      .from("lectures")
      .select("*")
      .in("course_id", courseIds)
      .order("scheduled_at", { ascending: true });

    // 9) Manually attach progress and lectures to each enrollment
    const enrichedEnrollments = (enrollments || []).map((enrollment: any) => {
      const progress = (progressRecords || []).filter(
        (p: any) => p.course_id === enrollment.course_id
      );
      const lectures = (lecturesData || []).filter(
        (l: any) => l.course_id === enrollment.course_id
      );
      return {
        ...enrollment,
        course_progress: progress,
        lectures: lectures
      };
    });

    console.log(`Returning ${enrichedEnrollments.length} courses for plan: ${planName}`);

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