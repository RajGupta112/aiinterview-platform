"use client";
import React from "react";

// 🎙 Microphone
export const MicrophoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 7.5v-1.5a6 6 0 00-6-6v-1.5a6 6 0 00-6 6v1.5m6 7.5a6 6 0 006-6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a3 3 0 003-3v-3a3 3 0 00-6 0v3a3 3 0 003 3z" />
  </svg>
);

// 🧠 Brain / AI Circuit
export const BrainCircuitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5a6.375 6.375 0 00-6.375 6.375c0 1.954.834 3.736 2.158 5.058a.75.75 0 001.06-1.06A4.875 4.875 0 018.625 10.875 4.875 4.875 0 0113.5 6a.75.75 0 000-1.5A6.375 6.375 0 0012 4.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5a6.375 6.375 0 016.375 6.375c0 1.954-.834 3.736-2.158 5.058a.75.75 0 01-1.06-1.06A4.875 4.875 0 0015.375 10.875a4.875 4.875 0 00-4.875-4.875.75.75 0 010-1.5z" />
  </svg>
);

// ▶️ Play
export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
  </svg>
);

// ⏹ Stop
export const StopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
  </svg>
);

// 👤 USER ICON
export const IconUser: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 20.25a8.25 8.25 0 0115 0"
    />
  </svg>
);

// 🤖 ROBOT ICON
export const IconRobot: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 2.25v3M9 4.5h6M4.5 10.5h15M6 10.5v8.25a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 18.75V10.5M9 14.25h.008v.008H9v-.008zM15 14.25h.008v.008H15v-.008z"
    />
  </svg>
);
