import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmergencyCallBannerProps {
  emergencyNumber?: string;
  className?: string;
}

const EmergencyCallBanner = ({ 
  emergencyNumber = '911',
  className = '',
}: EmergencyCallBannerProps) => {
  const handleCall = () => {
    window.location.href = `tel:${emergencyNumber}`;
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 ${className}`}>
      <div className="container mx-auto">
        <Button
          onClick={handleCall}
          className="w-full h-14 bg-emergency hover:bg-emergency/90 text-emergency-foreground 
                     text-lg font-bold rounded-2xl pulse-emergency flex items-center justify-center gap-3
                     shadow-lg"
          size="lg"
        >
          <Phone className="w-6 h-6 animate-pulse" />
          <span>Call Emergency: {emergencyNumber}</span>
        </Button>
      </div>
    </div>
  );
};

export default EmergencyCallBanner;
