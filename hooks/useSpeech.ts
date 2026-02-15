/* Web Speech API をラップした簡易フック */

import { useEffect, useRef, useState } from "react";

// SpeechRecognition is not in TypeScript's Window interface (browser-specific API)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win = typeof window !== "undefined" ? (window as any) : null;
const SpeechRecognitionImpl = win ? (win.SpeechRecognition || win.webkitSpeechRecognition) ?? null : null;

export function useSpeechRecognition(lang: string = "en-US") {
  const [isSupported] = useState<boolean>(() => !!SpeechRecognitionImpl);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!SpeechRecognitionImpl) return;

    const recognition = new SpeechRecognitionImpl();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let text = "";
      for (let i = 0; i < event.results.length; i += 1) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition as SpeechRecognition;

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

