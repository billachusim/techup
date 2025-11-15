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

    // Get lectures scheduled in the next 24-48 hours
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const { data: upcomingLectures, error: lecturesError } = await supabase
      .from('lectures')
      .select(`
        *,
        courses (
          name,
          whatsapp_group_link
        )
      `)
      .eq('status', 'scheduled')
      .gte('scheduled_at', tomorrow.toISOString())
      .lte('scheduled_at', dayAfter.toISOString());

    if (lecturesError) {
      console.error("Error fetching lectures:", lecturesError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch lectures" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!upcomingLectures || upcomingLectures.length === 0) {
      console.log("No upcoming lectures in the next 24 hours");
      return new Response(
        JSON.stringify({ message: "No reminders to send" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let remindersSent = 0;

    for (const lecture of upcomingLectures) {
      // Get enrolled students for this course
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select(`
          faculty_id,
          profiles!inner (
            name,
            email,
            phone
          )
        `)
        .eq('course_id', lecture.course_id)
        .eq('status', 'active');

      if (!enrollments || enrollments.length === 0) continue;

      // Log reminder (in production, you'd send actual emails/SMS here)
      for (const enrollment of enrollments) {
        const profile = enrollment.profiles;
        const scheduledTime = new Date(lecture.scheduled_at);
        
        console.log(`
          REMINDER: ${profile.name} (${profile.email})
          Class: ${lecture.title}
          Course: ${lecture.courses?.name}
          Time: ${scheduledTime.toLocaleString()}
          Meeting Link: ${lecture.meeting_link || 'TBA'}
          WhatsApp Group: ${lecture.courses?.whatsapp_group_link || 'N/A'}
        `);
        
        remindersSent++;
      }
    }

    console.log(`Sent ${remindersSent} reminders for ${upcomingLectures.length} lectures`);

    return new Response(
      JSON.stringify({ 
        message: `Sent ${remindersSent} reminders`,
        lecturesCount: upcomingLectures.length
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in send-class-reminders:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});