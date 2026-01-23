import { useState, useRef, ReactNode } from 'react';
import Layout from '@/components/layout/Layout';
import EmergencyCard from '@/components/emergency/EmergencyCard';
import PrimaryCTAButton from '@/components/ui/PrimaryCTAButton';
import VoiceAssistantModal from '@/components/voice/VoiceAssistantModal';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mic, Shield, Heart, Lock, Activity, MapPin, Phone, Stethoscope, Zap, Radio } from 'lucide-react';
import { getEmergencyCategories } from '@/data/emergencyFlows';
import { cn } from '@/lib/utils';

// 3D Floating Icon Component
const FloatingIcon = ({ 
  icon: Icon, 
  className, 
  delay = 0 
}: { 
  icon: React.ElementType; 
  className?: string; 
  delay?: number;
}) => {
  return (
    <div 
      className={cn(
        "absolute w-16 h-16 md:w-20 md:h-20 rounded-2xl premium-card flex items-center justify-center",
        "transform-gpu parallax-float opacity-80",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
    </div>
  );
};

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
      background: `radial-gradient(circle at ${glowX}% ${glowY}%, hsl(175 70% 42% / 0.15), transparent 50%)`,
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
        'premium-card p-6 text-center relative overflow-hidden',
        'transition-all duration-300 ease-out cursor-default',
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

// Feature Badge Component
const FeatureBadge = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary border border-primary/20">
    {children}
  </span>
);

const Index = () => {
  const navigate = useNavigate();
  const categories = getEmergencyCategories();
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  return (
    <Layout showEmergencyBanner={false}>
      {/* Hero Section with gradient overlay */}
      <section className="relative overflow-hidden hero-gradient">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Content */}
            <div className="text-center lg:text-left">
              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                <FeatureBadge>
                  <Shield className="w-3 h-3" /> No Login Required
                </FeatureBadge>
                <FeatureBadge>
                  <Zap className="w-3 h-3" /> Works Offline
                </FeatureBadge>
              </div>

              <h1 className="text-display text-foreground mb-6 leading-[1.1]">
                Stay Calm. Act Fast.
                <span className="block gradient-text">Get guided help in the first 30 minutes.</span>
              </h1>
              
              <p className="text-body-large text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
                Step-by-step emergency actions + voice instructions + nearby help.
                Designed for panic situations, built for saving lives.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <PrimaryCTAButton
                  variant="primary"
                  size="xlarge"
                  icon={ArrowRight}
                  onClick={() => navigate('/citizen')}
                  className="button-press glow-hover shimmer"
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
                  Speak to Assistant
                </PrimaryCTAButton>
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-center lg:justify-start gap-8 mt-10 pt-8 border-t border-border/50">
                <div>
                  <p className="text-2xl font-bold text-foreground">30 min</p>
                  <p className="text-sm text-muted-foreground">Critical window</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="text-2xl font-bold text-foreground">7+</p>
                  <p className="text-sm text-muted-foreground">Emergency types</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="text-2xl font-bold text-foreground">Voice</p>
                  <p className="text-sm text-muted-foreground">Guided steps</p>
                </div>
              </div>
            </div>

            {/* Right: 3D Floating Icons Visual */}
            <div className="hidden lg:block relative h-[400px]">
              {/* Central graphic placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/15 to-transparent border border-primary/15 flex items-center justify-center">
                    <Activity className="w-20 h-20 text-primary/60" />
                  </div>
                </div>
              </div>
              
              {/* Floating 3D icons */}
              <FloatingIcon icon={Heart} className="top-4 left-8" delay={0} />
              <FloatingIcon icon={Stethoscope} className="top-8 right-12" delay={0.5} />
              <FloatingIcon icon={MapPin} className="bottom-16 left-4" delay={1} />
              <FloatingIcon icon={Phone} className="bottom-8 right-8" delay={1.5} />
              <FloatingIcon icon={Shield} className="top-1/3 right-0" delay={0.8} />
              <FloatingIcon icon={Radio} className="bottom-1/3 left-16" delay={1.2} />
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Quick-Start Grid */}
      <section className="container mx-auto px-4 py-16 section-gradient">
        <div className="text-center mb-10">
          <h2 className="text-heading-1 text-foreground mb-3">
            What's the emergency?
          </h2>
          <p className="text-muted-foreground text-lg">
            Select a situation to get step-by-step guidance
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
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
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-heading-2 text-foreground mb-3">
            Built for real emergencies
          </h2>
          <p className="text-muted-foreground">
            Designed with first responders and medical professionals
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <TrustCard>
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Login Required</h3>
            <p className="text-sm text-muted-foreground">
              Instant access when every second counts. No accounts, no barriers.
            </p>
          </TrustCard>
          <TrustCard>
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Panic-Proof Design</h3>
            <p className="text-sm text-muted-foreground">
              Large buttons, clear instructions, one step at a time.
            </p>
          </TrustCard>
          <TrustCard>
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Privacy First</h3>
            <p className="text-sm text-muted-foreground">
              Your emergency data stays on your device. We don't track you.
            </p>
          </TrustCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="premium-card p-8 md:p-12 text-center max-w-3xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 hero-gradient opacity-50" />
          <div className="relative z-10">
            <h2 className="text-heading-2 text-foreground mb-4">
              Ready when you need it
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Bookmark this app now. In an emergency, every second counts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PrimaryCTAButton
                variant="primary"
                size="large"
                icon={ArrowRight}
                onClick={() => navigate('/citizen')}
                className="button-press glow-hover"
              >
                Get Started
              </PrimaryCTAButton>
              <PrimaryCTAButton
                variant="secondary"
                size="large"
                icon={MapPin}
                onClick={() => navigate('/map')}
                className="button-press"
              >
                Find Nearby Help
              </PrimaryCTAButton>
            </div>
          </div>
        </div>
      </section>

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
