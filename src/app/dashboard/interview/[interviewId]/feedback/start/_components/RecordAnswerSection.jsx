"use client";
import { Button } from "@/src/components/ui/button";
import { db } from "@/utils/db";
import { chatSession } from "@/utils/GeminiAIModal";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { Mic } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import { toast } from "sonner";

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
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
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    });

    useEffect(() => {
        if (results && results.length > 0) {
            setUserAnswer((prevAns) => prevAns + " " + results.map((res) => res.transcript).join(" "));
        }
    }, [results]);

    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {
            UpdateUserAnswer();
        }
    }, [userAnswer]);

    const StartStopRecording = async () => {
        if (isRecording) {
            stopSpeechToText();
        } else {
            startSpeechToText();
        }
    };

    const UpdateUserAnswer = async () => {
        setLoading(true);
        try {
            const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, 
                User Answer: ${userAnswer}. Based on this, provide a rating and feedback (3-5 lines) 
                in JSON format with fields 'rating' and 'feedback'.`;

            const result = await chatSession.sendMessage(feedbackPrompt);
            const rawResponse = result.response.text();

            // Safely parse JSON response
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

            const resp = await db.insert(UserAnswer).values({
                mockIdRef: interviewData?.mockId,
                question: mockInterviewQuestion[activeQuestionIndex]?.question,
                correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
                userAns: userAnswer,
                feedback: JsonFeedbackResp?.feedback || "No feedback provided.",
                rating: JsonFeedbackResp?.rating || 0,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format("YYYY-MM-DD"),
            });

            if(resp) {
                toast.success("Answer saved successfully");
                
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

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center rounded-lg p-5 my-7 bg-black relative">
                <Image src="/webcam.jpg" width={200} height={200} className="absolute" />
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

                {/* <Button onClick={() => console.log(userAnswer)}>Show user Answer</Button> */}
            </div>
        </div>
    );
}

export default RecordAnswerSection;
