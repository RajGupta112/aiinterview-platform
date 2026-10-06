// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_API_KEY not set on server");
}

const genAI = new GoogleGenerativeAI(apiKey);

function buildSystemInstruction(
  role: string,
  exchangeCount: number,
  resumeSummary: string
) {
  const stage =
    exchangeCount === 0
      ? "This is the very first exchange — keep it as a warm, brief opener."
      : exchangeCount < 3
      ? "You're early in the interview — keep questions approachable."
      : exchangeCount < 7
      ? "You're in the main part of the interview — this is where most of the depth should come from."
      : "You're near the end — start wrapping up naturally within the next reply or two.";

  const resumeBlock = resumeSummary
    ? `\n\nThe candidate's resume summary (use this to ask specific, personalized questions about their actual projects, technologies, and experience — don't just ask generic role questions):\n${resumeSummary}`
    : "";

  return `You are an experienced, friendly human interviewer conducting a realistic mock interview for a "${role}" position. Never mention that you are an AI or a language model, and never break character.

How to behave:
- Ask exactly ONE question at a time. Never stack multiple questions in a single message.
- Before asking the next question, briefly react to what the candidate just said in one short sentence (e.g. acknowledge, gently correct, or show interest) — the way a real interviewer naturally would, not a scripted evaluator.
- Tailor every question specifically to the "${role}" role — mix practical technical questions, realistic scenarios someone in that role would face, and the occasional behavioral question.
- If an answer is vague, incomplete, or avoids the question, ask a natural follow-up probing question instead of moving straight to a new topic.
- Vary difficulty naturally based on how the candidate is doing — don't follow a rigid script.
- Keep responses short and conversational: 2 to 4 sentences, like real spoken dialogue, never an essay or a bulleted list.
- Do not explain how you are scoring or evaluating the candidate at any point.

Pacing: ${stage}${resumeBlock}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const message: string = String(body?.message || "");
    const historyRaw: any[] = Array.isArray(body?.history) ? body.history : [];
    const role: string = String(body?.role || "General");
    const resumeSummary: string = String(body?.resumeSummary || "");

    if (!message.trim()) {
      return NextResponse.json(
        { text: "Message is required." },
        { status: 400 }
      );
    }

    const history = historyRaw.map((item: any) => ({
      role: item.speaker === "ai" ? "model" : "user",
      parts: [{ text: item.text || "" }],
    }));

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: buildSystemInstruction(role, historyRaw.length, resumeSummary),
    });

    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    });

    let result;
    let lastErr: any;
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        result = await chat.sendMessage(message);
        lastErr = null;
        break;
      } catch (err: any) {
        lastErr = err;
        const status = err?.status || err?.response?.status;

        if (status === 503 && attempt < maxAttempts) {
          console.warn(`Gemini overloaded, retrying (${attempt}/${maxAttempts})...`);
          await new Promise((r) => setTimeout(r, attempt * 1500));
          continue;
        }

        break;
      }
    }

    if (lastErr) {
      const status = lastErr?.status || lastErr?.response?.status;

      if (status === 429) {
        console.error("Gemini quota/rate limit error:", lastErr);
        return NextResponse.json(
          { text: "AI quota or rate limit exceeded. Please wait a bit and try again." },
          { status: 429 }
        );
      }

      if (status === 503) {
        console.error("Gemini overloaded after retries:", lastErr);
        return NextResponse.json(
          { text: "The AI service is busy right now. Please try again in a few seconds." },
          { status: 503 }
        );
      }

      console.error("Gemini API error:", lastErr);
      return NextResponse.json(
        { text: "AI service error. Please try again later." },
        { status: 502 }
      );
    }

    let text = "";
    try {
      text = await result.response.text();
    } catch (e) {
      console.error("Failed extracting text:", e);
    }

    if (!text) {
      text = "I couldn't generate a response. Try again.";
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