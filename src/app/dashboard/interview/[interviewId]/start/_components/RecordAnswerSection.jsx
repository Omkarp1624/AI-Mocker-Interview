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
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const {
    error,
    interimResult,
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
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAnswer]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      await startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    setLoading(true);
    try {
      const feedbackPrompt = `Question: ${
        mockInterviewQuestion[activeQuestionIndex]?.question
      }, 
        User Answer: ${userAnswer}. Based on this, provide a rating and feedback (3-5 lines) 
        in JSON format with fields 'rating' and 'feedback'.`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const rawResponse = result.response.text();

      const jsonStartIndex = rawResponse.indexOf("{");
      const jsonEndIndex = rawResponse.lastIndexOf("}") + 1;
      const mockJsonResp = rawResponse.substring(jsonStartIndex, jsonEndIndex);

      let JsonFeedbackResp;
      try {
        JsonFeedbackResp = JSON.parse(mockJsonResp);
      } catch (err) {
        console.error("Error parsing JSON response:", err);
        toast.error("Failed to process AI feedback.");
        return;
      }

      const resp = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mockIdRef: interviewData?.mockId,
          question: mockInterviewQuestion[activeQuestionIndex]?.question,
          correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
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
      <div className="flex flex-col items-center justify-center ">
        <Button disabled={loading} variant="outline" onClick={StartStopRecording}>
          {isRecording ? (
            <h2 className="text-red-600 flex gap-2">
              <Mic /> Stop Recording
            </h2>
          ) : (
            <h2 className="text-green-600 flex gap-2">
              <Mic /> Start Recording
            </h2>
          )}
        </Button>
      </div>
    </div>
  );
}

export default RecordAnswerSection;
