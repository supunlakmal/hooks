import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechSynthesisOptions {
  lang?: string;
  pitch?: number; // 0 to 2
  rate?: number; // 0.1 to 10
  voice?: SpeechSynthesisVoice;
  volume?: number; // 0 to 1
}

interface UseSpeechSynthesisReturn {
  /** Indicates if the Speech Synthesis API is supported by the browser. */
  isSupported: boolean;
  /** List of available voices. Might be empty initially and populate asynchronously. */
  voices: SpeechSynthesisVoice[];
  /** Boolean indicating if speech is currently in progress. */
  speaking: boolean;
  /** Function to initiate speech synthesis for the given text. */
  speak: (text: string, options?: SpeechSynthesisOptions) => void;
  /** Function to immediately stop any ongoing speech. */
  cancel: () => void;
  /** The error object if voices failed to load or speech failed. */
  error: Error | null;
}

const isBrowser = typeof window !== 'undefined';
const synth = isBrowser ? window.speechSynthesis : undefined;

/**
 * Hook to utilize the browser's Speech Synthesis API (Text-to-Speech).
 * Provides controls to speak text, cancel speech, list available voices, and track status.
 *
 * @returns An object with speech synthesis state and control functions.
 */
export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const isSupported = !!synth;
  // Ref to hold the utterance instance to prevent stale closures in callbacks
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const updateVoices = useCallback(() => {
    if (isSupported) {
      try {
        const availableVoices = synth?.getVoices() || [];
        setVoices(availableVoices);
        setError(null); // Clear previous error if voices load now
      } catch (err) {
        console.error('Error getting voices:', err);
        setError(
          err instanceof Error ? err : new Error('Failed to get voices')
        );
      }
    }
  }, [isSupported]);

  // Load voices initially and update when the voices list changes
  useEffect(() => {
    if (!isSupported) return;

    updateVoices(); // Initial attempt

    // Voices might load asynchronously, listen for changes
    synth?.addEventListener('voiceschanged', updateVoices);

    return () => {
      synth?.removeEventListener('voiceschanged', updateVoices);
      // Cancel any ongoing speech on unmount
      if (utteranceRef.current) {
        synth?.cancel();
      }
    };
  }, [isSupported, updateVoices]);

  const speak = useCallback(
    (text: string, options: SpeechSynthesisOptions = {}) => {
      if (!isSupported || speaking) return; // Not supported or already speaking

      // Cancel previous utterance if any (shouldn't be needed if speaking state is accurate, but safe)
      synth?.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance; // Store ref

      // Apply options
      utterance.voice = options.voice || null;
      utterance.lang = options.lang || voices[0]?.lang || 'en-US'; // Default lang
      utterance.pitch = options.pitch ?? 1;
      utterance.rate = options.rate ?? 1;
      utterance.volume = options.volume ?? 1;

      utterance.onstart = () => {
        setSpeaking(true);
        setError(null);
      };

      utterance.onend = () => {
        setSpeaking(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setError(new Error(`Speech error: ${event.error}`));
        setSpeaking(false);
        utteranceRef.current = null;
      };

      try {
        synth?.speak(utterance);
      } catch (err) {
        console.error('Error calling synth.speak:', err);
        setError(
          err instanceof Error ? err : new Error('Failed to initiate speech')
        );
        setSpeaking(false); // Ensure speaking is false if speak fails immediately
        utteranceRef.current = null;
      }
    },
    [isSupported, speaking, voices]
  ); // voices needed for default lang

  const cancel = useCallback(() => {
    if (!isSupported || !speaking) return;
    synth?.cancel();
    // Note: onend will fire after cancel, which sets speaking to false.
    // Explicitly setting here might cause a race condition if onend hasn't fired yet.
    // Relying on the onend handler is generally safer.
    // setSpeaking(false); // Let onend handle this
  }, [isSupported, speaking]);

  return {
    isSupported,
    voices,
    speaking,
    speak,
    cancel,
    error,
  };
}
