export const sendMessage = async (
  userMessage: string,
  history: any[] = [],
  role: string = "General",
  resumeSummary: string = ""
) => {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        history,
        role,
        resumeSummary,
      }),
    });

    const data = await res.json();
    return data.text;
  } catch (err) {
    console.error("❌ AI ERROR:", err);
    return "I encountered an error. Please repeat that.";
  }
};