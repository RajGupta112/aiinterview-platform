"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Loader2, Video, Power, StopCircle } from "lucide-react";

/**
 * Interview page:
 * - Start Interview (opens camera + starts STT)
 * - Stop Interview (stops everything)
 * - Buttons are below the cards
 * - Conversation shows alternating messages (Adrian / Raj)
 *
 * NOTE:
 * - SpeechRecognition: use Chrome/Edge (webkitSpeechRecognition)
 * - Camera: must allow permissions; on start it will ask the browser
 */

export default function InterviewPage() {
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{ sender: "Adrian" | "Raj"; text: string }[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  // Helper: speak text using browser TTS
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    // cancel any current speech
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 1;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  };

  // Start camera (attach to video element) and keep stream ref
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      mediaStreamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera error:", err);
      alert("Unable to access camera. Please allow camera permissions.");
    }
  };

  // Stop camera and release tracks
  const stopCamera = () => {
    const s = mediaStreamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  // Setup SpeechRecognition (webkit for Chrome)
  const setupSpeechRecognition = () => {
    if (typeof window === "undefined") return null;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = false;
    recog.lang = "en-US";

    recog.onstart = () => {
      setIsListening(true);
    };

    recog.onend = () => {
      setIsListening(false);
      // recognition might end unexpectedly; if interview still active, keep it stopped
      // we don't auto-restart here to avoid double-start loops
    };

    recog.onerror = (evt: any) => {
      console.error("SpeechRecognition error:", evt);
      setIsListening(false);
    };

    recog.onresult = (event: any) => {
      const last = event.results[event.results.length - 1];
      const transcript = last[0].transcript.trim();
      if (transcript) {
        // push user's message
        setMessages((prev) => [...prev, { sender: "Raj", text: transcript }]);

        // simulate or call AI to get response
        // here we simulate with a small rule-based response for demo
        setTimeout(() => {
          const aiReply = generateAdrianReply(transcript);
          setMessages((prev) => [...prev, { sender: "Adrian", text: aiReply }]);
          speakText(aiReply);
        }, 900);
      }
    };

    recognitionRef.current = recog;
    return recog;
  };

  // generate simple simulated replies (replace with backend LLM later)
  const generateAdrianReply = (userText: string) => {
    const t = userText.toLowerCase();
    if (t.includes("project") || t.includes("work")) {
      return "Thanks — that sounds interesting. What was the biggest technical challenge and how did you solve it?";
    }
    if (t.includes("react") || t.includes("node")) {
      return "Nice — can you walk me through the architecture of that system?";
    }
    if (t.includes("hello") || t.includes("hi") || t.includes("ready")) {
      return "Great to hear. Let's begin with an overview of your most recent role.";
    }
    return "Thanks for sharing. Could you give a bit more detail on that?";
  };

  // Start interview: camera + recognition + initial greeting from Adrian
  const startInterview = async () => {
    // guard
    if (isInterviewActive) return;

    // start camera
    await startCamera();

    // setup recognition and start listening
    const recog = setupSpeechRecognition();
    if (recog) {
      try {
        recog.start();
      } catch (err) {
        // sometimes start can throw if already started; ignore
      }
    }

    // initial messages
    const greeting = "Hi Raj — I’m Adrian. Thanks for joining. Could you briefly introduce yourself?";
    setMessages([{ sender: "Adrian", text: "Hi Raj — I’m Adrian." }, { sender: "Adrian", text: "Thanks for joining. Could you briefly introduce yourself?" }]);
    speakText(greeting);

    setIsInterviewActive(true);
    setIsListening(true);
  };

  // Stop everything and cleanup
  const stopInterview = () => {
    // stop speech recognition
    try {
      const r = recognitionRef.current;
      if (r) {
        r.onresult = null;
        r.onend = null;
        r.onerror = null;
        try { r.stop(); } catch (e) {}
        recognitionRef.current = null;
      }
    } catch (err) {
      console.warn("Recognition stop error", err);
    }

    // stop camera
    stopCamera();

    // speak closing line
    const bye = "Thanks Raj. This interview session has ended.";
    setMessages((prev) => [...prev, { sender: "Adrian", text: "Thanks Raj. This interview session has ended." }]);
    speakText(bye);

    setIsInterviewActive(false);
    setIsListening(false);
  };

  // enable/disable mic explicitly (separate control if needed)
  const enableMic = () => {
    const r = recognitionRef.current || setupSpeechRecognition();
    if (!r) {
      alert("SpeechRecognition is not supported in this browser. Use Chrome or Edge.");
      return;
    }
    try {
      r.start();
      setIsListening(true);
    } catch (err) {
      console.error("recognition start error", err);
    }
  };

  const disableMic = () => {
    const r = recognitionRef.current;
    if (!r) return;
    try {
      r.stop();
      setIsListening(false);
    } catch (err) {
      console.error("recognition stop error", err);
    }
  };

  // Cleanup if component unmounts
  useEffect(() => {
    return () => {
      // cleanup recognition
      const r = recognitionRef.current;
      if (r) {
        try { r.stop(); } catch (e) {}
        recognitionRef.current = null;
      }
      stopCamera();
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-800 flex flex-col items-center p-6 md:p-10">
      {/* Cards */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Adrian (Interviewer) */}
        <Card className="bg-white/85 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-lg">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-green-200 shadow-lg">
              <Image
                src="/adrian.png" // replace with your interviewer image
                alt="Adrian"
                fill
                className={`object-cover transition-transform duration-500 ${isListening ? "scale-105" : "scale-100"}`}
              />
            </div>

            <div>
              <div className="text-lg font-semibold text-gray-900">Adrian</div>
              <div className="text-sm text-gray-600 mt-1">
                {isInterviewActive ? (isListening ? "Listening…" : "Waiting for your response") : "Ready when you are"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Raj (Candidate) */}
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-lg">
          <CardContent className="p-6 flex flex-col items-center">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-green-100 bg-black shadow-inner">
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              {/* show overlay note when inactive */}
              {!isInterviewActive && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-white/80">
                  Camera will start when interview begins
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <div className="font-semibold text-gray-900">Raj</div>
              <div className="text-sm text-gray-600 mt-1">Candidate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Start / Stop buttons below cards */}
      <div className="flex gap-4 mt-6">
        {!isInterviewActive ? (
          <Button onClick={startInterview} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-3 shadow">
            <Power className="w-4 h-4" />
            Start Interview
          </Button>
        ) : (
          <Button onClick={stopInterview} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-3 shadow">
            <StopCircle className="w-4 h-4" />
            Stop Interview
          </Button>
        )}

        {/* separate mic control optional */}
        {isInterviewActive && (
          isListening ? (
            <Button onClick={disableMic} className="flex items-center gap-2 bg-gray-200 text-gray-800 rounded-lg px-4 py-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Stop Mic
            </Button>
          ) : (
            <Button onClick={enableMic} className="flex items-center gap-2 bg-gray-200 text-gray-800 rounded-lg px-4 py-2">
              <Mic className="w-4 h-4" /> Enable Mic
            </Button>
          )
        )}
      </div>

      {/* Conversation */}
      <div className="w-full max-w-5xl mt-8 bg-white/80 backdrop-blur-sm border border-green-100 rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversation</h3>
        <div className="max-h-72 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 italic">Start the interview to see conversation here.</p>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "Adrian" ? "justify-start" : "justify-end"}`}>
                {m.sender === "Adrian" && (
                  <div className="w-8 h-8 mr-3 relative rounded-full overflow-hidden">
                    <Image src="/adrian.png" alt="Adrian" fill className="object-cover" />
                  </div>
                )}

                <div className={`px-4 py-2 rounded-2xl max-w-[70%] ${m.sender === "Adrian" ? "bg-gray-100 text-gray-800" : "bg-green-500 text-white"}`}>
                  <div className="text-xs font-semibold mb-1">{m.sender}</div>
                  <div>{m.text}</div>
                </div>

                {m.sender !== "Adrian" && (
                  <div className="w-8 h-8 ml-3 flex items-center justify-center bg-green-500 text-white rounded-full">R</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
