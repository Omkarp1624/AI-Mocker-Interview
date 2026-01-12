// src/app/dashboard/interview/[interviewId]/start/_components/ClientStartWrapper.jsx
"use client";

import React, { useState } from "react";
import QuestionsSection from "./QuestionsSection";
import RecordAnswerSection from "./RecordAnswerSectionDynamic";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

function ClientStartWrapper({ interviewData, mockInterviewQuestion }) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

  const totalQuestions = mockInterviewQuestion?.length || 0;

  const markQuestionAnswered = () => {
    setAnsweredQuestions((prev) => {
      const updated = new Set(prev);
      updated.add(activeQuestionIndex);
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 transition-colors">
            ← Dashboard
          </Link>
          <div className="flex-1 mx-8 bg-blue-900/50 border border-blue-400/30 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-300"
              style={{ width: `${((activeQuestionIndex + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
          <span className="text-cyan-300 font-semibold">
            {activeQuestionIndex + 1}/{totalQuestions}
          </span>
        </div>

        {/* Header Card with Completion Status */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-2xl p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              🎯 Interview in Progress
            </h1>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-cyan-400">{answeredQuestions.size}/{totalQuestions}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Job Role</p>
              <p className="text-white font-semibold text-lg">{interviewData?.jobPosition || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Tech Stack</p>
              <p className="text-gray-300 text-sm">{interviewData?.jobDesc || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Experience</p>
              <p className="text-white font-semibold">{interviewData?.jobExperience || "-"} years</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Questions */}
          <div className="lg:col-span-1">
            <QuestionsSection
              mockInterviewQuestion={mockInterviewQuestion}
              activeQuestionIndex={activeQuestionIndex}
              setActiveQuestionIndex={setActiveQuestionIndex}
              answeredQuestions={answeredQuestions}
            />
          </div>

          {/* Recording */}
          <div className="lg:col-span-2">
            <RecordAnswerSection
              mockInterviewQuestion={mockInterviewQuestion}
              activeQuestionIndex={activeQuestionIndex}
              interviewData={interviewData}
              onAnswerSaved={markQuestionAnswered}
            />
          </div>
        </div>

        {/* Navigation buttons */}
        {totalQuestions > 0 && (
          <div className="flex justify-between items-center gap-4 mt-12 pt-8 border-t border-blue-400/20">
            <div>
              {activeQuestionIndex > 0 && (
                <Button
                  onClick={() =>
                    setActiveQuestionIndex((prev) => prev - 1)
                  }
                  className="
                    bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/50 
                    hover:from-blue-500/40 hover:to-cyan-500/40 text-cyan-300 font-semibold
                    rounded-lg px-6 py-3 transition-all duration-300 flex items-center gap-2
                  "
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}
            </div>

            <div className="text-center text-gray-400">
              Question {activeQuestionIndex + 1} of {totalQuestions}
              {answeredQuestions.has(activeQuestionIndex) && (
                <div className="text-green-400 font-semibold text-sm mt-1 flex items-center justify-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Answered
                </div>
              )}
            </div>

            <div className="flex gap-4">
              {activeQuestionIndex < totalQuestions - 1 && (
                <Button
                  onClick={() =>
                    setActiveQuestionIndex((prev) => prev + 1)
                  }
                  className="
                    bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600
                    text-white font-semibold cursor-pointer
                    rounded-lg px-6 py-3 shadow-lg shadow-cyan-500/30
                    hover:shadow-cyan-500/50 transition-all duration-300 flex items-center gap-2
                  "
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}

              {activeQuestionIndex === totalQuestions - 1 && (
                <Link
                  href={`/dashboard/interview/${interviewData?.mockId}/feedback`}
                >
                  <Button
                    className="
                      bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600
                      text-white font-semibold cursor-pointer
                      rounded-lg px-8 py-3 shadow-lg shadow-green-500/30
                      hover:shadow-green-500/50 transition-all duration-300 flex items-center gap-2
                    "
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Complete Interview
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientStartWrapper;
