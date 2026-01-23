import { useState, useCallback, useMemo } from 'react';
import { EmergencyFlow, EmergencySummaryData } from '@/types/emergency';
import { getEmergencyFlowById } from '@/data/emergencyFlows';

interface UseEmergencyFlowReturn {
  flow: EmergencyFlow | undefined;
  currentStepIndex: number;
  currentStep: EmergencyFlow['steps'][0] | undefined;
  totalSteps: number;
  progress: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  completedSteps: string[];
  skippedSteps: string[];
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  skipCurrentStep: () => void;
  resetFlow: () => void;
  getSummaryData: (duration: number) => EmergencySummaryData | undefined;
}

export const useEmergencyFlow = (categoryId: string): UseEmergencyFlowReturn => {
  const flow = useMemo(() => getEmergencyFlowById(categoryId), [categoryId]);
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [skippedSteps, setSkippedSteps] = useState<string[]>([]);
  const [startTime] = useState(() => new Date());

  const totalSteps = flow?.steps.length ?? 0;
  const currentStep = flow?.steps[currentStepIndex];
  const progress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  const goToNextStep = useCallback(() => {
    if (!currentStep) return;
    
    setCompletedSteps((prev) => [...prev, currentStep.id]);
    
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [currentStep, currentStepIndex, totalSteps]);

  const goToPreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      // Remove last completed step
      setCompletedSteps((prev) => prev.slice(0, -1));
    }
  }, [currentStepIndex]);

  const skipCurrentStep = useCallback(() => {
    if (!currentStep) return;
    
    setSkippedSteps((prev) => [...prev, currentStep.id]);
    
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [currentStep, currentStepIndex, totalSteps]);

  const resetFlow = useCallback(() => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setSkippedSteps([]);
  }, []);

  const getSummaryData = useCallback(
    (duration: number): EmergencySummaryData | undefined => {
      if (!flow) return undefined;

      return {
        category: flow.category,
        categoryIcon: flow.icon,
        priority: flow.priorityHint,
        stepsCompleted: completedSteps,
        totalSteps,
        duration,
        startTime,
        endTime: new Date(),
      };
    },
    [flow, completedSteps, totalSteps, startTime]
  );

  return {
    flow,
    currentStepIndex,
    currentStep,
    totalSteps,
    progress,
    isFirstStep,
    isLastStep,
    completedSteps,
    skippedSteps,
    goToNextStep,
    goToPreviousStep,
    skipCurrentStep,
    resetFlow,
    getSummaryData,
  };
};
