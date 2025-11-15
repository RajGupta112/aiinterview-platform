export type InterviewStatus = 'idle' | 'starting' | 'active' | 'stopped';

export interface TranscriptMessage {
  speaker: 'user' | 'ai';
  text: string;
}
