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
        className="p-10 border border-blue-400/30 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 cursor-pointer transition-all duration-300 backdrop-blur-sm group"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-center text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-cyan-300 transition-all">
          ✨ + Add New Interview
        </h2>
        <p className="text-center text-sm text-gray-400 mt-2 group-hover:text-gray-300 transition-all">
          Create a new mock interview session
        </p>
      </div>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="w-full max-w-4xl mx-4 sm:mx-auto my-12 max-h-[90vh] overflow-y-auto p-6 md:p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border border-blue-400/30 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              🎯 Start Your Interview
            </DialogTitle>
            <p className="text-sm text-gray-400 mt-2">Tell us about your target role and we'll create tailored interview questions</p>
          </DialogHeader>

          {/* Form */}
          <form onSubmit={onSubmit}>
            <div className="space-y-6">
              {/* Job Role Section */}
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-xl p-6 backdrop-blur-sm">
                <label className="font-bold text-white flex items-center gap-2 mb-3">
                  <span className="text-xl">💼</span> Job Role/Position
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Ex: Full Stack Developer"
                    value={jobPosition}
                    required
                    onChange={(e) => setJobPosition(e.target.value)}
                    list="jobRoles"
                    className="bg-slate-800/50 border-blue-400/30 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/50"
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
                    className="hover:bg-cyan-500/20 hover:text-cyan-300 text-gray-400"
                  >
                    <Sparkles className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">💡 Select from suggestions or type your role</p>
              </div>

              {/* Job Description Section */}
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-xl p-6 backdrop-blur-sm">
                <label className="font-bold text-white flex items-center gap-2 mb-3">
                  <span className="text-xl">🛠️</span> Tech Stack / Skills
                </label>
                <Textarea
                  placeholder="Ex: React, Node.js, MongoDB, TypeScript, Docker..."
                  value={jobDesc}
                  required
                  onChange={(e) => setJobDesc(e.target.value)}
                  className="bg-slate-800/50 border-blue-400/30 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/50 resize-none"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-2">💡 List the technologies and skills relevant to your role</p>
              </div>

              {/* Experience Section */}
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-xl p-6 backdrop-blur-sm">
                <label className="font-bold text-white flex items-center gap-2 mb-3">
                  <span className="text-xl">📅</span> Years of Experience
                </label>
                <Input
                  placeholder="Ex: 5"
                  type="number"
                  max="90"
                  min="0"
                  value={jobExperience}
                  required
                  onChange={(e) => setJobExperience(e.target.value)}
                  className="bg-slate-800/50 border-blue-400/30 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/50"
                />
                <p className="text-xs text-gray-500 mt-2">💡 This helps us tailor the difficulty level</p>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-blue-400/20 pb-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDialog(false)}
                disabled={loading}
                className="
                  rounded-lg px-6 py-2 font-semibold
                  border-blue-400/30 text-gray-300
                  hover:bg-blue-500/10 hover:text-cyan-300 hover:border-blue-400/50
                  cursor-pointer transition-all duration-300
                "
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="
                  bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600
                  text-white font-semibold cursor-pointer
                  rounded-lg px-6 py-2 shadow-lg shadow-cyan-500/30
                  hover:shadow-cyan-500/50 transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    <span>Generating Questions...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>🚀</span> Start Interview
                  </span>
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
