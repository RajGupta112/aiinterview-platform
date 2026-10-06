import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractPdfText } from "@/lib/extractPdfText";

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetRole = String(formData.get("role") || "").trim();

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Please upload your resume as a PDF." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const resumeText = (await extractPdfText(buffer)).slice(0, 12000); // cap length sent to the model

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: "Couldn't read any text from that PDF. Try a different file." },
        { status: 400 }
      );
    }

    let summary = "";
    let suggestedRole = targetRole;

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const prompt = `Here is a candidate's resume text:

${resumeText}

${targetRole ? `The candidate wants to interview for a "${targetRole}" role.` : "No target role was given — infer the best-fit role from the resume."}

Respond with ONLY a raw JSON object (no markdown, no code fences) in this exact shape:
{"role": "<best-fit job title for this resume>", "summary": "<6-9 sentence summary covering years of experience, core skills/technologies, key projects, and notable achievements — written so an interviewer can use it to ask specific, personalized questions about this exact candidate>"}`;

        const result = await model.generateContent(prompt);
        const raw = result.response.text().trim();
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const json = JSON.parse(cleaned);

        summary = typeof json.summary === "string" ? json.summary : "";
        suggestedRole = typeof json.role === "string" ? json.role : targetRole || "General";
      } catch (e) {
        console.error("Resume summarization error:", e);
        summary = resumeText.slice(0, 1500);
        suggestedRole = targetRole || "General";
      }
    } else {
      summary = resumeText.slice(0, 1500);
      suggestedRole = targetRole || "General";
    }

    return NextResponse.json({ role: suggestedRole, summary });
  } catch (err) {
    console.error("/api/resume/parse error:", err);
    return NextResponse.json(
      { error: "Failed to process resume. Please try again." },
      { status: 500 }
    );
  }
}
