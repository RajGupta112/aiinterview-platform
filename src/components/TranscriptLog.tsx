"use client";

import { useRef, useEffect } from "react";
import { type TranscriptEntry } from "../lib/index";

interface TranscriptLogProps {
  transcript: TranscriptEntry[];
}

export default function TranscriptLog({ transcript }: TranscriptLogProps) {
  const endOfLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfLogRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  if (transcript.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow-lg border border-gray-700 backdrop-blur-sm">
      <h3 className="text-xl font-semibold p-4 border-b border-gray-600 text-black-200">
        Conversation Log
      </h3>
      <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
        {transcript.map((entry, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              entry.speaker === "user" ? "justify-end" : ""
            }`}
          >
            {entry.speaker === "ai" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold">
                AI
              </div>
            )}
            <div
              className={`p-3 rounded-lg max-w-lg ${
                entry.speaker === "ai" ? "bg-indigo-100" : "bg-green-100"
              }`}
            >
              <p className="text-sm text-black-200">{entry.text}</p>
              <p className="text-xs text-black-400 text-right mt-1">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </p>
            </div>
            {entry.speaker === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold">
                You
              </div>
            )}
          </div>
        ))}
        <div ref={endOfLogRef} />
      </div>
    </div>
  );
}
