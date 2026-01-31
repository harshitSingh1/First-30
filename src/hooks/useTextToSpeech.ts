import { useState, useCallback, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UseTextToSpeechReturn {
  speak: (text: string) => Promise<void>;
  stop: () => void;
  isLoading: boolean;
  isSpeaking: boolean;
  error: string | null;
}

export const useTextToSpeech = (): UseTextToSpeechReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { language: currentLanguage } = useLanguage();

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async (text: string) => {
    // Stop any currently playing audio
    stop();
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ 
            text, 
            language: currentLanguage 
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        setError('Failed to play audio');
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      setIsSpeaking(true);
      await audio.play();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to generate speech';
      setError(message);
      console.error('TTS Error:', e);
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage, stop]);

  return { speak, stop, isLoading, isSpeaking, error };
};
