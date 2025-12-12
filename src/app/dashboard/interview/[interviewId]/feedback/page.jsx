// src/app/dashboard/interview/[interviewId]/feedback/page.jsx
import { db } from "@/utils/db";
import { eq, desc } from "drizzle-orm";
import { UserAnswer } from "@/utils/schema";

async function getFeedback(interviewId) {
  const rows = await db
    .select()
    .from(UserAnswer)
    .where(eq(UserAnswer.mockIdRef, interviewId))
    .orderBy(desc(UserAnswer.id));

  return rows;
}

export default async function Feedback({ params }) {
  const { interviewId } = await params; // Next.js 15: params is a Promise
  const answers = await getFeedback(interviewId);

  if (!answers || answers.length === 0) {
    return (
      <div className="p-8 text-center">
        No answers recorded yet for this interview.
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Interview Feedback</h1>
      <div className="space-y-4">
        {answers.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 space-y-2 bg-white"
          >
            <p className="font-semibold">Q: {item.question}</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Your answer:</span> {item.userAns}
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
    </div>
  );
}
