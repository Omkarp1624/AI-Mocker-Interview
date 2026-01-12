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

function ratingColor(r) {
  const n = Number(r) || 0;
  if (n >= 8) return "bg-green-600 text-white";
  if (n >= 6) return "bg-green-400 text-white";
  if (n >= 4) return "bg-yellow-500 text-white";
  return "bg-red-500 text-white";
}

export default async function Feedback({ params }) {
  const { interviewId } = await params;
  const answers = await getFeedback(interviewId);

  // If user visited feedback without answering anything
  if (!answers || answers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
        <div className="max-w-2xl w-full text-center bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-blue-400/20 rounded-2xl p-8 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-white mb-4">Interview Feedback</h1>
          <p className="text-gray-300 mb-6">
            No interview feedback found. It looks like you didn't answer any questions for this session.
          </p>
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg px-6 py-3">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalRating = answers.reduce((sum, item) => sum + (Number(item.rating) || 0), 0);
  const avgRating = answers.length ? totalRating / answers.length : 0;

  let overallComment = "";
  if (avgRating >= 8) {
    overallComment = "Excellent performance — you are interview-ready.";
  } else if (avgRating >= 6) {
    overallComment = "Good performance — polish a few areas and you will be great.";
  } else if (avgRating >= 4) {
    overallComment = "Average performance — strengthen core topics and structure.";
  } else {
    overallComment = "Below average — revisit fundamentals and practice more.";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Interview Feedback</h1>
            <p className="text-gray-400">Detailed feedback and ratings from your mock interview</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Average rating</p>
            <div className="mt-2 inline-flex items-center gap-4">
              <div className="text-4xl font-bold text-white">{avgRating.toFixed(1)}</div>
              <div className="text-sm text-gray-300">/ 10</div>
            </div>
            <p className="text-gray-300 mt-2">{overallComment}</p>
          </div>
        </header>

        {/* Summary card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-2xl p-6">
            <h3 className="text-sm text-gray-300">Questions</h3>
            <div className="text-2xl font-bold text-white mt-2">{answers.length}</div>
            <p className="text-xs text-gray-400 mt-1">Total questions evaluated</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-2xl p-6">
            <h3 className="text-sm text-gray-300">Success Rate</h3>
            <div className="text-2xl font-bold text-white mt-2">{Math.round((answers.filter(a=>Number(a.rating)>=6).length/answers.length)*100)}%</div>
            <p className="text-xs text-gray-400 mt-1">Questions rated 6+</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/30 rounded-2xl p-6">
            <h3 className="text-sm text-gray-300">Next Steps</h3>
            <p className="text-sm text-gray-200 mt-2">{avgRating >= 8 ? 'Keep practising mock interviews to maintain skills.' : avgRating >=6 ? 'Focus on refining explanations and examples.' : 'Review fundamentals and practice structured answers.'}</p>
          </div>
        </div>

        {/* Per-question feedback */}
        <div className="space-y-6">
          {answers.map((item, idx) => (
            <div key={item.id} className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-blue-400/20 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-400">Q{idx + 1}</div>
                    <h4 className="text-lg font-semibold text-white">{item.question}</h4>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Your answer</p>
                      <p className="text-sm text-gray-200">{item.userAns || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Model answer</p>
                      <p className="text-sm text-gray-200">{item.correctAns || '—'}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-gray-400">AI feedback</p>
                    <p className="text-sm text-gray-200 mt-1">{item.feedback || 'No feedback provided.'}</p>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <div className={`inline-block px-3 py-2 rounded-md ${ratingColor(item.rating)}`}>{item.rating || 0}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="flex justify-between items-center">
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg px-6 py-3">Back to Dashboard</Button>
          </Link>
          <div className="text-sm text-gray-400">Export results coming soon</div>
        </div>
      </div>
    </div>
  );
}
