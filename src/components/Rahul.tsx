"use client";

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
  const bars = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div className="relative flex flex-col h-full rounded-lg bg-[#0E1613] border border-[#1F2B24] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1F2B24]">
        <span className="text-sm text-[#EAF3EE] font-medium">AI Interviewer</span>
        <span className="text-xs text-[#7C9488]">
          {isThinking ? "Thinking" : isSpeaking ? "Speaking" : "Listening"}
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center py-10">
        <div className="flex items-end gap-1.5 h-16">
          {bars.map((i) => (
            <span
              key={i}
              className="w-1.5 rounded-full bg-[#00C853]"
              style={{
                height: isSpeaking ? undefined : isThinking ? "10px" : "6px",
                animation: isSpeaking
                  ? `waveform 0.9s ease-in-out ${i * 0.09}s infinite`
                  : isThinking
                  ? `thinking 1s ease-in-out ${i * 0.12}s infinite`
                  : "none",
                opacity: isSpeaking || isThinking ? 1 : 0.35,
              }}
            />
          ))}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-[#1F2B24] min-h-[3.25rem] bg-[#0A0F0D]">
        <p className="text-sm text-[#C7D6CD] leading-snug">
          {isThinking ? "Preparing a response…" : lastAITranscript || "The interview hasn't started yet."}
        </p>
      </div>

      <style jsx>{`
        @keyframes waveform {
          0%, 100% { height: 6px; }
          50% { height: 34px; }
        }
        @keyframes thinking {
          0%, 100% { height: 6px; }
          50% { height: 14px; }
        }
      `}</style>
    </div>
  );
}