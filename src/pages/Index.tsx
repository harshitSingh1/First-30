import Layout from '@/components/layout/Layout';
import EmergencyCard from '@/components/emergency/EmergencyCard';
import PrimaryCTAButton from '@/components/ui/PrimaryCTAButton';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mic, Shield, Heart, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { getEmergencyCategories } from '@/data/emergencyFlows';

const Index = () => {
  const navigate = useNavigate();
  const categories = getEmergencyCategories();

  const handleVoiceAssistant = () => {
    toast.info('Voice Assistant coming soon!');
  };

  return (
    <Layout showEmergencyBanner={false}>
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-display text-foreground mb-6 max-w-4xl mx-auto leading-tight">
            Help in the next <span className="text-primary">30 minutes</span>.
            <br />
            Step-by-step. Voice guided.
          </h1>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto mb-10">
            Emergency guidance for the critical moments before professional help arrives. 
            Designed for panic situations, built for saving lives.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PrimaryCTAButton
              variant="primary"
              size="xlarge"
              icon={ArrowRight}
              onClick={() => navigate('/citizen')}
            >
              Start Emergency Help
            </PrimaryCTAButton>
            <PrimaryCTAButton
              variant="secondary"
              size="xlarge"
              icon={Mic}
              onClick={handleVoiceAssistant}
            >
              Start Voice Assistant
            </PrimaryCTAButton>
          </div>
        </section>

        {/* Emergency Quick-Start Grid */}
        <section className="mb-16">
          <h2 className="text-heading-2 text-foreground text-center mb-8">
            Quick Start
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <EmergencyCard
                key={category.id}
                id={category.id}
                category={category.category}
                icon={category.icon}
                description={category.description}
                priorityHint={category.priorityHint}
              />
            ))}
          </div>
        </section>

        {/* Trust Points */}
        <section className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Login Required</h3>
              <p className="text-sm text-muted-foreground">
                Instant access when every second counts. No accounts, no barriers.
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Panic-Proof Design</h3>
              <p className="text-sm text-muted-foreground">
                Large buttons, clear instructions, one step at a time.
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">
                Your emergency data stays on your device. We don't track you.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
