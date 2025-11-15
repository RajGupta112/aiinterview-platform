"use client";

import React, { useRef, useEffect } from "react";

interface InterviewCardProps {
  title: string;
  isAI: boolean;
  isSpeaking?: boolean;
  stream?: MediaStream | null;
  icon: React.ReactNode;
}

export const InterviewCard: React.FC<InterviewCardProps> = ({
  title,
  isAI,
  isSpeaking,
  stream,
  icon,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div
      className={`relative aspect-video rounded-xl overflow-hidden shadow-2xl p-2
      transition-all duration-300
      bg-gradient-to-br from-blue-100 via-blue-50 to-white
      ${isSpeaking ? "ring-4 ring-cyan-400 ring-offset-4" : "ring-2 ring-blue-200"}`}
    >
      {/* Title */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2
                      bg-black/60 text-white px-3 py-1.5 rounded-lg">
        {icon}
        <span className="font-medium">{title}</span>
      </div>

      {/* AI CARD */}
      {isAI ? (
        <div className="w-full h-full flex items-center justify-center relative">

          {/* Soft overlay so gradient remains visible */}
          <div className="absolute inset-0 bg-white backdrop-blur-[1px] rounded-xl"></div>

          <div className="relative w-40 h-40 z-10">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-cyan-500/40"
                style={{
                  transform: `scale(${isSpeaking ? 1 + i * 0.5 : 0.8})`,
                  opacity: isSpeaking ? 1 - i * 0.3 : 0.4,
                  animation: isSpeaking ? "pulse 2s ease-in-out infinite" : "none",
                  animationDelay: `${i * 300}ms`,
                }}
              />
            ))}

            {/* AI Center Glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-tr
                from-cyan-400 to-purple-500 transition-transform duration-500
                ${isSpeaking ? "scale-110" : "scale-100"}`}
              />
            </div>
          </div>

          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.2; }
            }
          `}</style>
        </div>
      ) : (
        /* USER VIDEO */
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover rounded-xl transform -scale-x-100"
        />
      )}

      {/* Soft fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </div>
  );
};