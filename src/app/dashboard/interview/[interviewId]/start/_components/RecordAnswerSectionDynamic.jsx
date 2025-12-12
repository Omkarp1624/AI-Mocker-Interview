// src/app/dashboard/interview/[interviewId]/start/_components/RecordAnswerSectionDynamic.jsx
"use client";

import dynamic from "next/dynamic";

const RecordAnswerSectionDynamic = dynamic(
  () => import("./RecordAnswerSection"),
  { ssr: false }
);

export default RecordAnswerSectionDynamic;
