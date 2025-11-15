"use client";

import { PlayIcon, StopIcon } from "./Icons";

interface ControlsProps {
  isInterviewStarted: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function Control({
  isInterviewStarted,
  onStart,
  onStop,
}: ControlsProps) {
  return (
    <div className="flex justify-center space-x-6">
      {!isInterviewStarted ? (
        <button
          onClick={onStart}
          className="flex items-center justify-center px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all duration-300 transform hover:scale-105"
        >
          <PlayIcon className="w-6 h-6 mr-2" />
          Start Interview
        </button>
      ) : (
        <button
          onClick={onStop}
          className="flex items-center justify-center px-8 py-4 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/50 transition-all duration-300 transform hover:scale-105"
        >
          <StopIcon className="w-6 h-6 mr-2" />
          Stop Interview
        </button>
      )}
    </div>
  );
}
