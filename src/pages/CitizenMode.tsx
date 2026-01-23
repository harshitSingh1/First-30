import Layout from '@/components/layout/Layout';
import EmergencyCard from '@/components/emergency/EmergencyCard';
import VoiceAssistantButton from '@/components/voice/VoiceAssistantButton';
import { ArrowLeft, MapPin } from 'lucide-react';
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

        <h1 className="text-heading-1 text-foreground mb-4">What's the emergency?</h1>
        <p className="text-body-large text-muted-foreground mb-8">Select the situation that best matches.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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

        {/* Quick action for nearby help */}
        <div className="glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Find Nearby Help</h3>
              <p className="text-sm text-muted-foreground">Hospitals, pharmacies, emergency services</p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link to="/map">View Map</Link>
          </Button>
        </div>
      </div>

      {/* Voice Assistant Floating Button */}
      <VoiceAssistantButton />
    </Layout>
  );
};

export default CitizenMode;
