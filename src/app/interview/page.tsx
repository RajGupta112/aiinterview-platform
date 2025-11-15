"use client";

import React from "react";
import InterviewApp from "@/components/InterviewApp";
import Image from "next/image";

export default function Page() {
  return (
    <main className="relative min-h-screen flex items-center justify-center">

      {/* Background Image */}
      <Image
        src="/itimage.png"          // <-- Put your image in /public/itimage.jpg
        alt="Background"
        fill
        priority
        className="object-cover -z-10"
      />

      {/* Overlay for better readability (optional) */}
      <div className="absolute inset-0 bg-black/20 -z-10"></div>

      <InterviewApp />
    </main>
  );
}
