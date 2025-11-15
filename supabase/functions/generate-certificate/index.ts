import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { facultyId, courseId } = await req.json();

    if (!facultyId || !courseId) {
      return new Response(
        JSON.stringify({ error: "Missing facultyId or courseId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if certificate already exists
    const { data: existingCert } = await supabase
      .from('certificates')
      .select('*')
      .eq('faculty_id', facultyId)
      .eq('course_id', courseId)
      .single();

    if (existingCert) {
      return new Response(
        JSON.stringify({ 
          certificate: existingCert,
          message: "Certificate already exists" 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify course completion (100% progress)
    const { data: progress } = await supabase
      .from('course_progress')
      .select('progress_percentage')
      .eq('faculty_id', facultyId)
      .eq('course_id', courseId)
      .single();

    if (!progress || progress.progress_percentage < 100) {
      return new Response(
        JSON.stringify({ error: "Course not completed yet" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get course and user details
    const { data: course } = await supabase
      .from('courses')
      .select('name')
      .eq('id', courseId)
      .single();

    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('faculty_id', facultyId)
      .single();

    if (!course || !profile) {
      return new Response(
        JSON.stringify({ error: "Course or profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate certificate number
    const certNumber = `TF-CERT-${Date.now()}-${facultyId.split('-')[1]}`;

    // Create certificate record
    const { data: certificate, error: certError } = await supabase
      .from('certificates')
      .insert({
        faculty_id: facultyId,
        course_id: courseId,
        course_name: course.name,
        certificate_number: certNumber
      })
      .select()
      .single();

    if (certError) {
      console.error("Certificate creation error:", certError);
      return new Response(
        JSON.stringify({ error: "Failed to create certificate" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Certificate generated for ${facultyId}, course ${courseId}`);

    return new Response(
      JSON.stringify({ 
        certificate,
        studentName: profile.name,
        courseName: course.name
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-certificate:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});