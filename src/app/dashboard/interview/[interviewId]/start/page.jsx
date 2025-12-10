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
  const data = await getInterview(params.interviewId);

  if (!data) {
    return <div className="p-8 text-center">Interview not found</div>;
  }

  return (
    <ClientStartWrapper
      interviewData={data.interview}
      mockInterviewQuestion={data.questions}
    />
  );
}
