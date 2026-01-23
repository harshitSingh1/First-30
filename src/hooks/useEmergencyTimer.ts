import { useState, useEffect, useCallback, useRef } from 'react';

interface UseEmergencyTimerReturn {
  elapsedTime: number;
  formattedTime: string;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  toggle: () => void;
}

export const useEmergencyTimer = (autoStart = true): UseEmergencyTimerReturn => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(autoStart ? Date.now() : 0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedTime * 1000;
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        setElapsedTime(elapsed);
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setElapsedTime(0);
    startTimeRef.current = Date.now();
  }, []);

  const toggle = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    isRunning,
    start,
    stop,
    reset,
    toggle,
  };
};

// CPR-specific timer with rhythm tracking
interface UseCPRTimerReturn extends UseEmergencyTimerReturn {
  compressionCount: number;
  breathCount: number;
  cycleCount: number;
  isCompressionPhase: boolean;
  bpm: number;
}

export const useCPRTimer = (): UseCPRTimerReturn => {
  const timer = useEmergencyTimer(false);
  const [compressionCount, setCompressionCount] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [isCompressionPhase, setIsCompressionPhase] = useState(true);
  
  const bpm = 110; // Target: 100-120 BPM
  const compressionsPerCycle = 30;
  const breathsPerCycle = 2;

  // Calculate cycle count
  const cycleCount = Math.floor(compressionCount / compressionsPerCycle);

  // Increment compression
  const addCompression = useCallback(() => {
    setCompressionCount((prev) => prev + 1);
    // After 30 compressions, switch to breath phase
    if ((compressionCount + 1) % compressionsPerCycle === 0) {
      setIsCompressionPhase(false);
    }
  }, [compressionCount]);

  // Increment breath
  const addBreath = useCallback(() => {
    setBreathCount((prev) => prev + 1);
    // After 2 breaths, switch back to compression phase
    if ((breathCount + 1) % breathsPerCycle === 0) {
      setIsCompressionPhase(true);
    }
  }, [breathCount]);

  return {
    ...timer,
    compressionCount,
    breathCount,
    cycleCount,
    isCompressionPhase,
    bpm,
  };
};
