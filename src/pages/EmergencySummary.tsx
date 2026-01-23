import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SummaryCard from '@/components/emergency/SummaryCard';
import { EmergencySummaryData } from '@/types/emergency';

const EmergencySummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const summaryData = location.state?.summaryData as EmergencySummaryData | undefined;

  const defaultData: EmergencySummaryData = {
    category: 'Emergency',
    categoryIcon: 'alert-circle',
    priority: 'P2',
    stepsCompleted: [],
    totalSteps: 0,
    duration: 0,
    startTime: new Date(),
    endTime: new Date(),
  };

  return (
    <Layout showHeader={false}>
      <div className="container mx-auto px-4 py-8 pb-24 max-w-2xl">
        <h1 className="text-heading-1 text-foreground text-center mb-8">Emergency Summary</h1>
        <SummaryCard data={summaryData || defaultData} onNewEmergency={() => navigate('/citizen')} />
      </div>
    </Layout>
  );
};

export default EmergencySummary;
