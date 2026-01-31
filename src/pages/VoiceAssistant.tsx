import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, 
  RotateCcw, 
  ListOrdered, 
  Volume2, 
  VolumeX, 
  AlertTriangle,
  Keyboard,
  Send
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useVoiceIntake } from '@/hooks/useVoiceIntake';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import VoiceMicButton from '@/components/voice/VoiceMicButton';
import VoiceIntakeTranscript from '@/components/voice/VoiceIntakeTranscript';
import VoiceIntakeSummary from '@/components/voice/VoiceIntakeSummary';
import VoiceQuestionCard from '@/components/voice/VoiceQuestionCard';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const VoiceAssistant = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  
  // Speech Recognition
  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition(language);

  // Voice Intake Logic
  const {
    currentQuestion,
    summary,
    suggestedCategory,
    suggestedRoute,
    processUserResponse,
    answerWithOption,
    reset: resetIntake,
  } = useVoiceIntake();

  // Text to Speech
  const { speak, stop: stopSpeaking, isLoading: isSpeaking } = useTextToSpeech();

  // Local state
  const [messages, setMessages] = useState<Message[]>([]);
  const [readQuestionsAloud, setReadQuestionsAloud] = useState(false);
  const [readInstructionsAloud, setReadInstructionsAloud] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing'>('idle');
  const [showTextInput, setShowTextInput] = useState(false);

  const lastTranscriptLength = useRef(0);
  const hasAskedInitialQuestion = useRef(false);

  // Update status based on listening state
  useEffect(() => {
    if (isListening) {
      setStatus('listening');
    } else if (interimTranscript) {
      setStatus('processing');
    } else {
      setStatus('idle');
    }
  }, [isListening, interimTranscript]);

  // Ask initial question when component mounts
  useEffect(() => {
    if (!hasAskedInitialQuestion.current && currentQuestion) {
      hasAskedInitialQuestion.current = true;
      const questionText = t(currentQuestion.questionKey);
      
      // Add assistant message
      const assistantMessage: Message = {
        id: `assistant-initial`,
        type: 'assistant',
        text: questionText,
        timestamp: new Date(),
      };
      setMessages([assistantMessage]);

      // Speak the question if enabled
      if (readQuestionsAloud) {
        speak(questionText);
      }
    }
  }, [currentQuestion, t, readQuestionsAloud, speak]);

  // Process new transcript entries
  useEffect(() => {
    if (transcript.length > lastTranscriptLength.current) {
      const newEntries = transcript.slice(lastTranscriptLength.current);
      
      newEntries.forEach((entry) => {
        // Add user message
        const userMessage: Message = {
          id: entry.id,
          type: 'user',
          text: entry.text,
          timestamp: entry.timestamp,
        };
        setMessages((prev) => [...prev, userMessage]);

        // Process the response
        processUserResponse(entry.text);
      });

      lastTranscriptLength.current = transcript.length;
    }
  }, [transcript, processUserResponse]);

  // When question changes, add assistant message and optionally speak
  const prevQuestionRef = useRef(currentQuestion?.id);
  useEffect(() => {
    if (currentQuestion && currentQuestion.id !== prevQuestionRef.current) {
      prevQuestionRef.current = currentQuestion.id;
      const questionText = t(currentQuestion.questionKey);

      const assistantMessage: Message = {
        id: `assistant-${currentQuestion.id}-${Date.now()}`,
        type: 'assistant',
        text: questionText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      if (readQuestionsAloud) {
        speak(questionText);
      }
    }
  }, [currentQuestion, t, readQuestionsAloud, speak]);

  const handleMicClick = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const handleRestart = useCallback(() => {
    resetTranscript();
    resetIntake();
    setMessages([]);
    lastTranscriptLength.current = 0;
    hasAskedInitialQuestion.current = false;
    stopSpeaking();
  }, [resetTranscript, resetIntake, stopSpeaking]);

  const handleTextSubmit = useCallback(() => {
    if (!textInput.trim()) return;

    const userMessage: Message = {
      id: `text-${Date.now()}`,
      type: 'user',
      text: textInput.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    processUserResponse(textInput.trim());
    setTextInput('');
  }, [textInput, processUserResponse]);

  const handleSpeakQuestion = useCallback(() => {
    if (currentQuestion) {
      speak(t(currentQuestion.questionKey));
    }
  }, [currentQuestion, t, speak]);

  const getStatusText = () => {
    switch (status) {
      case 'listening':
        return t('voice.listening');
      case 'processing':
        return t('voice.processing');
      default:
        return t('voice.answerNext');
    }
  };

  return (
    <Layout showEmergencyBanner={true}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t('voice.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('voice.subtitle')}
          </p>
        </div>

        {/* Main Mic Button */}
        <div className="flex flex-col items-center mb-8">
          <VoiceMicButton
            isListening={isListening}
            isProcessing={status === 'processing'}
            isSupported={isSupported}
            onClick={handleMicClick}
            size="lg"
          />
          
          {/* Status Text */}
          <p className={cn(
            'mt-4 text-lg font-medium transition-colors',
            isListening ? 'text-primary' : 'text-muted-foreground'
          )}>
            {getStatusText()}
          </p>

          {/* Speech not supported warning */}
          {!isSupported && (
            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 max-w-md text-center">
              <AlertTriangle className="w-5 h-5 text-amber-500 mx-auto mb-2" />
              <p className="text-sm text-amber-400">{t('voice.notSupported')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('voice.typeFallback')}</p>
            </div>
          )}

          {/* Speech Error */}
          {speechError && (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 max-w-md text-center">
              <p className="text-sm text-amber-400">Error: {speechError}</p>
            </div>
          )}
        </div>

        {/* Current Question Card */}
        {currentQuestion && (
          <div className="max-w-2xl mx-auto mb-8">
            <VoiceQuestionCard
              question={currentQuestion}
              onOptionSelect={answerWithOption}
              onSpeak={handleSpeakQuestion}
              isSpeaking={isSpeaking}
            />
          </div>
        )}

        {/* Text Input Fallback */}
        <div className="max-w-2xl mx-auto mb-8">
          {showTextInput ? (
            <div className="flex gap-2">
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your response..."
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
              />
              <Button onClick={handleTextSubmit} disabled={!textInput.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setShowTextInput(true)}
              className="w-full text-muted-foreground"
            >
              <Keyboard className="w-4 h-4 mr-2" />
              Type instead of speaking
            </Button>
          )}
        </div>

        {/* Split Panel: Transcript + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left: Transcript */}
          <div className="premium-card p-6 min-h-[400px]">
            <VoiceIntakeTranscript
              messages={messages}
              interimTranscript={interimTranscript}
              isListening={isListening}
            />
          </div>

          {/* Right: Summary */}
          <div className="premium-card p-6 min-h-[400px]">
            <VoiceIntakeSummary
              summary={summary}
              suggestedCategory={suggestedCategory}
              suggestedRoute={suggestedRoute}
            />
          </div>
        </div>

        {/* Voice Settings */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="premium-card p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {readQuestionsAloud ? (
                    <Volume2 className="w-4 h-4 text-primary" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">{t('voice.readQuestions')}</span>
                  <Switch
                    checked={readQuestionsAloud}
                    onCheckedChange={setReadQuestionsAloud}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {readInstructionsAloud ? (
                    <Volume2 className="w-4 h-4 text-primary" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">{t('voice.readInstructions')}</span>
                  <Switch
                    checked={readInstructionsAloud}
                    onCheckedChange={setReadInstructionsAloud}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            variant="destructive"
            size="lg"
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={() => window.open('tel:112')}
          >
            <Phone className="w-5 h-5" />
            {t('flow.call')}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={handleRestart}
          >
            <RotateCcw className="w-5 h-5" />
            {t('voice.restart')}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => navigate('/citizen')}
          >
            <ListOrdered className="w-5 h-5" />
            {t('voice.switchManual')}
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            ⚠️ {t('voice.disclaimer')}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default VoiceAssistant;
