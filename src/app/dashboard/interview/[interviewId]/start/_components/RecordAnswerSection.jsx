// src/app/dashboard/interview/[interviewId]/start/_components/RecordAnswerSection.jsx
"use client";

import { Button } from "@/components/ui/button";
import { chatSession } from "@/utils/GeminiAIModal";
import { useUser } from "@clerk/nextjs";
import { Mic } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";
import useSpeechToText from "react-hook-speech-to-text";

function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const [shouldSave, setShouldSave] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const {
    error,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (results && results.length > 0) {
      setUserAnswer(
        (prev) => prev + " " + results.map((r) => r.transcript).join(" ")
      );
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && shouldSave) {
      if (userAnswer.trim().length > 10) {
        UpdateUserAnswer();
        setShouldSave(false);
      } else {
        toast("Error while saving your answer. Please try again.", {
          description:
            "No audio or answer too short. Please ensure your microphone is working and try again.",
          duration: 5000,
        });
        setShouldSave(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAnswer, isRecording, shouldSave]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      setShouldSave(true);
    } else {
      setUserAnswer("");
      setResults([]);
      setShouldSave(false);
      await startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    setLoading(true);
    try {
      const question = mockInterviewQuestion[activeQuestionIndex]?.question;
      const correctAns = mockInterviewQuestion[activeQuestionIndex]?.answer;

      if (!question) {
        toast.error("No question found for this index.");
        return;
      }

      const feedbackPrompt = `
Question: ${question}
User Answer: ${userAnswer}

You are an interview evaluator. Give JSON only, no extra text, with exactly:
{
  "rating": number (1-10),
  "feedback": "3-5 lines of constructive feedback"
}
`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const rawResponse = await result.response.text();

      let cleaned = rawResponse
        .replace(/```/g, "")
        .replace(/`/g, "")
        .trim();

      const jsonMatch = cleaned.match(/\{\s*"[^"]*"\s*:[\s\S]*\}/);

      if (!jsonMatch) {
        console.error("No JSON object in feedback:", rawResponse);
        toast.error("Failed to process AI feedback.");
        return;
      }

      const mockJsonResp = jsonMatch;

      let JsonFeedbackResp;
      try {
        JsonFeedbackResp = JSON.parse(mockJsonResp);
      } catch (err) {
        console.error("Error parsing JSON response:", err, mockJsonResp);
        toast.error("Failed to process AI feedback.");
        return;
      }

      const resp = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mockIdRef: interviewData?.mockId,
          question,
          correctAns,
          userAns: userAnswer,
          feedback: JsonFeedbackResp?.feedback || "No feedback provided.",
          rating: JsonFeedbackResp?.rating || 0,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("YYYY-MM-DD"),
        }),
      });

      const data = await resp.json();

      if (resp.ok && data.success) {
        toast.success("Answer saved successfully");
      } else {
        console.error("Save answer API error:", data.error);
        toast.error(data.error || "Failed to save answer.");
      }

      setUserAnswer("");
      setResults([]);
    } catch (error) {
      console.error("Error updating user answer:", error);
      toast.error("Failed to save answer.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Speech-to-text not available in this browser: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center rounded-lg p-5 my-7 bg-black relative">
        <Image
          src="/webcam.jpg"
          alt="webcam-bg"
          width={200}
          height={200}
          className="absolute"
        />
        <Webcam
          mirrored
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>

      <div className="flex flex-col items-center justify-center">
       <Button
  disabled={loading}
  variant="outline"
  onClick={StartStopRecording}
  className="
    bg-blue-600 hover:bg-blue-700 text-white cursor-pointer
    rounded-full px-6
  "
>
  {isRecording ? (
    <span className="text-white flex gap-2 items-center">
      <Mic /> STOP (TEST)
    </span>
  ) : (
    <span className="text-white flex gap-2 items-center">
      <Mic /> START (TEST)
    </span>
  )}
</Button>

      </div>
    </div>
  );
}

export default RecordAnswerSection;
