import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProgressBar from '@/components/emergency/ProgressBar';
import StepCard from '@/components/emergency/StepCard';
import SafetyAlertBanner from '@/components/emergency/SafetyAlertBanner';
import { useEmergencyFlow } from '@/hooks/useEmergencyFlow';
import { useEmergencyTimer } from '@/hooks/useEmergencyTimer';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmergencyFlow = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { flow, currentStep, currentStepIndex, totalSteps, isLastStep, goToNextStep, skipCurrentStep, getSummaryData } = useEmergencyFlow(category || '');
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

  const handleDone = () => {
    if (isLastStep) {
      const summaryData = getSummaryData(elapsedTime);
      navigate('/summary', { state: { summaryData } });
    } else {
      goToNextStep();
    }
  };

  const handleEndEarly = () => {
    const summaryData = getSummaryData(elapsedTime);
    navigate('/summary', { state: { summaryData } });
  };

  return (
    <Layout showHeader={false}>
      <div className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/citizen')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Exit
          </Button>
          <Button variant="ghost" size="sm" onClick={handleEndEarly} className="text-muted-foreground">
            <X className="w-4 h-4 mr-1" />
            End & Summary
          </Button>
        </div>

        {/* Category title */}
        <h1 className="text-heading-3 text-primary mb-4">{flow.category}</h1>

        {/* Safety banner */}
        <SafetyAlertBanner variant="info" message="Stay calm. Follow one step at a time." dismissible />

        {/* Progress */}
        <div className="my-6">
          <ProgressBar currentStep={currentStepIndex + 1} totalSteps={totalSteps} elapsedTime={formattedTime} />
        </div>

        {/* Current Step */}
        <StepCard
          stepNumber={currentStepIndex + 1}
          totalSteps={totalSteps}
          title={currentStep.title}
          instruction={currentStep.instruction}
          warning={currentStep.warning}
          alternatives={currentStep.alternatives}
          onDone={handleDone}
          onCant={skipCurrentStep}
        />
      </div>
    </Layout>
  );
};

export default EmergencyFlow;
