import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { chatSession } from "@/utils/GeminiAIModal";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@clerk/nextjs/server";
import moment from "moment";
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

// POST: Create new interview
export async function POST(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { jobPosition, jobDesc, jobExperience, userEmail } = await req.json();

    if (!jobPosition || !jobDesc || !jobExperience) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Creating interview for:", {
      jobPosition,
      jobDesc,
      jobExperience,
    });

    const inputPrompt = `Generate 5 interview questions with answers for the following job:
Job Position: ${jobPosition}
Job Description/Tech Stack: ${jobDesc}
Years of Experience: ${jobExperience}

Return ONLY a valid JSON array with this exact format, no markdown, no extra text:
[
  {"question": "What is...", "answer": "The answer is..."},
  {"question": "How do...", "answer": "You should..."}
]

Do not add any text before or after the JSON array.`;

    const result = await chatSession.sendMessage(inputPrompt);

    console.log("Full result object:", JSON.stringify(result, null, 2));

    // Extract text safely - handle multiple possible response structures
    let rawText = "";
    
    if (typeof result === "string") {
      rawText = result;
    } else if (result?.response?.text && typeof result.response.text === "function") {
      rawText = result.response.text();
    } else if (result?.response?.text && typeof result.response.text === "string") {
      rawText = result.response.text;
    } else if (result?.text && typeof result.text === "string") {
      rawText = result.text;
    } else {
      console.error("Cannot extract text from result:", result);
      return NextResponse.json(
        { success: false, error: "Invalid AI response structure" },
        { status: 500 }
      );
    }

    console.log("Extracted raw text:", rawText);

    if (!rawText || typeof rawText !== "string") {
      console.error("rawText is not a string:", rawText, typeof rawText);
      return NextResponse.json(
        { success: false, error: "AI response is not text" },
        { status: 500 }
      );
    }

    // Clean the AI response - remove markdown fences and extra text
    let cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/gi, "")
      .trim();

    console.log("After markdown removal:", cleaned);

    // Try to extract JSON array or object
    let jsonMatch = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/) || // Array of objects
                   cleaned.match(/\{\s*"[^"]*"[\s\S]*\}/);     // Single object

    if (jsonMatch) {
      cleaned = jsonMatch[0];
    } else {
      // Fallback: find first { and last }
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      }
    }

    console.log("Final cleaned JSON:", cleaned.substring(0, 300));

    if (!cleaned) {
      console.error("Cleaned response is empty");
      return NextResponse.json(
        { success: false, error: "Empty response from AI" },
        { status: 500 }
      );
    }

    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(cleaned);
      console.log("Questions parsed successfully:", parsedQuestions);
    } catch (parseError) {
      console.error("JSON parse error:", parseError.message);
      console.error("Failed to parse:", cleaned.substring(0, 500));
      return NextResponse.json(
        { 
          success: false, 
          error: `JSON parse failed at position ${parseError.message}. Expected format: [{"question":"...", "answer":"..."}]`,
          sample: cleaned.substring(0, 300)
        },
        { status: 500 }
      );
    }

    // Ensure parsedQuestions is an array
    if (!Array.isArray(parsedQuestions)) {
      parsedQuestions = [parsedQuestions];
    }

    const mockId = uuidv4();
    console.log("Generated mockId:", mockId);

    console.log("Inserting into database...");
    const resp = await db
      .insert(MockInterview)
      .values({
        mockId: mockId,
        jsonMockResp: JSON.stringify(parsedQuestions),
        jobPosition: jobPosition,
        jobDesc: jobDesc,
        jobExperience: jobExperience,
        createdBy: userEmail,
        createdAt: moment().format("DD-MM-YYYY"),
      })
      .returning({ mockId: MockInterview.mockId });

    console.log("Insert successful:", resp);

    return NextResponse.json(
      {
        success: true,
        mockId: mockId,
        questions: parsedQuestions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating interview:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create interview",
      },
      { status: 500 }
    );
  }
}

// GET: Fetch all interviews for current user
export async function GET(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("email");

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "Email parameter required" },
        { status: 400 }
      );
    }

    console.log("Fetching interviews for:", userEmail);

    const interviews = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, userEmail))
      .orderBy(desc(MockInterview.id));

    return NextResponse.json(
      {
        success: true,
        interviews,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch interviews" },
      { status: 500 }
    );
  }
}
