// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use a server-only env var (do NOT expose API key with NEXT_PUBLIC)
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_API_KEY not set on server");
}

const genAI = new GoogleGenerativeAI(apiKey);

// System prompt for interviewer
const systemInstruction = `
You are an expert technical interviewer.
Behave like a human interviewer — clear, patient, and helpful.
Always answer the user's question first, then ask ONE follow-up question.
Stay on topic and keep responses short and conversational.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const message: string = String(body?.message || "");
    const historyRaw: any[] = Array.isArray(body?.history) ? body.history : [];

    if (!message.trim()) {
      return NextResponse.json(
        { text: "Message is required." },
        { status: 400 }
      );
    }

    // Convert frontend chat history → Gemini format
    const history = historyRaw.map((item: any) => ({
      role: item.speaker === "ai" ? "model" : "user",
      parts: [{ text: item.text || "" }],
    }));

    // Initialize model with system instruction
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction,
    });

    // Start chat session with history + generation config
    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    });

    let result;
    try {
      // This is where the 429 is thrown
      result = await chat.sendMessage(message);
    } catch (err: any) {
      const status = err?.status || err?.response?.status;

      // Handle quota / rate limit
      if (status === 429) {
        console.error("Gemini quota/rate limit error:", err);
        return NextResponse.json(
          {
            text:
              "AI quota or rate limit exceeded. Please wait a bit and try again.",
          },
          { status: 429 }
        );
      }

      console.error("Gemini API error:", err);
      return NextResponse.json(
        {
          text: "AI service error. Please try again later.",
        },
        { status: 502 }
      );
    }

    // Extract text safely
    let text = "";
    try {
      text = await result.response.text();
    } catch (e) {
      console.error("Failed extracting text:", e);
    }

    if (!text) {
      text = "I couldn’t generate a response. Try again.";
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error("/api/chat error:", err);
    return NextResponse.json(
      { text: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
