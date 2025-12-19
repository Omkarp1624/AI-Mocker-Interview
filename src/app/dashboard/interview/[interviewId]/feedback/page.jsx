// src/app/dashboard/interview/[interviewId]/feedback/page.jsx
import { db } from "@/utils/db";
import { eq, asc } from "drizzle-orm";
import { UserAnswer } from "@/utils/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getFeedback(interviewId) {
  const rows = await db
    .select()
    .from(UserAnswer)
    .where(eq(UserAnswer.mockIdRef, interviewId))
    .orderBy(asc(UserAnswer.id)); // Q1 at top, last at bottom

  return rows;
}

export default async function Feedback({ params }) {
  const { interviewId } = await params;
  const answers = await getFeedback(interviewId);

  // If user visited feedback without answering anything
  if (!answers || answers.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Interview Feedback</h1>
          <p className="text-gray-600">
            No interview feedback record found. It looks like you did not answer any questions in this interview.
          </p>
        </div>

        <Link href="/dashboard">
          <Button
            className="
              bg-blue-600 hover:bg-blue-700 text-white cursor-pointer
              rounded-full px-6
            "
          >
            Go Home
          </Button>
        </Link>
      </div>
    );
  }

  const totalRating = answers.reduce(
    (sum, item) => sum + (Number(item.rating) || 0),
    0
  );
  const avgRating = answers.length ? totalRating / answers.length : 0;

  let overallComment = "";
  if (avgRating >= 8) {
    overallComment =
      "Excellent performance. You are well-prepared and ready for real interviews.";
  } else if (avgRating >= 6) {
    overallComment =
      "Good performance. You have a solid base; focus on improving weaker areas and refining explanations.";
  } else if (avgRating >= 4) {
    overallComment =
      "Average performance. Work on strengthening core concepts and practising more structured answers.";
  } else {
    overallComment =
      "Below average performance. Revisit fundamentals and practise more mock interviews to build confidence.";
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Interview Feedback</h1>

      {/* Overall feedback card */}
      <div className="border rounded-lg p-4 bg-blue-50">
        <h2 className="text-lg font-semibold mb-1">Overall Feedback</h2>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Average Rating:</span>{" "}
          {avgRating.toFixed(1)} / 10
        </p>
        <p className="text-sm text-gray-700 mt-1">
          <span className="font-semibold">Summary:</span> {overallComment}
        </p>
      </div>

      {/* Per-question feedback */}
      <div className="space-y-4">
        {answers.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 space-y-2 bg-white"
          >
            <p className="font-semibold">Q: {item.question}</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Your answer:</span>{" "}
              {item.userAns}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Correct answer:</span>{" "}
              {item.correctAns}
            </p>
            <p className="text-sm text-blue-700">
              <span className="font-semibold">AI Feedback:</span>{" "}
              {item.feedback}
            </p>
            <p className="text-sm text-green-700">
              <span className="font-semibold">Rating:</span> {item.rating}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Go Home button */}
      <div className="pt-4 flex justify-center">
        <Link href="/dashboard">
          <Button
            className="
              bg-blue-600 hover:bg-blue-700 text-white cursor-pointer
              rounded-full px-6
            "
          >
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
