// @ts-ignore: Deno global
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      throw new Error("Message is required");
    }

    console.log("Processing query:", message);

    // @ts-ignore: Deno global
    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    if (!AI_API_KEY) {
      throw new Error("AI_API_KEY is not configured");
    }

    // Call AI gateway with organization search capabilities
    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `You are SaaSquatch Assistant, an intelligent organization research bot. 
Your job is to help users find detailed information about companies and organizations.

When a user asks about an organization:
1. Provide comprehensive information including:
   - Company overview and description
   - Industry and sector
   - Key products or services
   - Company size and employee count (if available)
   - Headquarters location
   - Founded date
   - Official website URL (include only once)
   - Recent news or notable achievements
   - Contact information (if publicly available)

2. Format your response clearly with:
   - Bullet points for easy reading
   - Include the official website link only once
   - Professional and informative tone

3. If you're not certain about specific details, be honest and suggest where users can find more information.

4. For ambiguous queries, ask clarifying questions to ensure you're providing information about the correct organization.

Keep responses concise but comprehensive, focusing on the most relevant and useful information.`,
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            response:
              "⚠️ I'm receiving too many requests right now. Please wait a moment and try again.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            response:
              "⚠️ AI service temporarily unavailable. Please contact support.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    let aiResponse =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't process that request.";

    // 🔹 Remove duplicate markdown-style links
    aiResponse = aiResponse.replace(
      /(\[https?:\/\/[^\]]+\]\([^)]+\))\s*\1/g,
      "$1"
    );

    // 🔹 Remove trailing closing brackets from URLs
    aiResponse = aiResponse.replace(
      /(https?:\/\/[^\s)]+)[)]/g, // match URLs ending with ")"
      "$1" // keep URL without the trailing ")"
    );

    console.log("AI cleaned response:", aiResponse);

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({
        response:
          "❌ Sorry, I encountered an error processing your request. Please try again.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
