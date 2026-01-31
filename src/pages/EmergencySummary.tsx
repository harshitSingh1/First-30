import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SummaryCard from '@/components/emergency/SummaryCard';
import { EmergencySummaryData } from '@/types/emergency';
import SafetyAlertBanner from '@/components/emergency/SafetyAlertBanner';

const EmergencySummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const summaryData = location.state?.summaryData as EmergencySummaryData | undefined;

  const defaultData: EmergencySummaryData = {
    category: 'Emergency',
    categoryIcon: 'alert-circle',
    priority: 'P2',
    calculatedPriority: 'P2',
    stepsCompleted: [],
    stepsSkipped: [],
    totalSteps: 0,
    duration: 0,
    startTime: new Date(),
    endTime: new Date(),
    collectedInputs: [],
    keyObservations: [],
    actionsTaken: [],
  };

  const data = summaryData || defaultData;

  return (
    <Layout showHeader={false}>
      <div className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
        <h1 className="text-heading-1 text-foreground text-center mb-4">
          Emergency Summary
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Share this with emergency responders
        </p>

        {data.calculatedPriority === 'P1' && (
          <div className="mb-6">
            <SafetyAlertBanner
              variant="danger"
              message="This is a CRITICAL emergency. Ensure emergency services have been contacted."
            />
          </div>
        )}

        <SummaryCard data={data} onNewEmergency={() => navigate('/citizen')} />
      </div>
    </Layout>
  );
};

export default EmergencySummary;
