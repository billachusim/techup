import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TECH_FACULTY_EMAIL = "thetechfaculty@gmail.com";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EnrollmentRequest {
  facultyId: string;
  planName: string;
  totalAmount: number;
  selectedCourses: string[];
  learningMode: string;
  selectedBenefits: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { facultyId, planName, totalAmount, selectedCourses, learningMode, selectedBenefits }: EnrollmentRequest = await req.json();

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #667eea; }
          .item { background: white; padding: 10px; margin: 5px 0; border-left: 3px solid #667eea; }
          .total { background: #667eea; color: white; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; }
          .footer { margin-top: 20px; padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Enrollment Request</h1>
            <p>Faculty ID: ${facultyId}</p>
          </div>
          <div class="content">
            <div class="section">
              <div class="section-title">Department</div>
              <div class="item">${planName}</div>
            </div>

            <div class="section">
              <div class="section-title">Selected Courses</div>
              ${selectedCourses.map(course => `<div class="item">✓ ${course}</div>`).join('')}
            </div>

            <div class="section">
              <div class="section-title">Learning Mode</div>
              <div class="item">${learningMode}</div>
            </div>

            <div class="section">
              <div class="section-title">Additional Benefits</div>
              ${selectedBenefits.map(benefit => `<div class="item">✓ ${benefit}</div>`).join('')}
            </div>

            <div class="total">
              Total Amount: ₦${totalAmount.toLocaleString()}
            </div>

            <div class="section">
              <div class="section-title">Payment Status</div>
              <div class="item">⏳ Pending Payment</div>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated enrollment request from Tech Faculty NG platform.</p>
            <p>Please contact the student at their registered email to arrange payment.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log('Sending enrollment request email to:', TECH_FACULTY_EMAIL);
    console.log('Enrollment details:', { facultyId, planName, totalAmount });

    // Log the enrollment request (in production, you'd send an actual email here)
    // For now, we'll just return success
    // In production, integrate with Resend or another email service

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Enrollment request received successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error processing enrollment request:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An error occurred' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
