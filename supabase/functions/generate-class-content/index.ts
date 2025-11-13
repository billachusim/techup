import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { classTitle, courseName, classNumber } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Generate class description
    const descriptionPrompt = `Generate a comprehensive and engaging 2-3 paragraph description for a bootcamp class titled "${classTitle}" in the ${courseName} course. This is class ${classNumber} of 4. Make it practical, motivating, and explain what students will learn and why it matters for their career.`;

    const descriptionResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
      throw new Error("Failed to generate description");
    }

    const descriptionData = await descriptionResponse.json();
    const description = descriptionData.choices[0].message.content;

    // Generate resources with tool calling for structured output
    const resourcesPrompt = `Generate 3-4 high-quality learning resources for "${classTitle}" in ${courseName}. Include a mix of YouTube videos, documentation, and articles.`;

    const resourcesResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
      throw new Error("Failed to generate resources");
    }

    const resourcesData = await resourcesResponse.json();
    const toolCall = resourcesData.choices[0].message.tool_calls[0];
    const resources = JSON.parse(toolCall.function.arguments).resources;

    // Generate handout content
    const handoutPrompt = `Create a comprehensive class handout for "${classTitle}" in ${courseName}. Include:
    
1. Overview (what this class covers)
2. Key Concepts (3-4 main topics with brief explanations)
3. Learning Objectives (what students will be able to do)
4. Practical Tips (3-5 actionable tips)
5. What's Next (preparation for the next class)

Format it in a clear, structured way with headers and bullet points. Make it practical and actionable.`;

    const handoutResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
      throw new Error("Failed to generate handout");
    }

    const handoutData = await handoutResponse.json();
    const handoutContent = handoutData.choices[0].message.content;

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
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        description: "Welcome to this class! We'll cover important concepts and practical skills.",
        resources: [],
        handoutContent: "Handout content will be available soon."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
