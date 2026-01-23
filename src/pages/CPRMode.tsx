import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SafetyAlertBanner from '@/components/emergency/SafetyAlertBanner';
import { useEmergencyTimer } from '@/hooks/useEmergencyTimer';
import { ArrowLeft, Phone, Heart, Users, Volume2, VolumeX, Square, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CPRMode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo;
  
  const { formattedTime, isRunning, toggle, reset, start } = useEmergencyTimer(false);
  const [compressionCount, setCompressionCount] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [isCompressionPhase, setIsCompressionPhase] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSwitchReminder, setShowSwitchReminder] = useState(false);
  
  const audioContext = useRef<AudioContext | null>(null);
  const beatInterval = useRef<NodeJS.Timeout | null>(null);

  const BPM = 110; // Target: 100-120 BPM, we use 110 as middle ground
  const beatIntervalMs = (60 / BPM) * 1000;

  const playBeep = useCallback(() => {
    if (!soundEnabled || !audioContext.current) return;
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.frequency.value = isCompressionPhase ? 800 : 400;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.1);
    
    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + 0.1);
  }, [soundEnabled, isCompressionPhase]);

  useEffect(() => {
    // Initialize audio context on first interaction
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    return () => {
      if (beatInterval.current) {
        clearInterval(beatInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      beatInterval.current = setInterval(() => {
        playBeep();
        setCompressionCount(prev => prev + 1);
      }, beatIntervalMs);
    } else {
      if (beatInterval.current) {
        clearInterval(beatInterval.current);
      }
    }

    return () => {
      if (beatInterval.current) {
        clearInterval(beatInterval.current);
      }
    };
  }, [isRunning, beatIntervalMs, playBeep]);

  // Switch rescuer reminder every 2 minutes
  useEffect(() => {
    if (isRunning) {
      const reminderInterval = setInterval(() => {
        setShowSwitchReminder(true);
        setTimeout(() => setShowSwitchReminder(false), 5000);
      }, 120000); // 2 minutes

      return () => clearInterval(reminderInterval);
    }
  }, [isRunning]);

  // Handle phase switching (30 compressions, 2 breaths)
  useEffect(() => {
    if (isCompressionPhase && compressionCount > 0 && compressionCount % 30 === 0) {
      setIsCompressionPhase(false);
    }
  }, [compressionCount, isCompressionPhase]);

  const handleBreath = () => {
    setBreathCount(prev => prev + 1);
    if (breathCount + 1 >= 2) {
      setIsCompressionPhase(true);
    }
  };

  const handleBack = () => {
    if (returnTo) {
      navigate(returnTo);
    } else {
      navigate(-1);
    }
  };

  const handleStop = () => {
    if (beatInterval.current) {
      clearInterval(beatInterval.current);
    }
    toggle();
  };

  const cycleCount = Math.floor(compressionCount / 30);

  return (
    <Layout showHeader={false}>
      <div className="container mx-auto px-4 py-4 pb-24 max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-muted-foreground"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>

        <h1 className="text-heading-1 text-foreground text-center mb-4">CPR Mode</h1>
        
        {/* Critical warning */}
        <SafetyAlertBanner 
          variant="danger" 
          message="If you haven't already, call 911 immediately!" 
        />

        {/* Switch rescuer reminder */}
        {showSwitchReminder && (
          <div className="mt-4 animate-pulse">
            <SafetyAlertBanner 
              variant="warning" 
              message="2 minutes passed - Switch rescuer if possible to prevent fatigue!" 
            />
          </div>
        )}

        {/* Timer Display */}
        <div className="glass-card-strong p-6 mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Elapsed Time</p>
          <div className="text-5xl md:text-6xl font-mono font-bold text-foreground tracking-tight">
            {formattedTime}
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="glass-card-strong p-6 mt-4">
          <div className="flex justify-center mb-4">
            <div className={`
              w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300
              ${isCompressionPhase 
                ? 'bg-emergency/20 border-4 border-emergency' 
                : 'bg-primary/20 border-4 border-primary'}
              ${isRunning ? 'animate-heartbeat' : ''}
            `}>
              <Heart className={`w-14 h-14 ${isCompressionPhase ? 'text-emergency' : 'text-primary'}`} />
            </div>
          </div>

          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-foreground">
              {isCompressionPhase ? '30 Compressions' : '2 Rescue Breaths'}
            </p>
            <p className="text-lg text-muted-foreground mt-1">
              {isCompressionPhase 
                ? `Push hard & fast (${BPM}/min)` 
                : 'Tilt head, lift chin, give breath'}
            </p>
          </div>

          {/* Breath buttons when in breath phase */}
          {!isCompressionPhase && (
            <div className="flex justify-center gap-4 mb-4">
              <Button
                onClick={handleBreath}
                className="h-16 px-8 bg-primary hover:bg-primary/90 rounded-xl text-lg"
              >
                Breath Given ({breathCount}/2)
              </Button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="glass-card p-3">
              <p className="text-2xl font-bold text-foreground">{compressionCount}</p>
              <p className="text-xs text-muted-foreground">Compressions</p>
            </div>
            <div className="glass-card p-3">
              <p className="text-2xl font-bold text-foreground">{breathCount}</p>
              <p className="text-xs text-muted-foreground">Breaths</p>
            </div>
            <div className="glass-card p-3">
              <p className="text-2xl font-bold text-foreground">{cycleCount}</p>
              <p className="text-xs text-muted-foreground">Cycles</p>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 mt-6">
          <Button
            onClick={isRunning ? handleStop : start}
            className={`flex-1 h-16 rounded-xl text-xl font-bold ${
              isRunning 
                ? 'bg-warning hover:bg-warning/90 text-warning-foreground' 
                : 'bg-success hover:bg-success/90 text-success-foreground glow-success'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="w-6 h-6 mr-2" />
                Stop CPR
              </>
            ) : (
              <>
                <Play className="w-6 h-6 mr-2" />
                Start CPR
              </>
            )}
          </Button>
        </div>

        {/* Instructions card */}
        <div className="glass-card p-4 mt-6">
          <h3 className="font-semibold text-foreground mb-2">Remember:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Push hard: at least 2 inches deep</li>
            <li>• Push fast: 100-120 compressions/minute</li>
            <li>• Let chest fully rise between compressions</li>
            <li>• Minimize interruptions</li>
          </ul>
        </div>

        {/* Switch rescuer reminder */}
        <div className="glass-card p-4 mt-4 flex items-center gap-3">
          <Users className="w-6 h-6 text-primary flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Switch every 2 minutes</strong> if another person can help. This prevents fatigue and maintains effective compressions.
          </p>
        </div>

        {/* Emergency call button */}
        <div className="mt-6">
          <Button 
            className="w-full h-14 bg-emergency hover:bg-emergency/90 rounded-xl text-lg font-semibold" 
            asChild
          >
            <a href="tel:911">
              <Phone className="w-5 h-5 mr-2" />
              Call 911
            </a>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CPRMode;
