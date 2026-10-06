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
    <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
      {transcript.map((entry, index) => (
        <div
          key={index}
          className={`flex items-start gap-2.5 ${
            entry.speaker === "user" ? "justify-end" : ""
          }`}
        >
          {entry.speaker === "ai" && (
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#0B3D22] text-[#00C853] flex items-center justify-center text-xs font-semibold">
              AI
            </div>
          )}
          <div
            className={`px-3.5 py-2.5 rounded-lg max-w-lg ${
              entry.speaker === "ai"
                ? "bg-[#121A16] border border-[#1F2B24]"
                : "bg-[#0B3D22]/40 border border-[#1F2B24]"
            }`}
          >
            <p className="text-sm text-[#EAF3EE] leading-snug">{entry.text}</p>
            <p className="text-[10px] text-[#7C9488] text-right mt-1">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </p>
          </div>
          {entry.speaker === "user" && (
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#1F2B24] text-[#EAF3EE] flex items-center justify-center text-xs font-semibold">
              You
            </div>
          )}
        </div>
      ))}
      <div ref={endOfLogRef} />
    </div>
  );
}