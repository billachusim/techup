import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Only signed-in admins may add certificates.
    const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? "";
    const { data: auth } = token ? await supabase.auth.getUser(token) : { data: { user: null } };
    if (!auth.user) {
      return new Response(JSON.stringify({ error: "Please sign in with an admin account" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", auth.user.id)
      .eq("role", "admin");
    if (!roles || roles.length === 0) {
      return new Response(JSON.stringify({ error: "Admins only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const {
      certificateNumber,
      studentName,
      courseName,
      certificateType,
      issuedBy,
      dateIssued,
      facultyId,
    } = body ?? {};

    if (!certificateNumber || !studentName || !courseName || !dateIssued) {
      return new Response(
        JSON.stringify({ error: "certificateNumber, studentName, courseName, and dateIssued are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const normalizedNumber = String(certificateNumber).trim().toUpperCase();

    const { data: existing } = await supabase
      .from("certificates")
      .select("id")
      .eq("certificate_number", normalizedNumber)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ error: `Certificate ${normalizedNumber} already exists` }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data, error } = await supabase
      .from("certificates")
      .insert({
        certificate_number: normalizedNumber,
        student_name: String(studentName).trim(),
        course_name: String(courseName).trim(),
        certificate_type: certificateType?.trim() || "Certificate of Achievement",
        issued_by: issuedBy?.trim() || "Tech Faculty NG",
        date_issued: String(dateIssued).trim(),
        faculty_id: facultyId?.trim() || `TF-MANUAL-${Date.now()}`,
      })
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ certificate: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});