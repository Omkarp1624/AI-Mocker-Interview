"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Job Role Suggestions
const JOB_ROLE_SUGGESTIONS = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Software Engineer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Cloud Engineer",
  "Mobile App Developer",
  "UI/UX Designer",
];

// Tech Stack Suggestions
const TECH_STACK_SUGGESTIONS = {
  "Full Stack Developer": "React, Node.js, Express, MongoDB, TypeScript",
  "Frontend Developer": "React, Vue.js, Angular, TypeScript, Tailwind CSS",
  "Backend Developer": "Python, Django, Flask, Java Spring, PostgreSQL",
  "Software Engineer": "Java, C++, Python, AWS, Microservices",
  "DevOps Engineer": "Docker, Kubernetes, Jenkins, AWS, Azure",
  "Data Scientist": "Python, TensorFlow, PyTorch, Pandas, NumPy",
  "Machine Learning Engineer": "Python, scikit-learn, Keras, TensorFlow",
  "Cloud Engineer": "AWS, Azure, GCP, Terraform, Kubernetes",
  "Mobile App Developer": "React Native, Flutter, Swift, Kotlin",
  "UI/UX Designer": "Figma, Sketch, Adobe XD, InVision",
};

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  // Auto-suggest tech stack based on job role
  const autoSuggestTechStack = (role) => {
    const suggestion = TECH_STACK_SUGGESTIONS[role];
    if (suggestion) {
      setJobDesc(suggestion);
      toast.info(`Auto-filled tech stack for ${role}`);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobPosition,
          jobDesc,
          jobExperience,
          userEmail: user?.primaryEmailAddress?.emailAddress,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Interview questions generated successfully!");
        setOpenDialog(false);
        router.push(`/dashboard/interview/${data.mockId}`);
      } else {
        console.error("API error:", data.error);
        toast.error(data.error || "Failed to generate interview questions.");
      }
    } catch (err) {
      console.error("Network/API error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Add New Button */}
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="mx-20 text-lg">+ Add New Interview</h2>
      </div>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job Interview
            </DialogTitle>
          </DialogHeader>

          {/* Form is OUTSIDE DialogDescription to avoid <p><form> issue */}
          <form onSubmit={onSubmit}>
            <div>
              <h2 className="text-sm font-medium mb-2">
                Add details about your job position/role, job description and
                years of experience.
              </h2>

              <div className="mt-7 my-2">
                <label className="font-bold mx-2">Job Role/Job Position</label>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Ex: Full Stack Developer"
                    value={jobPosition}
                    required
                    onChange={(e) => setJobPosition(e.target.value)}
                    list="jobRoles"
                  />
                  <datalist id="jobRoles">
                    {JOB_ROLE_SUGGESTIONS.map((role) => (
                      <option key={role} value={role} />
                    ))}
                  </datalist>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => autoSuggestTechStack(jobPosition)}
                    disabled={!jobPosition}
                    title="Auto-fill tech stack"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="my-3">
                <label className="font-bold mx-2 my-4">
                  Job Description / Tech Stack
                </label>
                <Textarea
                  placeholder="Ex: React, Node.js, MongoDB, etc"
                  value={jobDesc}
                  required
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>

              <div className="my-3">
                <label className="font-bold mx-2">Years Of Experience</label>
                <Input
                  placeholder="Ex. 5"
                  type="number"
                  max="90"
                  min="0"
                  value={jobExperience}
                  required
                  onChange={(e) => setJobExperience(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-5 justify-end mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Generating from AI
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
