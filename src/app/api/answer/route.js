// src/app/api/answer/route.js
import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema"; // adjust to your table name
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      mockIdRef,
      question,
      correctAns,
      userAns,
      feedback,
      rating,
      userEmail,
      createdAt,
    } = await req.json();

    // Coerce rating to a safe numeric value (0-10) and store as string
    const parsedRating = Number(rating);
    const safeRating = Number.isFinite(parsedRating) ? Math.round(parsedRating) : 0;

    if (!mockIdRef || !question || !userAns || !userEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await db.insert(UserAnswer).values({
      mockIdRef,
      question,
      correctAns,
      userAns,
      feedback,
      rating: String(safeRating),
      userEmail,
      createdAt,
    });

    return NextResponse.json(
      { success: true, message: "Answer saved" },
      { status: 200 }
    );
  } catch (error) {
    console.error("/api/answer POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save answer" },
      { status: 500 }
    );
  }
}
