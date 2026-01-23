import { AlertTriangle, Check, X } from 'lucide-react';
import PrimaryCTAButton from '@/components/ui/PrimaryCTAButton';

interface StepCardProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  instruction: string;
  warning?: string;
  alternatives?: string[];
  onDone: () => void;
  onCant: () => void;
  isAnimating?: boolean;
}

const StepCard = ({
  stepNumber,
  totalSteps,
  title,
  instruction,
  warning,
  alternatives,
  onDone,
  onCant,
  isAnimating = false,
}: StepCardProps) => {
  return (
    <div className={`glass-card-strong p-6 md:p-8 ${isAnimating ? 'step-enter' : ''}`}>
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-primary">
          Step {stepNumber} of {totalSteps}
        </span>
      </div>

      {/* Main instruction */}
      <div className="mb-8">
        <h2 className="text-heading-2 text-foreground mb-4">
          {title}
        </h2>
        <p className="text-body-large text-muted-foreground leading-relaxed">
          {instruction}
        </p>
      </div>

      {/* Warning if present */}
      {warning && (
        <div className="mb-6 p-4 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <p className="text-sm text-warning">{warning}</p>
        </div>
      )}

      {/* Alternatives if present */}
      {alternatives && alternatives.length > 0 && (
        <div className="mb-8">
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
