import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to retry API calls
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      // If not ok but not a connection error, don't retry
      if (response.status !== 503 && response.status !== 502) {
        return response;
      }
      
      console.log(`Attempt ${i + 1} failed with status ${response.status}, retrying...`);
      
      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error("Max retries reached");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { classTitle, courseName, classNumber } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ 
          error: "API key not configured",
          description: `Welcome to ${classTitle}! In this class, you'll learn essential ${courseName} concepts and practical skills that will help advance your career in technology.`,
          resources: [],
          handoutContent: `# ${classTitle}\n\nThis is class ${classNumber} of 4 in the ${courseName} course.\n\n## Overview\nHandout content will be available soon. Please check back later or contact your instructor for more information.`
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate class description with retry logic
    const descriptionPrompt = `Generate a comprehensive and engaging 2-3 paragraph description for a bootcamp class titled "${classTitle}" in the ${courseName} course. This is class ${classNumber} of 4. Make it practical, motivating, and explain what students will learn and why it matters for their career.`;

    let description = "";
    try {
      const descriptionResponse = await fetchWithRetry("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are a helpful bootcamp course assistant. Generate engaging, practical content for tech bootcamp classes." },
            { role: "user", content: descriptionPrompt }
          ],
        }),
      });

      if (!descriptionResponse.ok) {
        const errorText = await descriptionResponse.text();
        console.error("AI description error:", descriptionResponse.status, errorText);
        throw new Error(`AI API returned ${descriptionResponse.status}`);
      }

      const descriptionData = await descriptionResponse.json();
      description = descriptionData.choices[0].message.content;
    } catch (error) {
      console.error("Failed to generate description:", error);
      description = `Welcome to ${classTitle}! In this ${courseName} class (${classNumber} of 4), you'll explore key concepts and develop practical skills essential for your technology career. This hands-on session combines theory with real-world applications, preparing you for professional challenges in the field.`;
    }

    // Generate resources with tool calling for structured output
    const resourcesPrompt = `Generate 3-4 high-quality learning resources for "${classTitle}" in ${courseName}. Include a mix of YouTube videos, documentation, and articles.`;

    let resources = [];
    try {
      const resourcesResponse = await fetchWithRetry("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are a helpful bootcamp course assistant." },
            { role: "user", content: resourcesPrompt }
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "generate_resources",
                description: "Generate learning resources for a class",
                parameters: {
                  type: "object",
                  properties: {
                    resources: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          type: { type: "string", enum: ["youtube", "website", "documentation"] },
                          title: { type: "string" },
                          url: { type: "string" }
                        },
                        required: ["type", "title", "url"],
                        additionalProperties: false
                      }
                    }
                  },
                  required: ["resources"],
                  additionalProperties: false
                }
              }
            }
          ],
          tool_choice: { type: "function", function: { name: "generate_resources" } }
        }),
      });

      if (!resourcesResponse.ok) {
        const errorText = await resourcesResponse.text();
        console.error("AI resources error:", resourcesResponse.status, errorText);
        throw new Error(`AI API returned ${resourcesResponse.status}`);
      }

      const resourcesData = await resourcesResponse.json();
      const toolCall = resourcesData.choices[0].message.tool_calls[0];
      resources = JSON.parse(toolCall.function.arguments).resources;
    } catch (error) {
      console.error("Failed to generate resources:", error);
      resources = [
        { type: "documentation", title: `${courseName} Official Documentation`, url: "https://docs.lovable.dev" },
        { type: "website", title: "Learn More", url: "https://lovable.dev" }
      ];
    }

    // Generate handout content
    const handoutPrompt = `Create a comprehensive class handout for "${classTitle}" in ${courseName}. Include:
    
1. Overview (what this class covers)
2. Key Concepts (3-4 main topics with brief explanations)
3. Learning Objectives (what students will be able to do)
4. Practical Tips (3-5 actionable tips)
5. What's Next (preparation for the next class)

Format it in a clear, structured way with headers and bullet points. Make it practical and actionable.`;

    let handoutContent = "";
    try {
      const handoutResponse = await fetchWithRetry("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are a helpful bootcamp course assistant. Generate comprehensive, well-structured handout content." },
            { role: "user", content: handoutPrompt }
          ],
        }),
      });

      if (!handoutResponse.ok) {
        const errorText = await handoutResponse.text();
        console.error("AI handout error:", handoutResponse.status, errorText);
        throw new Error(`AI API returned ${handoutResponse.status}`);
      }

      const handoutData = await handoutResponse.json();
      handoutContent = handoutData.choices[0].message.content;
    } catch (error) {
      console.error("Failed to generate handout:", error);
      handoutContent = `# ${classTitle}

## Overview
This is class ${classNumber} of 4 in the ${courseName} course. Handout content will be generated shortly.

## Key Concepts
Content coming soon.

## Learning Objectives
- Understand core concepts
- Apply practical skills
- Build real-world projects

## Practical Tips
1. Practice regularly
2. Ask questions
3. Build projects
4. Collaborate with peers

## What's Next
Prepare for the next class by reviewing today's materials and completing any assigned exercises.`;
    }

    return new Response(
      JSON.stringify({ 
        description,
        resources,
        handoutContent
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-class-content function:", error);
    // Even on error, try to provide useful fallback content
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        description: "Welcome to this class! We'll cover important concepts and practical skills. This bootcamp session will help you develop the knowledge and abilities needed for your technology career.",
        resources: [
          { type: "documentation", title: "Course Documentation", url: "https://docs.lovable.dev" },
          { type: "website", title: "Additional Resources", url: "https://lovable.dev" }
        ],
        handoutContent: `# Class Handout

## Overview
Welcome to this bootcamp class! This session covers essential concepts and practical applications.

## Key Topics
- Core fundamentals
- Hands-on practice
- Real-world applications

## Learning Objectives
- Understand key concepts
- Apply practical skills
- Build confidence in the subject matter

## Tips for Success
1. Stay engaged during class
2. Practice regularly
3. Ask questions
4. Collaborate with peers
5. Review materials after class

## Next Steps
Continue learning and building on today's foundations. Prepare for upcoming classes by reviewing materials and completing any assignments.`
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
