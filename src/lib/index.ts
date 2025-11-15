export interface TranscriptEntry {
  speaker: "user" | "ai";
  text: string;
  timestamp: Date;
}
