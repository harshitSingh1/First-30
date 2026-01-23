import Layout from '@/components/layout/Layout';
import EmergencyCard from '@/components/emergency/EmergencyCard';
import VoiceAssistantButton from '@/components/voice/VoiceAssistantButton';
import { ArrowLeft, MapPin, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getEmergencyCategories } from '@/data/emergencyFlows';
import { Button } from '@/components/ui/button';

const CitizenMode = () => {
  const categories = getEmergencyCategories();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pb-24">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Hero section */}
        <div className="text-center mb-10">
          <h1 className="text-heading-1 text-foreground mb-3">What's the emergency?</h1>
          <p className="text-body-large text-muted-foreground max-w-xl mx-auto">
            Select the situation that best matches. We'll guide you step by step.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-w-5xl mx-auto">
          {categories.map((category) => (
            <EmergencyCard
              key={category.id}
              id={category.id}
              category={category.category}
              icon={category.icon}
              description={category.description}
              priorityHint={category.priorityHint}
              size="large"
            />
          ))}
        </div>

        {/* Quick action cards */}
        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <div className="premium-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">Find Nearby Help</h3>
              <p className="text-sm text-muted-foreground truncate">Hospitals, pharmacies, emergency services</p>
            </div>
            <Button variant="outline" size="sm" asChild className="flex-shrink-0">
              <Link to="/map">View Map</Link>
            </Button>
          </div>

          <div className="premium-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">Voice Assistant</h3>
              <p className="text-sm text-muted-foreground truncate">Hands-free emergency guidance</p>
            </div>
            <Button variant="outline" size="sm" className="flex-shrink-0">
              Start
            </Button>
          </div>
        </div>
      </div>

      {/* Voice Assistant Floating Button */}
      <VoiceAssistantButton />
    </Layout>
  );
};

export default CitizenMode;
