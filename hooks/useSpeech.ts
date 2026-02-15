/* Web Speech API をラップした簡易フック */

import { useEffect, useRef, useState } from "react";

// Minimal interface for Web Speech API (not in TypeScript's DOM lib)
interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: { results: { length: number; [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  onend: (() => void) | null;
}

// SpeechRecognition is not in TypeScript's Window interface (browser-specific API)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win = typeof window !== "undefined" ? (window as any) : null;
const SpeechRecognitionImpl = win ? (win.SpeechRecognition || win.webkitSpeechRecognition) ?? null : null;

export function useSpeechRecognition(lang: string = "en-US") {
  const [isSupported] = useState<boolean>(() => !!SpeechRecognitionImpl);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    if (!SpeechRecognitionImpl) return;

    const recognition = new SpeechRecognitionImpl() as SpeechRecognitionInstance;
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i += 1) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [lang]);

  const start = () => {
    if (!recognitionRef.current) return;
    setTranscript("");
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stop = () => {
    recognitionRef.current?.stop();
  };

  return {
    isSupported,
    isListening,
    transcript,
    start,
    stop
  };
}

