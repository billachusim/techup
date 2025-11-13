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
    const { courses } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!courses || courses.length === 0) {
      return new Response(
        JSON.stringify({ 
          nextClass: {
            title: "No upcoming classes",
            description: "Please enroll in a plan to see your next class.",
            date: null
          }
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Filter to find incomplete courses (less than 4 classes completed)
    const incompleteCourses = courses.filter((c: any) => {
      const classesCompleted = c.course_progress?.[0]?.classes_completed || 0;
      return classesCompleted < 4;
    });

    // Use incomplete courses if available, otherwise use all courses
    const coursesToConsider = incompleteCourses.length > 0 ? incompleteCourses : courses;

    const courseList = coursesToConsider.map((c: any) => {
      const classesCompleted = c.courses?.course_progress?.[0]?.classes_completed || 0;
      return `- ${c.courses?.name}: ${c.courses?.description} [Progress: ${classesCompleted}/4 classes]`;
    }).join("\n");
    
    const prompt = `Based on these courses (prioritize those with fewer completed classes):
${courseList}

Generate a detailed next class/lecture for the course that needs it most. The class should be relevant, engaging, and build upon foundational concepts.`;

    console.log("Calling Lovable AI with structured output");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: "You are a curriculum assistant. Generate realistic and engaging lecture details with comprehensive resources and handouts." 
          },
          { role: "user", content: prompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_next_class",
              description: "Generate a detailed next class for a bootcamp course",
              parameters: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "Specific, engaging lecture title"
                  },
                  description: {
                    type: "string",
                    description: "Detailed 2-3 sentence description of what will be covered"
                  },
                  date: {
                    type: "string",
                    description: "Date in format YYYY-MM-DD within next 7 days from today"
                  },
                  duration: {
                    type: "string",
                    description: "Duration in minutes (default 90)"
                  },
                  course: {
                    type: "string",
                    description: "Name of the course this lecture belongs to"
                  },
                  classNumber: {
                    type: "number",
                    description: "The class number (1-4) based on current progress + 1"
                  },
                  resources: {
                    type: "array",
                    description: "Array of 3-5 educational resources",
                    items: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["youtube", "website", "article", "documentation"]
                        },
                        title: {
                          type: "string"
                        },
                        url: {
                          type: "string"
                        }
                      },
                      required: ["type", "title", "url"]
                    }
                  },
                  handoutContent: {
                    type: "string",
                    description: "A detailed 2-page summary in markdown format with sections for: Overview, Key Concepts, Learning Objectives, Practical Exercises, and Key Takeaways"
                  }
                },
                required: ["title", "description", "date", "duration", "course", "classNumber", "resources", "handoutContent"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_next_class" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    console.log("AI Response:", JSON.stringify(data, null, 2));

    if (!toolCall || !toolCall.function?.arguments) {
      throw new Error("No tool call in AI response");
    }

    // Parse the structured output from tool calling
    const nextClass = JSON.parse(toolCall.function.arguments);
    
    console.log("Parsed next class:", JSON.stringify(nextClass, null, 2));

    return new Response(
      JSON.stringify({ nextClass }),
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
          title: "Error generating class",
          description: "Unable to generate next class. Please try again later.",
          date: null
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
