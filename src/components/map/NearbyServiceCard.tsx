import { Building2, Pill, Shield, Flame, Phone, Clock, MapPin, Navigation } from 'lucide-react';
import { NearbyService } from '@/types/emergency';
import { Button } from '@/components/ui/button';
import Card3D from '@/components/ui/Card3D';
import { cn } from '@/lib/utils';

interface NearbyServiceCardProps {
  service: NearbyService;
}

const typeConfig = {
  hospital: { 
    icon: Building2, 
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    glow: 'emergency' as const
  },
  pharmacy: { 
    icon: Pill, 
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    glow: 'success' as const
  },
  police: { 
    icon: Shield, 
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    glow: 'primary' as const
  },
  fire: { 
    icon: Flame, 
    color: 'text-orange-400',
    bg: 'bg-orange-500/20',
    glow: 'warning' as const
  },
};

const NearbyServiceCard = ({ service }: NearbyServiceCardProps) => {
  const config = typeConfig[service.type];
  const Icon = config.icon;

  const handleGetDirections = () => {
    // Open directions in Google Maps or Apple Maps
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(service.address)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleCall = () => {
    if (service.phone) {
      window.location.href = `tel:${service.phone}`;
    }
  };

  return (
    <Card3D 
      glowColor={config.glow} 
      intensity="subtle"
      className="p-4"
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
          config.bg
        )}>
          <Icon className={cn('w-6 h-6', config.color)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-foreground text-base leading-tight">
              {service.name}
            </h4>
            {service.isOpen24h && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success flex-shrink-0">
                24h
              </span>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mt-0.5">{service.address}</p>
          
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1.5 text-primary">
              <MapPin className="w-3.5 h-3.5" />
              {service.distance}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {service.eta}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        {service.phone && (
          <Button 
            size="sm" 
            className="flex-1 h-10"
            onClick={handleCall}
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
        )}
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1 h-10"
          onClick={handleGetDirections}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Directions
        </Button>
      </div>
    </Card3D>
  );
};

export default NearbyServiceCard;
