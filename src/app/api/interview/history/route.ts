import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sessions = await prisma.interviewSession.findMany({
      where: { userId: session.user.id },
      orderBy: { startedAt: "desc" },
      select: { id: true, role: true, startedAt: true, endedAt: true, score: true, feedback: true },
    });

    return NextResponse.json({ sessions });
  } catch (err) {
    console.error("/api/interview/history error:", err);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}