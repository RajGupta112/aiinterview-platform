"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { TranscriptEntry } from "@/lib/index";
import UserCard from "@/components/UserCard";
import Solution from "@/components/Rahul";
import TranscriptLog from "@/components/TranscriptLog";
import { sendMessage } from "@/lib/ai";

/* -------------------- Controls Component -------------------- */
const Controls: React.FC<{
  isInterviewStarted: boolean;
  onStart: () => void;
  onStop: () => void;
}> = ({ isInterviewStarted, onStart, onStop }) => {
  return (
    <div className="flex items-center gap-4">
      {!isInterviewStarted && (
        <button
          onClick={onStart}
          className="
            px-8 py-3 rounded-xl font-semibold text-gray-800 shadow-md
            bg-gradient-to-br from-green-50 to-white border border-green-200
            hover:from-green-100 hover:to-white hover:shadow-lg 
            transition-all duration-300
          "
        >
          Start Interview
        </button>
      )}

      {isInterviewStarted && (
        <button
          onClick={onStop}
          className="
            px-8 py-3 rounded-xl font-semibold text-white shadow-md
            bg-gradient-to-br from-red-500 via-red-400 to-red-300
            hover:from-red-600 hover:via-red-500 hover:to-red-400
            hover:shadow-xl transition-all duration-300
          "
        >
          Stop Interview
        </button>
      )}
    </div>
  );
};

/* -------------------- InterviewApp Component -------------------- */
const InterviewApp: React.FC = () => {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [lastAITranscript, setLastAITranscript] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const shouldListenRef = useRef(false);

  /* -------------------- Setup speech synthesis -------------------- */
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  /* -------------------- Initialize speech recognition -------------------- */
  const initRecognition = useCallback(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition not supported.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onerror = () => {
      recognitionRef.current?.stop();
      setTimeout(() => recognitionRef.current?.start(), 800);
    };

    recognition.onresult = async (event: any) => {
      if (!shouldListenRef.current) return;

      const lastResult = event.results[event.results.length - 1];
      const text = lastResult[0].transcript.trim();
      if (!text) return;

      setCurrentTranscript(text);
      setTranscript((prev) => [...prev, { speaker: "user", text, timestamp: new Date() }]);

      shouldListenRef.current = false;
      await handleAIResponse(text);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    try {
      if (recognitionRef.current && !isListening) {
        recognitionRef.current.start();
        shouldListenRef.current = true;
      }
    } catch {}
  };

  /* -------------------- Handle AI Response -------------------- */
  const handleAIResponse = async (userText: string) => {
    setIsThinking(true);

    try {
      const aiResponse = await sendMessage(userText, transcript); // <-- IMPORTANT!!
      setIsThinking(false);
      setLastAITranscript(aiResponse);

      setTranscript((prev) => [...prev, { speaker: "ai", text: aiResponse, timestamp: new Date() }]);

      speakText(aiResponse);
    } catch (e) {
      setIsThinking(false);
    }
  };

  /* -------------------- Pick Male Voice -------------------- */
  const pickMaleVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const priority = [
      "Google UK English Male",
      "Google US English",
      "Google English",
      "Microsoft David",
      "Microsoft Mark",
      "Daniel",
      "Alex",
    ];

    for (const p of priority) {
      const v = voices.find((x) => x.name.includes(p));
      if (v) return v;
    }

    const male = voices.find((v) => v.name.toLowerCase().includes("male"));
    return male || voices[0];
  };

  const speakText = (text: string) => {
    if (!synthRef.current) return;

    window.speechSynthesis.cancel();

    try {
      recognitionRef.current?.stop();
    } catch {}

    shouldListenRef.current = false;

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;

    const maleVoice = pickMaleVoice();
    if (maleVoice) utter.voice = maleVoice;

    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => {
      setIsSpeaking(false);
      shouldListenRef.current = true;
      startListening();
    };

    synthRef.current.speak(utter);
  };

  /* -------------------- Start Camera -------------------- */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {}
  };

  /* -------------------- Start Interview -------------------- */
  const startInterview = async () => {
    setIsInterviewStarted(true);
    await startCamera();
    initRecognition();

    const greeting =
      "Hello! I’m your AI interview assistant. Please introduce yourself and tell me what type of interview you'd like to practice.";

    setTranscript([{ speaker: "ai", text: greeting, timestamp: new Date() }]);
    setLastAITranscript(greeting);

    speakText(greeting);
  };

  /* -------------------- Stop Interview -------------------- */
  const stopInterview = () => {
    setIsInterviewStarted(false);
    shouldListenRef.current = false;

    window.speechSynthesis.cancel();

    try {
      recognitionRef.current?.stop();
    } catch {}

    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  useEffect(() => () => stopInterview(), []);

  /* -------------------- Render -------------------- */
  return (
    <div className="flex flex-col items-center gap-6 p-6 w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-300 mb-4 text-center">AI Interview Platform</h1>

      <Controls
        isInterviewStarted={isInterviewStarted}
        onStart={startInterview}
        onStop={stopInterview}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="rounded-2xl shadow-xl p-4 bg-white">
          <UserCard videoRef={videoRef} transcript={currentTranscript} isListening={isListening} />
        </div>

        <div className="rounded-2xl shadow-xl p-4 bg-white">
          <Solution
            isSpeaking={isSpeaking}
            isThinking={isThinking}
            lastAITranscript={lastAITranscript}
          />
        </div>
      </div>

      <div className="w-full mt-4 rounded-2xl shadow-xl p-4 bg-gradient-to-br from-blue-100 via-blue-50 to-white">
        <TranscriptLog transcript={transcript} />
      </div>
    </div>
  );
};

export default InterviewApp;
