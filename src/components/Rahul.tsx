"use client";

import { BrainCircuitIcon } from "@/components/Icons";

interface AICardProps {
  isSpeaking: boolean;
  isThinking: boolean;
  lastAITranscript: string;
}

export default function Solution({
  isSpeaking,
  isThinking,
  lastAITranscript,
}: AICardProps) {
  const avatarClasses = `
    w-48 h-48 rounded-full flex items-center justify-center 
    bg-indigo-900/50 border-4 border-indigo-500 
    transition-all duration-300 
    ${isSpeaking ? "animate-pulse shadow-2xl shadow-indigo-500/50" : ""} 
    ${isThinking ? "shadow-2xl shadow-sky-500/50" : ""}
  `;

  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 flex flex-col shadow-lg border border-gray-700 backdrop-blur-sm">
      <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-300">
        AI Interviewer
      </h2>

      <div className="flex-grow flex items-center justify-center mb-4">
        <div className={avatarClasses}>
          <BrainCircuitIcon
            className={`w-24 h-24 text-indigo-300 transition-transform duration-500 
              ${isSpeaking ? "scale-110" : ""} 
              ${isThinking ? "animate-spin" : ""}`}
          />
        </div>
      </div>

      <div className="flex-grow bg-gray-900/70 p-4 rounded-lg min-h-[6rem] border border-gray-600">
        <p className="text-gray-200">
          {isThinking ? "Thinking..." : lastAITranscript}
        </p>
      </div>
    </div>
  );
}
