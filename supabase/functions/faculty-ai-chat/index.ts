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
    const { message, conversationHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Faculty AI, a helpful assistant for Tech Faculty — a comprehensive technology bootcamp platform. Your role is to recommend the best learning path based on users' interests, goals, background, and preferences.

## Our Departments & Plans

### 🆓 Free Foundation (Bootcamp Starter)
- Intro to Programming
- Intro to AI & ChatGPT
- Git & GitHub Basics
- Tech Career Guidance
*Online only. Free for everyone.*

### 💻 Developer Pro — Web Development (from ₦50,000)
- HTML/CSS Fundamentals
- JavaScript Mastery
- React Development
- Node.js & Backend
- Database Management
- Full-Stack Projects

### 📱 Mobile App Developer — Mobile Development (from ₦80,000)
- React Native Development
- Flutter & Dart
- iOS with Swift
- Android with Kotlin
- Mobile UI/UX Design
- Cross-Platform Projects

### ☁️ Cloud Architect — Cloud Computing & DevOps (from ₦130,000)
- AWS Fundamentals
- Azure Basics
- GCP Essentials
- Kubernetes & Docker
- CI/CD Pipelines
- Cloud Certifications

### 📊 Data Wizard — Data Science & Analytics (from ₦100,000)
- Python Programming
- SQL & Databases
- Data Visualization
- Statistical Analysis
- Machine Learning Basics
- Real-world Data Projects

### 🤖 AI Innovator — AI & Machine Learning (from ₦150,000)
- Deep Learning
- Neural Networks
- TensorFlow/PyTorch
- NLP Fundamentals
- Computer Vision
- AI Deployment

### 🔒 Security Shield — Cybersecurity & Ethical Hacking (from ₦120,000)
- Network Security
- Ethical Hacking
- SOC Operations
- Incident Response
- CompTIA Prep
- CEH Prep

### 🎨 Design Master — UI/UX Design (from ₦70,000)
- Design Principles
- Figma Mastery
- Adobe Suite
- Product Design
- Design Systems
- Portfolio Projects

### 📈 Digital Marketing Pro — Digital Marketing & Growth (from ₦60,000)
- Social Media Strategy
- Content Marketing
- SEO/SEM
- Video Editing
- Photo Editing
- Analytics & Growth

### 🛠️ Custom Program — Build Your Own Path (from ₦50,000)
Students can mix and match individual courses from any department to create a personalized learning path.

## Learning Modes
- **Online Only** — Self-paced with recorded lectures (included)
- **Hybrid** — Online + monthly physical meetups (+₦12,000)
- **Physical Classes** — Weekly on-site classes (+₦22,500)

## Add-on Benefits (optional)
- Job Placement Support — ₦15,000
- Internship Access — ₦12,000
- Mentor Network Access — ₦18,000
- Industry Certification Prep — ₦22,500
- One-on-One Mentorship (1hr/week) — ₦30,000
- VIP Classes at Chosen Location — ₦75,000

## Guidelines
- Be friendly, concise, and helpful.
- Ask clarifying questions about their goals, experience level, and budget to make better recommendations.
- When recommending a plan, mention the specific courses included and why they fit the user's goals.
- If a user is unsure, suggest starting with the Free Foundation and upgrading later.
- For users interested in multiple areas, recommend the Custom Program builder.
- Always mention the learning mode options and relevant add-on benefits.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: message }
    ];

    console.log("Calling Lovable AI with message:", message);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: messages,
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
    const aiResponse = data.choices?.[0]?.message?.content;
    
    console.log("AI Response:", aiResponse);

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in faculty-ai-chat function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
