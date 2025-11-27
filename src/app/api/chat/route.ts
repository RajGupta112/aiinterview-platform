// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY not set on server");
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);

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

    // Convert frontend chat history → Gemini format
    const history = historyRaw.map((item: any) => ({
      role: item.speaker === "ai" ? "model" : "user",
      parts: [{ text: item.text || "" }],
    }));

    // Initialize model with system instruction
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
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

    // Send new user message
    const result = await chat.sendMessage(message);

    // Extract text safely
    let text = "";
    try {
      text = await result.response.text();
    } catch (e) {
      console.error("⚠️ Failed extracting text:", e);
    }

    if (!text) {
      text = "I couldn’t generate a response. Try again.";
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error("❌ /api/chat error:", err);
    return NextResponse.json(
      { text: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
