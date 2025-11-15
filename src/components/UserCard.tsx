"use client";

import React from "react";
import { MicrophoneIcon } from "@/components/Icons";

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
    <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-white rounded-2xl p-6 
                    flex flex-col shadow-lg border border-gray-300 backdrop-blur-sm">

      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">You</h2>

      <div className="relative w-full aspect-video bg-white/30 rounded-lg overflow-hidden mb-4 border border-blue-200 shadow-sm">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full object-cover transform scale-x-[-1]"
        ></video>

        {isListening && (
          <div className="absolute bottom-4 right-4 bg-red-500 rounded-full p-3 animate-pulse">
            <MicrophoneIcon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      <div className="flex-grow bg-white/60 p-4 rounded-lg min-h-[6rem] border border-blue-200 shadow-inner">
        <p className="text-slate-700 italic">{transcript || "..."}</p>
      </div>
    </div>
  );
};

export default UserCard;
