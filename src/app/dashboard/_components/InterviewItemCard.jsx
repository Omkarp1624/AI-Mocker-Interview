"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function InterviewItemCard({ interview }) {
  const router = useRouter();

  const onStart = () => {
    router.push(`/dashboard/interview/${interview?.mockId}`);
  };

  const onFeedback = () => {
    router.push(`/dashboard/interview/${interview?.mockId}/feedback`);
  };

  return (
    <div className="border shadow-sm rounded-lg p-4">
      <h2 className="font-bold text-primary">
        {interview?.jobPosition}
      </h2>
      <h2 className="text-sm text-gray-600">
        {interview?.jobExperience} Years of Experience
      </h2>
      <h2 className="text-xs text-gray-400">
        Created At: {interview?.createdAt}
      </h2>

      <div className="flex justify-between mt-3 gap-4">
        <Button
          size="sm"
          variant="outline"
          className="
            bg-blue-600 hover:bg-blue-700 text-white cursor-pointer
            rounded-full px-4 py-1
          "
          onClick={onFeedback}
        >
          Feedback
        </Button>

        <Button
          size="sm"
          className="
            bg-blue-600 hover:bg-blue-700 text-white cursor-pointer
            rounded-full px-4 py-1
          "
          onClick={onStart}
        >
          Start
        </Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
