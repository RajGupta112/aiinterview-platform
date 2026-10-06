"use client";

import React, { Suspense } from "react";
import InterviewApp from "@/components/InterviewApp";
import { useSearchParams } from "next/navigation";

function InterviewPageContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "General";

  return (
    <main className="min-h-screen bg-[#0A0F0D]">
      <InterviewApp role={role} />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <InterviewPageContent />
    </Suspense>
  );
}