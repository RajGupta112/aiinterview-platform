import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

type TranscriptEntry = {
  speaker: "user" | "ai";
  text: string;
  timestamp?: string;
};

async function generateFeedback(
  role: string,
  messages: TranscriptEntry[]
): Promise<{ score: number; feedback: string }> {
  // Fallback if AI key missing or transcript too short
  if (!genAI || messages.filter((m) => m.speaker === "user").length === 0) {
    return {
      score: 0,
      feedback: "Not enough conversation to generate feedback.",
    };
  }

  const transcriptText = messages
    .map((m) => `${m.speaker === "ai" ? "Interviewer" : "Candidate"}: ${m.text}`)
    .join("\n");

  const prompt = `You are an expert interview coach reviewing a mock interview transcript for a "${role || "General"}" role.

Transcript:
${transcriptText}

Evaluate the candidate's performance. Respond with ONLY a raw JSON object (no markdown, no code fences) in this exact shape:
{"score": <integer 0-100>, "feedback": "<3-5 sentence written feedback covering strengths, weaknesses, and one concrete suggestion for improvement>"}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      score: typeof parsed.score === "number" ? parsed.score : 0,
      feedback: typeof parsed.feedback === "string" ? parsed.feedback : "",
    };
  } catch (err) {
    console.error("Feedback generation error:", err);
    return {
      score: 0,
      feedback: "Feedback could not be generated automatically for this session.",
    };
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const role: string = body?.role || "General";
    const messages: TranscriptEntry[] = Array.isArray(body?.messages)
      ? body.messages
      : [];

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "No transcript provided" },
        { status: 400 }
      );
    }

    const { score, feedback } = await generateFeedback(role, messages);

    const saved = await prisma.interviewSession.create({
      data: {
        userId: session.user.id,
        role,
        endedAt: new Date(),
        messages: messages as any,
        score,
        feedback,
      },
    });

    return NextResponse.json({
      id: saved.id,
      score: saved.score,
      feedback: saved.feedback,
    });
  } catch (err) {
    console.error("/api/interview/save error:", err);
    return NextResponse.json(
      { error: "Failed to save interview" },
      { status: 500 }
    );
  }
}