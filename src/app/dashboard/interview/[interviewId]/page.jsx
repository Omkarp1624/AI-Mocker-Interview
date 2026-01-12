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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
          <p className="text-white text-lg font-semibold">Loading interview details...</p>
        </div>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center bg-red-500/20 border border-red-400/50 rounded-xl p-8">
          <p className="text-red-300 text-lg font-semibold">Interview not found</p>
          <Link href="/dashboard" className="mt-4 inline-block">
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 mb-4 transition-colors">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            🎯 Let&apos;s Get Started
          </h1>
          <p className="text-gray-400 mt-2">Prepare yourself for the interview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Job Info */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Job Details Card */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span> Interview Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Job Role</p>
                  <p className="text-white font-semibold text-lg">{interviewData?.jobPosition || "-"}</p>
                </div>
                <div className="border-t border-blue-400/20 pt-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Tech Stack</p>
                  <p className="text-gray-300 text-sm">{interviewData?.jobDesc || "-"}</p>
                </div>
                <div className="border-t border-blue-400/20 pt-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Experience Level</p>
                  <p className="text-white font-semibold">{interviewData?.jobExperience || "-"} years</p>
                </div>
              </div>
            </div>

            {/* Information Card */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/30 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="flex gap-2 items-center text-amber-300 font-bold mb-3 text-sm">
                <Lightbulb className="h-5 w-5" /> <span>Important</span>
              </h3>
              <p className="text-amber-100 text-sm leading-relaxed">
                ✓ Enable your webcam and microphone before starting<br/>
                ✓ Click &quot;Record&quot; when ready to answer<br/>
                ✓ Speak clearly and naturally<br/>
                ✓ At the end, you&apos;ll get AI feedback and ratings
              </p>
            </div>
          </div>

          {/* Right: Webcam Setup */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-2xl p-8 backdrop-blur-sm flex flex-col items-center justify-center min-h-[500px]">
              {webCamEnabled ? (
                <div className="w-full space-y-4">
                  <h3 className="text-white font-bold text-lg mb-4">📷 Camera Active</h3>
                  <Webcam
                    onUserMedia={() => setWebCamEnabled(true)}
                    onUserMediaError={() => setWebCamEnabled(false)}
                    mirrored
                    style={{
                      height: 400,
                      width: "100%",
                      borderRadius: 16,
                    }}
                    className="border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/20"
                  />
                  <div className="flex gap-4 justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setWebCamEnabled(false)}
                      className="border-blue-400/50 text-gray-300 hover:bg-blue-500/10 hover:text-cyan-300 rounded-lg px-6 py-2 font-semibold transition-all"
                    >
                      Disable Camera
                    </Button>
                    <Link href={`/dashboard/interview/${interviewId}/start`} className="w-full sm:w-auto">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg px-6 py-2 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300">
                        <span className="flex items-center gap-2">
                          <span>🚀</span> Start Interview
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="inline-block p-8 bg-blue-500/20 rounded-2xl">
                    <WebcamIcon className="h-24 w-24 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl mb-2">Camera & Microphone Setup</h3>
                    <p className="text-gray-400 max-w-sm">Enable your camera and microphone to proceed with the interview</p>
                  </div>
                  <Button
                    onClick={() => setWebCamEnabled(true)}
                    className="
                      bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600
                      text-white font-semibold cursor-pointer
                      rounded-lg px-8 py-3 shadow-lg shadow-cyan-500/30
                      hover:shadow-cyan-500/50 transition-all duration-300
                      text-base
                    "
                  >
                    <span className="flex items-center gap-2">
                      <WebcamIcon className="h-5 w-5" /> Enable Webcam & Microphone
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;
