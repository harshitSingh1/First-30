import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { getEmergencyCategories } from '@/data/emergencyFlows';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mic, 
  MicOff, 
  Send, 
  ArrowLeft, 
  Volume2, 
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuggestedCategory {
  id: string;
  category: string;
  confidence: number;
}

interface ImmediateStep {
  number: number;
  instruction: string;
}

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, isLoading: isSpeaking, isSpeaking: isPlaying, stop } = useTextToSpeech();
  
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestedCategories, setSuggestedCategories] = useState<SuggestedCategory[]>([]);
  const [immediateSteps, setImmediateSteps] = useState<ImmediateStep[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const categories = getEmergencyCategories();

  // Simple keyword-based matching (in production, this would use AI)
  const analyzeEmergency = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    const matches: SuggestedCategory[] = [];

    const keywordMap: Record<string, string[]> = {
      'bleeding': ['bleeding', 'blood', 'cut', 'wound', 'laceration'],
      'unconscious': ['unconscious', 'not responding', 'fainted', 'collapsed', 'passed out'],
      'breathing': ['breathing', 'asthma', 'can\'t breathe', 'suffocating', 'inhaler'],
      'chest-pain': ['chest pain', 'heart attack', 'heart', 'crushing', 'cardiac'],
      'stroke': ['stroke', 'face drooping', 'slurred speech', 'arm weakness'],
      'choking': ['choking', 'can\'t swallow', 'food stuck', 'airway blocked'],
      'burns': ['burn', 'fire', 'scalded', 'hot water'],
      'seizure': ['seizure', 'convulsion', 'epilepsy', 'shaking', 'fit'],
      'fracture': ['fracture', 'broken bone', 'sprain', 'twisted', 'swollen'],
      'head-injury': ['head injury', 'concussion', 'hit head', 'fell'],
      'poison': ['poison', 'chemical', 'swallowed', 'overdose', 'toxic'],
      'allergy': ['allergic', 'anaphylaxis', 'epipen', 'swelling', 'hives'],
      'fever': ['fever', 'temperature', 'hot', 'chills'],
      'electric': ['electric shock', 'electrocuted', 'lightning'],
      'drowning': ['drowning', 'water', 'pool', 'not breathing underwater'],
    };

    Object.entries(keywordMap).forEach(([categoryId, keywords]) => {
      const matchCount = keywords.filter(kw => lowerText.includes(kw)).length;
      if (matchCount > 0) {
        const category = categories.find(c => c.id === categoryId);
        if (category) {
          matches.push({
            id: categoryId,
            category: category.category,
            confidence: Math.min(matchCount * 30, 95),
          });
        }
      }
    });

    // Sort by confidence and take top 3
    return matches.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
  }, [categories]);

  // Generate immediate steps based on category
  const getImmediateSteps = useCallback((categoryId: string): ImmediateStep[] => {
    const stepsMap: Record<string, ImmediateStep[]> = {
      'bleeding': [
        { number: 1, instruction: 'Apply direct pressure to the wound with a clean cloth' },
        { number: 2, instruction: 'Call emergency services if bleeding is severe' },
        { number: 3, instruction: 'Keep pressure for at least 10-15 minutes' },
      ],
      'unconscious': [
        { number: 1, instruction: 'Check if the person is responsive - tap and shout' },
        { number: 2, instruction: 'Call emergency services immediately' },
        { number: 3, instruction: 'Check for breathing and prepare for CPR if needed' },
      ],
      'chest-pain': [
        { number: 1, instruction: 'Call emergency services immediately - do not drive' },
        { number: 2, instruction: 'Have the person sit or lie down comfortably' },
        { number: 3, instruction: 'Give aspirin if not allergic and no bleeding issues' },
      ],
      'choking': [
        { number: 1, instruction: 'Ask if they can cough - encourage coughing if yes' },
        { number: 2, instruction: 'If severe, give 5 back blows between shoulder blades' },
        { number: 3, instruction: 'Alternate with 5 abdominal thrusts if needed' },
      ],
    };

    return stepsMap[categoryId] || [
      { number: 1, instruction: 'Ensure the area is safe for you to help' },
      { number: 2, instruction: 'Call emergency services if situation is serious' },
      { number: 3, instruction: 'Stay calm and follow step-by-step guidance' },
    ];
  }, []);

  const handleSubmit = useCallback(() => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const matches = analyzeEmergency(input);
      setSuggestedCategories(matches);
      
      if (matches.length > 0) {
        const steps = getImmediateSteps(matches[0].id);
        setImmediateSteps(steps);
      }
      
      setHasAnalyzed(true);
      setIsProcessing(false);
    }, 1000);
  }, [input, analyzeEmergency, getImmediateSteps]);

  const handleVoiceInput = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    
    recognition.start();
  }, []);

  const handleSpeakSteps = useCallback(() => {
    if (isPlaying) {
      stop();
      return;
    }
    const text = immediateSteps.map(s => `Step ${s.number}: ${s.instruction}`).join('. ');
    speak(text);
  }, [immediateSteps, speak, stop, isPlaying]);

  const handleReset = () => {
    setInput('');
    setSuggestedCategories([]);
    setImmediateSteps([]);
    setHasAnalyzed(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pb-24 max-w-2xl">
        {/* Header */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/citizen')}
          className="mb-6 text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('flow.back')}
        </Button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/15 flex items-center justify-center">
            <Mic className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-heading-2 text-foreground mb-2">{t('citizen.voice')}</h1>
          <p className="text-muted-foreground">
            Describe the emergency situation and get immediate guidance
          </p>
        </div>

        {/* Input Section */}
        <div className="premium-card p-5 mb-6">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what's happening... e.g., 'Someone is choking and can't breathe'"
            className="min-h-[120px] resize-none bg-secondary/30 border-border/50 mb-4"
          />
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleVoiceInput}
              disabled={isListening}
              className={cn(
                'flex-1 gap-2',
                isListening && 'bg-primary/10 border-primary text-primary'
              )}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 animate-pulse" />
                  Listening...
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Speak
                </>
              )}
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={!input.trim() || isProcessing}
              className="flex-1 gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Results */}
        {hasAnalyzed && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Suggested Categories */}
            {suggestedCategories.length > 0 ? (
              <div className="premium-card p-5">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Suggested Emergency Types
                </h3>
                
                <div className="space-y-3">
                  {suggestedCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => navigate(`/emergency/${cat.id}`)}
                      className="w-full p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{cat.category}</p>
                          <p className="text-sm text-muted-foreground">
                            {cat.confidence}% match
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="premium-card p-5 text-center">
                <AlertCircle className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Couldn't determine the emergency type. Please provide more details or select from the emergency list.
                </p>
                <Button variant="outline" onClick={() => navigate('/citizen')} className="mt-4">
                  View All Emergencies
                </Button>
              </div>
            )}

            {/* Immediate Steps */}
            {immediateSteps.length > 0 && (
              <div className="premium-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Immediate Steps</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSpeakSteps}
                    className="gap-1"
                  >
                    <Volume2 className={cn('w-4 h-4', isPlaying && 'text-primary')} />
                    {isPlaying ? 'Stop' : 'Listen'}
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {immediateSteps.map((step) => (
                    <div key={step.number} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">{step.number}</span>
                      </div>
                      <p className="text-foreground pt-1">{step.instruction}</p>
                    </div>
                  ))}
                </div>

                {suggestedCategories.length > 0 && (
                  <Button 
                    onClick={() => navigate(`/emergency/${suggestedCategories[0].id}`)}
                    className="w-full mt-4"
                  >
                    Start Full Guidance
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            )}

            {/* Reset */}
            <Button variant="outline" onClick={handleReset} className="w-full">
              Describe Another Emergency
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VoiceAssistant;
