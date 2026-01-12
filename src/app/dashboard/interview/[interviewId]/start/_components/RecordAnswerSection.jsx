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
  onAnswerSaved,
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
        if (onAnswerSaved) {
          onAnswerSaved();
        }
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
      <div className="bg-red-500/20 border border-red-400/50 rounded-2xl p-8 text-center">
        <p className="text-red-300 font-semibold">⚠️ Microphone Error</p>
        <p className="text-red-200 text-sm mt-2">Speech-to-text not available in this browser</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Webcam Section */}
      <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-2xl p-8 backdrop-blur-sm overflow-hidden">
        <div className="relative bg-black rounded-xl overflow-hidden shadow-xl shadow-cyan-500/20">
          <Webcam
            mirrored
            style={{
              height: 400,
              width: "100%",
              borderRadius: 12,
            }}
            className="w-full"
          />
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/80 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
              <span className="text-white font-semibold text-sm">Recording</span>
            </div>
          )}
        </div>
      </div>

      {/* Recording Status & Instructions */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-white font-bold mb-3">📝 Your Answer</h3>
        <div className="bg-slate-800/50 border border-blue-400/20 rounded-lg p-4 min-h-[100px] max-h-[200px] overflow-y-auto">
          <p className="text-gray-300 text-sm leading-relaxed">
            {userAnswer || "Your transcribed answer will appear here..."}
          </p>
        </div>
      </div>

      {/* Recording Button */}
      <div className="flex justify-center pt-4">
        <Button
          disabled={loading}
          onClick={StartStopRecording}
          className={`
            ${isRecording 
              ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/30" 
              : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-cyan-500/30"
            }
            text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300
            flex items-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <Mic className="h-5 w-5" />
          {loading ? (
            <span>Processing...</span>
          ) : isRecording ? (
            <span>⏹️ Stop Recording</span>
          ) : (
            <span>🎤 Start Recording</span>
          )}
        </Button>
      </div>

      {/* Help Text */}
      <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-4">
        <p className="text-amber-200 text-xs text-center">
          💡 Click the microphone button above to start recording your answer. Speak clearly and naturally.
        </p>
      </div>
    </div>
  );
}

export default RecordAnswerSection;
