// src/app/api/interview/route.js
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

    // Extract text safely from Gemini
    let rawText = "";

    if (typeof result === "string") {
      rawText = result;
    } else if (result?.response?.text && typeof result.response.text === "function") {
      rawText = await result.response.text();
    } else if (result?.response?.text && typeof result.response.text === "string") {
      rawText = result.response.text;
    } else if (result?.text && typeof result.text === "string") {
      rawText = result.text;
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid AI response structure" },
        { status: 500 }
      );
    }

    if (!rawText || typeof rawText !== "string") {
      return NextResponse.json(
        { success: false, error: "AI response is not text" },
        { status: 500 }
      );
    }

    // Clean AI response
    let cleaned = rawText
      .replace(/```/g, "") // remove triple backticks
      .replace(/`/g, "") // remove single backticks
      .trim();

    // Try to extract JSON array or object
    let jsonMatch =
      cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/) || // array
      cleaned.match(/\{\s*"[^"]*"[\s\S]*\}/);   // object

    if (jsonMatch) {
      cleaned = jsonMatch;
    } else {
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      }
    }

    if (!cleaned) {
      return NextResponse.json(
        { success: false, error: "Empty response from AI" },
        { status: 500 }
      );
    }

    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Gemini raw text:", rawText);
      console.error("Cleaned candidate JSON:", cleaned);
      console.error("Parse error:", parseError);
      return NextResponse.json(
        {
          success: false,
          error:
            'JSON parse failed. Expected format: [{"question":"...","answer":"..."}]',
        },
        { status: 500 }
      );
    }

    if (!Array.isArray(parsedQuestions)) {
      parsedQuestions = [parsedQuestions];
    }

    // Basic shape validation
    parsedQuestions = parsedQuestions.filter(
      (q) =>
        q &&
        typeof q.question === "string" &&
        typeof q.answer === "string"
    );

    if (parsedQuestions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            'AI did not return any valid questions in format [{"question":"...","answer":"..."}]',
        },
        { status: 500 }
      );
    }

    const mockId = uuidv4();

    await db.insert(MockInterview).values({
      mockId,
      jsonMockResp: JSON.stringify(parsedQuestions),
      jobPosition,
      jobDesc,
      jobExperience,
      createdBy: userEmail,
      createdAt: moment().format("DD-MM-YYYY"),
    });

    return NextResponse.json(
      {
        success: true,
        mockId,
        questions: parsedQuestions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("/api/interview POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create interview",
      },
      { status: 500 }
    );
  }
}

// GET: single or list
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
    const interviewId = searchParams.get("id");
    const userEmail = searchParams.get("email");

    // Single interview by id
    if (interviewId) {
      const interview = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId))
        .limit(1);

      if (interview.length === 0) {
        return NextResponse.json(
          { success: false, error: "Interview not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: true, interview: interview },
        { status: 200 }
      );
    }

    // List interviews by email
    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "Email parameter required" },
        { status: 400 }
      );
    }

    const interviews = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, userEmail))
      .orderBy(desc(MockInterview.id));

    return NextResponse.json(
      { success: true, interviews },
      { status: 200 }
    );
  } catch (error) {
    console.error("/api/interview GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch interview" },
      { status: 500 }
    );
  }
}
