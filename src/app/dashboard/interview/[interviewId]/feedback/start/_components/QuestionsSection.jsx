import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {
    const textToSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        } else {
            alert('Speech Synthesis Not Supported');
        }
    };

    return mockInterviewQuestion && (
        <div className="p-5 border rounded-lg my-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {mockInterviewQuestion.map((question, index) => (
                    <h2
                        key={index} 
                        className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer 
                        ${activeQuestionIndex === index ? 'bg-zinc-500 text-white' : ''}`}
                    >
                        Question #{index + 1}
                    </h2>
                ))}
            </div>

            {mockInterviewQuestion[activeQuestionIndex] && (
                <>
                    <h2 className="my-5 text-md md:text-lg">{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>
                    <Volume2
                        onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}
                        className="h-5 w-5 text-blue-500 cursor-pointer"
                    />
                </>
            )}

            <div className="border rounded-lg p-5 bg-blue-100 mt-6"> {/* ✅ Fixed incorrect class mt-15 */}
                <h2 className="flex gap-2 items-center text-blue-500">
                    <Lightbulb />
                    <strong>Note:</strong>
                </h2>
                <h2 className="text-sm text-blue-500 my-2">{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
            </div>
        </div>
    );
}

export default QuestionsSection;
