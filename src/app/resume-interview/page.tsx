"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Loader2 } from "lucide-react";

export default function ResumeInterviewPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!file) {
      setError("Please choose a PDF resume first.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("role", role);

      const res = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      sessionStorage.setItem(
        "resumeInterviewContext",
        JSON.stringify({ summary: data.summary, role: data.role })
      );

      router.push(`/interview?role=${encodeURIComponent(data.role)}&resume=1`);
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg mb-4">
        <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">← Back to dashboard</a>
      </div>
      <Card className="w-full max-w-lg bg-white border border-orange-100 shadow-md rounded-2xl">
        <CardContent className="p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Resume Interview</h1>
            <p className="text-gray-600 text-sm mt-2">
              Upload your resume and the AI will ask questions tailored specifically to
              your experience, skills, and projects.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Target role <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="w-full px-3.5 py-2.5 rounded-lg border border-orange-100 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave blank and the AI will pick the best-fit role from your resume.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Resume (PDF)</label>
            <label
              htmlFor="resume-upload"
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-orange-200 rounded-xl py-8 cursor-pointer hover:bg-orange-50 transition-colors"
            >
              {file ? (
                <>
                  <FileText className="w-8 h-8 text-orange-500" />
                  <span className="text-sm text-gray-700 font-medium">{file.name}</span>
                  <span className="text-xs text-gray-400">Click to choose a different file</span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-orange-400" />
                  <span className="text-sm text-gray-600">Click to upload your resume</span>
                  <span className="text-xs text-gray-400">PDF only</span>
                </>
              )}
            </label>
            <input
              id="resume-upload"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing resume…
              </span>
            ) : (
              "Analyze & start interview"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}