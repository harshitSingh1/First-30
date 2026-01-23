import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProgressBar from '@/components/emergency/ProgressBar';
import StepCard from '@/components/emergency/StepCard';
import SafetyAlertBanner from '@/components/emergency/SafetyAlertBanner';
import { useEmergencyFlow } from '@/hooks/useEmergencyFlow';
import { useEmergencyTimer } from '@/hooks/useEmergencyTimer';
import { ArrowLeft, RotateCcw, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const EmergencyFlow = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showInitialQuestions, setShowInitialQuestions] = useState(true);
  const [initialAnswers, setInitialAnswers] = useState<Record<string, string>>({});
  
  const { 
    flow, 
    currentStep, 
    currentStepIndex, 
    totalSteps, 
    isLastStep, 
    isFirstStep,
    goToNextStep, 
    goToPreviousStep,
    skipCurrentStep,
    resetFlow,
    addInput,
    getSummaryData 
  } = useEmergencyFlow(category || '');
  
  const { formattedTime, elapsedTime } = useEmergencyTimer(true);

  if (!flow || !currentStep) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-heading-1 text-foreground mb-4">Emergency not found</h1>
          <Button onClick={() => navigate('/citizen')}>Go back</Button>
        </div>
      </Layout>
    );
  }

  // Handle initial questions
  if (showInitialQuestions && flow.initialQuestions && flow.initialQuestions.length > 0) {
    const allAnswered = flow.initialQuestions.every(q => initialAnswers[q.id]);
    
    return (
      <Layout showHeader={false}>
        <div className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/citizen')} 
            className="text-muted-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          <h1 className="text-heading-2 text-primary mb-2">{flow.category}</h1>
          <p className="text-muted-foreground mb-6">Quick assessment before we start</p>

          <div className="space-y-4">
            {flow.initialQuestions.map((q) => (
              <div key={q.id} className="premium-card p-5">
                <p className="font-medium text-foreground mb-3">{q.question}</p>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setInitialAnswers(prev => ({ ...prev, [q.id]: option.value }));
                        addInput({
                          questionId: q.id,
                          question: q.question,
                          answer: option.label,
                        });
                      }}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        initialAnswers[q.id] === option.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary/50 text-foreground hover:bg-secondary'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={() => setShowInitialQuestions(false)}
            disabled={!allAnswered}
            className="w-full h-14 mt-6 bg-primary hover:bg-primary/90 rounded-xl text-lg font-semibold disabled:opacity-50"
          >
            Start Emergency Guidance
          </Button>
        </div>
      </Layout>
    );
  }

  const handleDone = () => {
    if (isLastStep) {
      const summaryData = getSummaryData(elapsedTime);
      navigate('/summary', { state: { summaryData } });
    } else {
      goToNextStep();
    }
  };

  const handleCant = () => {
    if (isLastStep) {
      const summaryData = getSummaryData(elapsedTime);
      navigate('/summary', { state: { summaryData } });
    } else {
      skipCurrentStep();
    }
  };

  const handleEndEarly = () => {
    const summaryData = getSummaryData(elapsedTime);
    navigate('/summary', { state: { summaryData } });
  };

  const handleRestart = () => {
    resetFlow();
    setShowRestartDialog(false);
    setShowInitialQuestions(true);
    setInitialAnswers({});
  };

  const handleActionButton = (action: 'cpr' | 'call911' | 'timer') => {
    if (action === 'cpr') {
      navigate('/cpr', { state: { returnTo: `/emergency/${category}`, elapsedTime } });
    } else if (action === 'call911') {
      window.location.href = 'tel:911';
    }
  };

  const handleQuickAnswer = (questionId: string, question: string, answer: string) => {
    addInput({
      questionId,
      question,
      answer,
      stepId: currentStep.id,
    });
  };

  return (
    <Layout showHeader={false}>
      <div className="container mx-auto px-4 py-4 pb-24 max-w-2xl">
        {/* Top navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goToPreviousStep}
                className="text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowExitDialog(true)}
              className="text-muted-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Exit
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowRestartDialog(true)}
              className="text-muted-foreground"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleEndEarly}
              className="text-muted-foreground"
            >
              End & Summary
            </Button>
          </div>
        </div>

        {/* Category title */}
        <h1 className="text-heading-3 text-primary mb-3">{flow.category}</h1>

        {/* Safety banner */}
        <SafetyAlertBanner 
          variant="info" 
          message="Stay calm. Follow one step at a time." 
          dismissible 
        />

        {/* Progress */}
        <div className="my-4">
          <ProgressBar 
            currentStep={currentStepIndex + 1} 
            totalSteps={totalSteps} 
            elapsedTime={formattedTime} 
          />
        </div>

        {/* Current Step */}
        <StepCard
          stepNumber={currentStepIndex + 1}
          totalSteps={totalSteps}
          title={currentStep.title}
          instruction={currentStep.instruction}
          warning={currentStep.warning}
          alternatives={currentStep.alternatives}
          quickQuestion={currentStep.quickQuestion}
          actionButton={currentStep.actionButton}
          onDone={handleDone}
          onCant={handleCant}
          onQuickAnswer={handleQuickAnswer}
          onActionButton={handleActionButton}
          isAnimating={true}
        />

        {/* Call 911 floating button - now calm blue */}
        <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8">
          <a
            href="tel:911"
            className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg pulse-calm"
          >
            <Phone className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Restart Dialog */}
      <AlertDialog open={showRestartDialog} onOpenChange={setShowRestartDialog}>
        <AlertDialogContent className="premium-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Restart this emergency?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all progress and start from the beginning.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestart}>Restart</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exit Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="premium-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Exit emergency guidance?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be saved in the summary. You can also continue later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Helping</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate('/citizen')}>Exit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default EmergencyFlow;
