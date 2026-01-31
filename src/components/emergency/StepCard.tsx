import { useState } from 'react';
import { AlertTriangle, Check, X, Phone, Timer, Heart } from 'lucide-react';
import PrimaryCTAButton from '@/components/ui/PrimaryCTAButton';
import { QuickQuestion } from '@/types/emergency';
import { Button } from '@/components/ui/button';

interface StepCardProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  instruction: string;
  warning?: string;
  alternatives?: string[];
  quickQuestion?: QuickQuestion;
  actionButton?: {
    label: string;
    action: 'cpr' | 'call911' | 'timer';
  };
  onDone: () => void;
  onCant: () => void;
  onQuickAnswer?: (questionId: string, question: string, answer: string) => void;
  onActionButton?: (action: 'cpr' | 'call911' | 'timer') => void;
  isAnimating?: boolean;
}

const StepCard = ({
  stepNumber,
  totalSteps,
  title,
  instruction,
  warning,
  alternatives,
  quickQuestion,
  actionButton,
  onDone,
  onCant,
  onQuickAnswer,
  onActionButton,
  isAnimating = false,
}: StepCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleQuickAnswer = (value: string, label: string) => {
    setSelectedAnswer(value);
    if (quickQuestion && onQuickAnswer) {
      onQuickAnswer(quickQuestion.id, quickQuestion.question, label);
    }
  };

  const actionIcons = {
    cpr: Heart,
    call911: Phone,
    timer: Timer,
  };

  return (
    <div className={`premium-card p-6 md:p-8 ${isAnimating ? 'step-enter' : ''}`}>
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-primary">
          Step {stepNumber} of {totalSteps}
        </span>
      </div>

      {/* Main instruction */}
      <div className="mb-6">
        <h2 className="text-heading-2 text-foreground mb-4">
          {title}
        </h2>
        <p className="text-body-large text-muted-foreground leading-relaxed whitespace-pre-line">
          {instruction}
        </p>
      </div>

      {/* Warning if present - using amber instead of red */}
      {warning && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-300">{warning}</p>
        </div>
      )}

      {/* Action button if present */}
      {actionButton && (
        <div className="mb-6">
          <Button
            onClick={() => onActionButton?.(actionButton.action)}
            className={`w-full h-14 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 ${
              actionButton.action === 'call911' 
                ? 'bg-blue-600 hover:bg-blue-600/90 text-white' 
                : actionButton.action === 'cpr'
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground glow-primary'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            {(() => {
              const Icon = actionIcons[actionButton.action];
              return <Icon className="w-5 h-5" />;
            })()}
            {actionButton.label}
          </Button>
        </div>
      )}

      {/* Quick question if present */}
      {quickQuestion && (
        <div className="mb-6 p-4 rounded-xl bg-card border border-border">
          <p className="text-sm font-medium text-foreground mb-3">{quickQuestion.question}</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleQuickAnswer(option.value, option.label)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedAnswer === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-foreground hover:bg-secondary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Alternatives if present */}
      {alternatives && alternatives.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">Alternatives:</p>
          <ul className="space-y-1">
            {alternatives.map((alt, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                {alt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <PrimaryCTAButton
          variant="success"
          size="large"
          fullWidth
          icon={Check}
          onClick={onDone}
        >
          Done
        </PrimaryCTAButton>
        <PrimaryCTAButton
          variant="secondary"
          size="large"
          fullWidth
          icon={X}
          onClick={onCant}
        >
          I can't do this
        </PrimaryCTAButton>
      </div>
    </div>
  );
};

export default StepCard;
