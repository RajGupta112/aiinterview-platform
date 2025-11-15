// For TypeScript to recognize webkitSpeechRecognition
interface Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

// Type for SpeechRecognition instance
type SpeechRecognitionType = typeof window.SpeechRecognition;

// Minimal type for SpeechRecognitionEvent
interface SpeechRecognitionResult {
  0: { transcript: string };
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}
