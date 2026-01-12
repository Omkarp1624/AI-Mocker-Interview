import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { MockInterview } from "@/utils/schema";
import ClientStartWrapper from "./_components/ClientStartWrapper";

async function getInterview(interviewId) {
  const result = await db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.mockId, interviewId));

  if (!result[0]) return null;

  const jsonMockResp = JSON.parse(result[0].jsonMockResp);

  return { interview: result[0], questions: jsonMockResp };
}

export default async function StartInterview({ params }) {
  const { interviewId } = params; // <- important in Next.js 15

  const data = await getInterview(interviewId);

  console.log("start page data ===>", JSON.stringify(data, null, 2));
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center bg-red-500/20 border border-red-400/50 rounded-xl p-8">
          <p className="text-red-300 text-lg font-semibold">Interview not found</p>
        </div>
      </div>
    );
  }

  return (
    <ClientStartWrapper
      interviewData={data.interview}
      mockInterviewQuestion={data.questions}
    />
  );
}
