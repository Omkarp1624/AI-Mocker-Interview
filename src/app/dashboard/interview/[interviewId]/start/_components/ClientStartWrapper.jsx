// src/app/dashboard/interview/[interviewId]/start/_components/ClientStartWrapper.jsx
"use client";

import React, { useState } from "react";
import QuestionsSection from "./QuestionsSection";
import RecordAnswerSection from "./RecordAnswerSectionDynamic";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ClientStartWrapper({ interviewData, mockInterviewQuestion }) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const totalQuestions = mockInterviewQuestion?.length || 0;

  return (
    <div className="space-y-6">
      {/* Top info panel */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Let's Get Started</h2>

        <div className="space-y-1 text-sm">
          <p>
            <span className="font-semibold">Job Role/Job Position :</span>{" "}
            {interviewData?.jobPosition || "-"}
          </p>
          <p>
            <span className="font-semibold">Job Description :</span>{" "}
            {interviewData?.jobDesc || "-"}
          </p>
          <p>
            <span className="font-semibold">Years of Experience :</span>{" "}
            {interviewData?.jobExperience || "-"}
          </p>
        </div>

        <div className="mt-4 text-sm text-gray-700 space-y-1">
          <div className="inline-flex items-center gap-2 rounded-md bg-yellow-100 px-4 py-2">
            <span className="font-medium">Information</span>
          </div>
          <p className="mt-2">Enable Webcam and Microphone.</p>
          <p>
            Click on the record section when you want to answer the question.
            At the end of the interview we will give you the feedback along
            with the correct answer for each question and your answer to
            compare it.
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Questions */}
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        {/* Recording */}
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>

      {/* Navigation buttons */}
      {totalQuestions > 0 && (
        <div className="flex justify-end gap-4 my-7">
          {activeQuestionIndex > 0 && (
            <Button
              onClick={() =>
                setActiveQuestionIndex((prev) => prev - 1)
              }
              className="
                bg-blue-600 hover:bg-blue-700 text-white cursor-pointer
                rounded-full px-5
              "
            >
              Previous Question
            </Button>
          )}

          {activeQuestionIndex < totalQuestions - 1 && (
            <Button
              onClick={() =>
                setActiveQuestionIndex((prev) => prev + 1)
              }
              className="
                bg-blue-600 hover:bg-blue-700 text-white cursor-pointer
                rounded-full px-5
              "
            >
              Next Question
            </Button>
          )}

          {activeQuestionIndex === totalQuestions - 1 && (
            <Link
              href={`/dashboard/interview/${interviewData?.mockId}/feedback`}
            >
              <Button
                className="
                  bg-blue-600 hover:bg-blue-700 text-white cursor-pointer
                  rounded-full px-5
                "
              >
                End Interview
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default ClientStartWrapper;
