// src/app/dashboard/interview/[interviewId]/start/_components/QuestionsSection.jsx
import { Lightbulb, Volume2, CheckCircle2 } from "lucide-react";
import React from "react";

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex, setActiveQuestionIndex, answeredQuestions }) {
  const textToSpeech = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Speech Synthesis Not Supported");
    }
  };

  const noteText =
    process.env.NEXT_PUBLIC_QUESTION_NOTE ||
    "Use this space to think through your answer clearly. Focus on structure, key points, and examples from your experience.";

  return (
    mockInterviewQuestion && (
      <div className="space-y-6">
        {/* Question Navigation */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-white font-bold mb-4">Questions</h3>
          <div className="grid grid-cols-2 gap-2">
            {mockInterviewQuestion.map((question, index) => (
              <button
                key={index}
                onClick={() => setActiveQuestionIndex(index)}
                className={`p-3 rounded-lg text-xs md:text-sm font-semibold text-center cursor-pointer transition-all relative group ${
                  activeQuestionIndex === index
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                    : answeredQuestions.has(index)
                    ? "bg-gradient-to-r from-green-500/40 to-emerald-500/40 border border-green-400/50 text-green-300 hover:from-green-500/60 hover:to-emerald-500/60"
                    : "bg-blue-500/20 border border-blue-400/30 text-gray-300 hover:border-blue-400/50"
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Q{index + 1}</span>
                  {answeredQuestions.has(index) && activeQuestionIndex !== index && (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Question */}
        {mockInterviewQuestion[activeQuestionIndex] && (
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-white flex-1">
                {mockInterviewQuestion[activeQuestionIndex]?.question}
              </h2>
              <button
                onClick={() =>
                  textToSpeech(
                    mockInterviewQuestion[activeQuestionIndex]?.question
                  )
                }
                className="ml-4 p-2 hover:bg-cyan-500/20 rounded-lg transition-all text-cyan-400 hover:text-cyan-300"
                title="Read aloud"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>
            {answeredQuestions.has(activeQuestionIndex) && (
              <div className="mt-4 p-3 bg-green-500/20 border border-green-400/30 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="text-green-300 font-semibold">Answer Recorded</span>
              </div>
            )}
          </div>
        )}

        {/* Note/Tips */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/30 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="flex gap-2 items-center text-amber-300 font-bold mb-3">
            <Lightbulb className="h-5 w-5" />
            <span>Tips</span>
          </h2>
          <p className="text-amber-100 text-sm leading-relaxed">{noteText}</p>
        </div>
      </div>
    )
  );
}

export default QuestionsSection;
