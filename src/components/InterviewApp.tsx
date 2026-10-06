"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { TranscriptEntry } from "@/lib/index";
import UserCard from "@/components/UserCard";
import Solution from "@/components/Rahul";
import TranscriptLog from "@/components/TranscriptLog";
import { sendMessage } from "@/lib/ai";

/* -------------------- InterviewApp Component -------------------- */
type InterviewAppProps = {
  role?: string;
};

const InterviewApp: React.FC<InterviewAppProps> = ({ role = "General" }) => {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [lastAITranscript, setLastAITranscript] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);
  const transcriptRef = useRef<TranscriptEntry[]>([]);
  const savedRef = useRef(false);

  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);

  const [mediaReady, setMediaReady] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const [resumeSummary, setResumeSummary] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("resumeInterviewContext");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.summary) setResumeSummary(parsed.summary);
      }
    } catch {}
  }, []);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const shouldListenRef = useRef(false);

  /* -------------------- Setup speech synthesis -------------------- */
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  /* -------------------- Preview camera/mic before interview starts -------------------- */
  useEffect(() => {
    let cancelled = false;

    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setMediaReady(true);
      })
      .catch(() => {
        if (!cancelled) setMediaError("Camera or microphone access was denied.");
      });

    return () => {
      cancelled = true;
      if (streamRef.current && !transcriptRef.current.length) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  /* -------------------- Reattach the live stream whenever the visible <video> element swaps -------------------- */
  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isInterviewStarted, transcript.length]);

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

    recognition.onstart = () => {
      console.log("[recognition] started");
      setIsListening(true);
    };

    recognition.onend = () => {
      console.log("[recognition] ended, shouldListen =", shouldListenRef.current);
      setIsListening(false);
      if (shouldListenRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch {}
        }, 300);
      }
    };

    recognition.onerror = (event: any) => {
      console.log("[recognition] error:", event?.error);
      if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
        setMediaError("Microphone access was denied.");
        shouldListenRef.current = false;
        return;
      }
      if (event?.error === "aborted") return;

      try {
        recognitionRef.current?.stop();
      } catch {}
      if (shouldListenRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch {}
        }, 800);
      }
    };

    recognition.onresult = async (event: any) => {
      if (!shouldListenRef.current) return;

      const lastResult = event.results[event.results.length - 1];
      const text = lastResult[0].transcript.trim();
      console.log("[recognition] result:", text);
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
        console.log("[recognition] start() called");
      }
    } catch (e) {
      console.log("[recognition] start() failed:", e);
    }
  };

  /* -------------------- Handle AI Response -------------------- */
  const handleAIResponse = async (userText: string) => {
    setIsThinking(true);

    try {
      const aiResponse = await sendMessage(userText, transcript, role, resumeSummary);
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

  const speechKeepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speechFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSpeechTimers = () => {
    if (speechKeepAliveRef.current) {
      clearInterval(speechKeepAliveRef.current);
      speechKeepAliveRef.current = null;
    }
    if (speechFallbackRef.current) {
      clearTimeout(speechFallbackRef.current);
      speechFallbackRef.current = null;
    }
  };

  const speakText = (text: string) => {
    if (!synthRef.current) return;

    window.speechSynthesis.cancel();
    clearSpeechTimers();

    try {
      recognitionRef.current?.stop();
    } catch {}

    shouldListenRef.current = false;

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;

    const maleVoice = pickMaleVoice();
    if (maleVoice) utter.voice = maleVoice;

    const finishSpeaking = () => {
      clearSpeechTimers();
      setIsSpeaking(false);
      shouldListenRef.current = true;
      startListening();
    };

    utter.onstart = () => {
      console.log("[speech] started");
      setIsSpeaking(true);

      speechKeepAliveRef.current = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 5000);

      const estimatedMs = Math.max(4000, text.length * 90);
      speechFallbackRef.current = setTimeout(() => {
        console.log("[speech] onend never fired — forcing finish");
        window.speechSynthesis.cancel();
        finishSpeaking();
      }, estimatedMs + 6000);
    };

    utter.onend = () => {
      console.log("[speech] ended normally");
      finishSpeaking();
    };

    utter.onerror = (e) => {
      console.log("[speech] error:", e);
      finishSpeaking();
    };

    synthRef.current.speak(utter);
  };

  /* -------------------- Start Camera -------------------- */
  const startCamera = async () => {
    if (streamRef.current) {
      if (videoRef.current) videoRef.current.srcObject = streamRef.current;
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {}
  };

  /* -------------------- Start Interview -------------------- */
  const startInterview = async () => {
    savedRef.current = false;
    setResult(null);
    setIsInterviewStarted(true);
    setElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    await startCamera();
    initRecognition();

    const greeting = resumeSummary
      ? `Hello! I've had a look at your resume — let's dive right in. Tell me a bit about the most recent project you worked on.`
      : `Hello! I'll be conducting your ${role} interview today. To start, tell me a little about your background and what draws you to this role.`;

    setTranscript([{ speaker: "ai", text: greeting, timestamp: new Date() }]);
    setLastAITranscript(greeting);

    speakText(greeting);
  };

  /* -------------------- Stop Interview -------------------- */
  const stopInterview = async () => {
    setIsInterviewStarted(false);
    shouldListenRef.current = false;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    window.speechSynthesis.cancel();
    clearSpeechTimers();

    try {
      recognitionRef.current?.stop();
    } catch {}

    const stream = streamRef.current;
    stream?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;

    const finalTranscript = transcriptRef.current;
    if (finalTranscript.length > 0 && !savedRef.current) {
      savedRef.current = true;
      setIsSaving(true);
      try {
        const res = await fetch("/api/interview/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role, messages: finalTranscript }),
        });
        if (res.ok) {
          const data = await res.json();
          setResult({ score: data.score, feedback: data.feedback });
        }
      } catch (e) {
        console.error("Failed to save interview:", e);
      } finally {
        setIsSaving(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopInterview();
    };
  }, []);

  /* -------------------- Helpers -------------------- */
  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  /* -------------------- Render -------------------- */

  if (result && !isSaving) {
    const scoreColor =
      result.score >= 70 ? "#00C853" : result.score >= 40 ? "#EAB308" : "#EF4444";
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (Math.max(0, Math.min(100, result.score)) / 100) * circumference;

    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center space-y-6">
          <p className="text-sm text-[#7C9488]">Session report</p>
          <h1 className="text-2xl font-semibold text-[#EAF3EE]">
            {role} interview complete
          </h1>

          <div className="flex justify-center py-4">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 120 120" className="w-36 h-36 -rotate-90">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#1F2B24" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold text-[#EAF3EE]">{result.score}</span>
                <span className="text-xs text-[#7C9488]">out of 100</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-[#C7D6CD] leading-relaxed text-left bg-[#121A16] border border-[#1F2B24] rounded-lg p-4">
            {result.feedback}
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#EAF3EE] border border-[#1F2B24] hover:bg-[#121A16] transition-colors"
            >
              Back to dashboard
            </button>
            <button
              onClick={startInterview}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-black bg-[#00C853] hover:bg-[#00b34b] transition-colors"
            >
              Practice again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2B24]">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-sm text-[#7C9488] hover:text-[#EAF3EE] transition-colors">← Dashboard</a>
          <span className="w-px h-4 bg-[#1F2B24]" />
          <div className="flex items-center gap-2">
            {isInterviewStarted && (
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
            )}
            <span className="text-sm font-medium text-[#EAF3EE]">{role} interview</span>
            {resumeSummary && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0B3D22] text-[#00C853] font-medium">
                Resume-based
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isInterviewStarted && (
            <span className="font-mono text-sm text-[#7C9488]">{formatElapsed(elapsed)}</span>
          )}

          {isInterviewStarted && (
            <button
              onClick={stopInterview}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-[#EF4444] hover:bg-[#dc2626] transition-colors"
            >
              Stop interview
            </button>
          )}
        </div>
      </div>

      {!isInterviewStarted && !isSaving && transcript.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
          <div className="w-full max-w-md space-y-6 text-center">
            <div>
              <h1 className="text-xl font-semibold text-[#EAF3EE]">Ready to begin?</h1>
              <p className="text-sm text-[#7C9488] mt-1.5">
                Check your camera and microphone, then start whenever you're ready.
              </p>
            </div>

            <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-[#1F2B24]">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
              />
              {!mediaReady && !mediaError && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-[#7C9488] bg-[#0A0F0D]">
                  Waiting for camera…
                </div>
              )}
              {mediaError && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-[#EF4444] px-6 text-center bg-[#0A0F0D]">
                  {mediaError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-5">
              <span
                className={`flex items-center gap-1.5 text-xs ${
                  mediaReady ? "text-[#00C853]" : "text-[#7C9488]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    mediaReady ? "bg-[#00C853]" : "bg-[#7C9488]"
                  }`}
                />
                Camera
              </span>
              <span
                className={`flex items-center gap-1.5 text-xs ${
                  mediaReady ? "text-[#00C853]" : "text-[#7C9488]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    mediaReady ? "bg-[#00C853]" : "bg-[#7C9488]"
                  }`}
                />
                Microphone
              </span>
            </div>

            <button
              onClick={startInterview}
              className="w-full px-5 py-3 rounded-lg text-sm font-medium text-black bg-[#00C853] hover:bg-[#00b34b] transition-colors"
            >
              Start interview
            </button>
          </div>
        </div>
      )}

      {(isInterviewStarted || transcript.length > 0) && (
        <>
          {/* Video / AI tiles */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-6 min-h-[420px]">
            <div
              className={`rounded-lg transition-shadow duration-300 ${
                isListening ? "ring-1 ring-[#00C853]/60 shadow-[0_0_24px_-6px_rgba(0,200,83,0.5)]" : ""
              }`}
            >
              <UserCard videoRef={videoRef} transcript={currentTranscript} isListening={isListening} />
            </div>
            <div
              className={`rounded-lg transition-shadow duration-300 ${
                isSpeaking ? "ring-1 ring-[#00C853]/60 shadow-[0_0_24px_-6px_rgba(0,200,83,0.5)]" : ""
              }`}
            >
              <Solution isSpeaking={isSpeaking} isThinking={isThinking} lastAITranscript={lastAITranscript} />
            </div>
          </div>

          {/* Transcript drawer */}
          <div className="border-t border-[#1F2B24]">
            <button
              onClick={() => setShowTranscript((v) => !v)}
              className="w-full flex items-center justify-between px-6 py-3 text-sm text-[#7C9488] hover:text-[#EAF3EE] transition-colors"
            >
              <span>Transcript ({transcript.length})</span>
              <span>{showTranscript ? "Hide" : "Show"}</span>
            </button>
            {showTranscript && (
              <div className="border-t border-[#1F2B24]">
                <TranscriptLog transcript={transcript} />
              </div>
            )}
          </div>
        </>
      )}

      {isSaving && (
        <div className="flex-1 flex items-center justify-center px-6">
          <p className="text-sm text-[#7C9488]">Generating your feedback…</p>
        </div>
      )}
    </div>
  );
};

export default InterviewApp;