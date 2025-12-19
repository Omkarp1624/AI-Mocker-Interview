"use client";

import { Button } from "@/components/ui/button";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { useParams } from "next/navigation";

function Interview() {
  const params = useParams(); // Next.js 15: client-side hook
  const interviewId = params.interviewId;

  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  const GetInterviewDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/interview?id=${interviewId}`);
      const data = await res.json();

      if (res.ok && data.success) {
        // data.interview is an array from your API GET
        const row = Array.isArray(data.interview)
          ? data.interview[0]
          : data.interview;
        setInterviewData(row);
      } else {
        console.error("Failed to fetch interview:", data.error);
      }
    } catch (err) {
      console.error("Error fetching interview:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading interview details...</div>;
  }

  if (!interviewData) {
    return (
      <div className="p-8 text-center text-red-500">
        Interview not found
      </div>
    );
  }

  return (
    <div className="my-10 space-y-6">
      {/* Top heading */}
      <h2 className="font-bold text-2xl">Let&apos;s Get Started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 my-1 gap-10">
        {/* Left: job info + information */}
        <div className="flex flex-col my-5 gap-5">
          <div className="flex flex-col p-5 rounded-lg border gap-3 bg-white shadow-sm">
            <h2 className="text-sm">
              <span className="font-semibold">Job Role/Job Position :</span>{" "}
              {interviewData?.jobPosition || "-"}
            </h2>
            <h2 className="text-sm">
              <span className="font-semibold">Job Description :</span>{" "}
              {interviewData?.jobDesc || "-"}
            </h2>
            <h2 className="text-sm">
              <span className="font-semibold">Years of Experience :</span>{" "}
              {interviewData?.jobExperience || "-"}
            </h2>
          </div>

          <div className="p-5 border rounded-lg border-yellow-500 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-600">
              <Lightbulb /> <span className="font-semibold">Information</span>
            </h2>
            <h2 className="mt-3 text-yellow-700 text-sm">
              Enable Webcam and Microphone. Click on the record section when
              you want to answer the question. At the end of the interview we
              will give you the feedback along with the correct answer for each
              question and your answer to compare it.
            </h2>
          </div>
        </div>

        {/* Right: webcam + enable button */}
        <div className="flex flex-col items-center justify-center gap-4">
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored
              style={{
                height: 300,
                width: 300,
                borderRadius: 16,
              }}
              className="border border-gray-300"
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-4 p-20 bg-secondary rounded-lg border" />
              <Button
                variant="outline"
                className="
                  bg-blue-600 hover:bg-blue-700 text-white cursor-pointer
                  rounded-full px-6
                "
                onClick={() => setWebCamEnabled(true)}
              >
                Enable Webcam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Bottom: Start Interview button */}
      <div className="flex justify-end items-end">
        <Link href={`/dashboard/interview/${interviewId}/start`}>
          <Button
            className="
              bg-blue-600 hover:bg-blue-700 text-white cursor-pointer
              rounded-full px-6
            "
          >
            Start Interview
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
