import { useState, useRef, ReactNode } from 'react';
import Layout from '@/components/layout/Layout';
import EmergencyCard from '@/components/emergency/EmergencyCard';
import PrimaryCTAButton from '@/components/ui/PrimaryCTAButton';
import VoiceAssistantModal from '@/components/voice/VoiceAssistantModal';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mic, Shield, Heart, Lock } from 'lucide-react';
import { getEmergencyCategories } from '@/data/emergencyFlows';
import { cn } from '@/lib/utils';

// 3D Trust Card Component
const TrustCard = ({ children, className }: { children: ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glowStyle, setGlowStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);
    
    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;
    
    setGlowStyle({
      background: `radial-gradient(circle at ${glowX}% ${glowY}%, hsl(187 85% 43% / 0.15), transparent 50%)`,
    });
  };

  const handleMouseLeave = () => {
    setTransform('');
    setGlowStyle({});
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'glass-card p-6 text-center relative overflow-hidden',
        'transition-all duration-300 ease-out',
        className
      )}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={glowStyle}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const categories = getEmergencyCategories();
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  return (
    <Layout showEmergencyBanner={false}>
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-display text-foreground mb-6 max-w-4xl mx-auto leading-tight">
            Help in the next <span className="text-primary text-glow-primary">30 minutes</span>.
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
              className="button-press glow-hover"
            >
              Start Emergency Help
            </PrimaryCTAButton>
            <PrimaryCTAButton
              variant="secondary"
              size="xlarge"
              icon={Mic}
              onClick={() => setVoiceModalOpen(true)}
              className="button-press"
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
            <TrustCard>
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Login Required</h3>
              <p className="text-sm text-muted-foreground">
                Instant access when every second counts. No accounts, no barriers.
              </p>
            </TrustCard>
            <TrustCard>
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Panic-Proof Design</h3>
              <p className="text-sm text-muted-foreground">
                Large buttons, clear instructions, one step at a time.
              </p>
            </TrustCard>
            <TrustCard>
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">
                Your emergency data stays on your device. We don't track you.
              </p>
            </TrustCard>
          </div>
        </section>
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal 
        isOpen={voiceModalOpen}
        onClose={() => {
          setVoiceModalOpen(false);
          setIsListening(false);
        }}
        isListening={isListening}
        setIsListening={setIsListening}
      />
    </Layout>
  );
};

export default Index;
