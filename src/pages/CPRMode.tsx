import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import EmergencyTimer from '@/components/emergency/EmergencyTimer';
import SafetyAlertBanner from '@/components/emergency/SafetyAlertBanner';
import { useEmergencyTimer } from '@/hooks/useEmergencyTimer';
import { ArrowLeft, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CPRMode = () => {
  const navigate = useNavigate();
  const { formattedTime, isRunning, toggle, reset } = useEmergencyTimer(false);

  return (
    <Layout showHeader={false}>
      <div className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-muted-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>

        <h1 className="text-heading-1 text-foreground text-center mb-6">CPR Mode</h1>
        
        <SafetyAlertBanner variant="danger" message="If you haven't already, call 911 immediately!" />

        <div className="mt-6">
          <EmergencyTimer
            formattedTime={formattedTime}
            isRunning={isRunning}
            onToggle={toggle}
            onReset={reset}
            showCPRRhythm
          />
        </div>

        <div className="mt-6 glass-card p-4 text-center">
          <p className="text-sm text-muted-foreground mb-3">Remember: Push hard, push fast</p>
          <Button className="bg-emergency hover:bg-emergency/90" asChild>
            <a href="tel:911"><Phone className="w-4 h-4 mr-2" />Call 911</a>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CPRMode;
