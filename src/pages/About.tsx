import Layout from '@/components/layout/Layout';
import { Shield, AlertTriangle, Heart, Users, Mail } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pb-24 max-w-4xl">
        <h1 className="text-heading-1 text-foreground mb-8">About First30.ai</h1>

        {/* Mission */}
        <section className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-primary" />
            <h2 className="text-heading-3 text-foreground">Our Mission</h2>
          </div>
          <p className="text-muted-foreground">
            First30.ai provides step-by-step emergency guidance for the critical first 30 minutes before professional help arrives. We believe everyone should have access to life-saving knowledge in moments of crisis.
          </p>
        </section>

        {/* Safety Guidelines */}
        <section className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-heading-3 text-foreground">Safety Guidelines</h2>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Always call emergency services (911) first</li>
            <li>• Ensure your own safety before helping others</li>
            <li>• Follow instructions step by step</li>
            <li>• Stay calm and speak clearly</li>
            <li>• Do not move injured persons unless necessary</li>
          </ul>
        </section>

        {/* Disclaimer */}
        <section className="glass-card p-6 border-warning/50 bg-warning/5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-warning" />
            <h2 className="text-heading-3 text-foreground">Medical Disclaimer</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            First30.ai is designed to provide general emergency guidance and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers. In case of emergency, call your local emergency number immediately. The creators of First30.ai are not liable for any actions taken based on the information provided.
          </p>
        </section>

        {/* Contact */}
        <section className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-primary" />
            <h2 className="text-heading-3 text-foreground">Contact</h2>
          </div>
          <p className="text-muted-foreground">
            Questions or feedback? Email us at <span className="text-primary">support@first30.ai</span>
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default About;
