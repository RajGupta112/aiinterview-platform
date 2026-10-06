"use client";

import React from "react";

interface UserCardProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  transcript: string;
  isListening: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  videoRef,
  transcript,
  isListening,
}) => {
  return (
    <div className="relative flex flex-col h-full rounded-lg bg-[#0E1613] border border-[#1F2B24] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1F2B24]">
        <span className="text-sm text-[#EAF3EE] font-medium">You</span>
        {isListening && (
          <span className="flex items-center gap-1.5 text-xs text-[#00C853]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse" />
            Listening
          </span>
        )}
      </div>

      <div className="relative flex-1 bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
        />
      </div>

      <div className="px-4 py-3 border-t border-[#1F2B24] min-h-[3.25rem] bg-[#0A0F0D]">
        <p className="text-sm text-[#C7D6CD] leading-snug italic">
          {transcript || "Your last answer will appear here."}
        </p>
      </div>
    </div>
  );
};

export default UserCard;