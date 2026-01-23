import Layout from '@/components/layout/Layout';
import EmergencyCard from '@/components/emergency/EmergencyCard';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getEmergencyCategories } from '@/data/emergencyFlows';

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>
    </Layout>
  );
};

export default CitizenMode;
