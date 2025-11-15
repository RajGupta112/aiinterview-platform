import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
  throw new Error("NEXT_PUBLIC_GOOGLE_API_KEY not set");
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);

const systemInstruction =
  "You are a helpful technical interviewer. Keep responses short and conversational. Ask one question at a time.";

export const initializeChat = async () => {
  console.log("🚀 Initializing chat with Gemini...");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction,
  });

  const chat = model.startChat({
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 512,
    },
  });

  console.log("✅ Chat initialized successfully");
  return chat;
};

export const sendMessage = async (chat: any, userMessage: string) => {
  try {
    console.log("📤 Sending message to Gemini:", userMessage);

    const result = await chat.sendMessage(userMessage);
    const text = await result.response.text();

    console.log("📥 AI Response:", text);
    return text;
  } catch (err) {
    console.error("❌ CRITICAL ERROR:", err);
    return "I encountered an error. Please repeat that.";
  }
};
