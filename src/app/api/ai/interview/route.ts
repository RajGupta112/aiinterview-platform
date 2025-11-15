import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const model = google("models/gemini-1.5-flash");

export async function POST(req: Request) {
  const { transcript } = await req.json();
  const prompt = `You are an interviewer. Based on this response: "${transcript}", ask the next question.`;
  const res = await generateText({ model, prompt });
  return NextResponse.json({ nextQuestion: res.text });
}
