import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { 
  Droplets, 
  Wind, 
  Heart, 
  Flame, 
  AlertCircle, 
  Zap,
  LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmergencyCardProps {
  id: string;
  category: string;
  icon: string;
  description: string;
  priorityHint?: 'P1' | 'P2' | 'P3' | 'P4';
  size?: 'default' | 'large';
}

const iconMap: Record<string, LucideIcon> = {
  droplets: Droplets,
  wind: Wind,
  heart: Heart,
  flame: Flame,
  'alert-circle': AlertCircle,
  zap: Zap,
};

// Calm priority colors - no red!
const priorityColors = {
  P1: { 
    border: 'border-l-blue-500', 
    glow: 'hsl(220 80% 50%)',
    iconBg: 'bg-blue-500/15',
    iconText: 'text-blue-400'
  },
  P2: { 
    border: 'border-l-amber-500', 
    glow: 'hsl(38 85% 55%)',
    iconBg: 'bg-amber-500/15',
    iconText: 'text-amber-400'
  },
  P3: { 
    border: 'border-l-teal-500', 
    glow: 'hsl(175 70% 42%)',
    iconBg: 'bg-teal-500/15',
    iconText: 'text-teal-400'
  },
  P4: { 
    border: 'border-l-slate-500', 
    glow: 'hsl(210 18% 40%)',
    iconBg: 'bg-slate-500/15',
    iconText: 'text-slate-400'
  },
};

const EmergencyCard = ({
  id,
  category,
  icon,
  description,
  priorityHint = 'P2',
  size = 'default',
}: EmergencyCardProps) => {
  const IconComponent = iconMap[icon] || AlertCircle;
  const colors = priorityColors[priorityHint];
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [transform, setTransform] = useState('');
  const [glowStyle, setGlowStyle] = useState({});

  const sizeClasses = size === 'large' 
    ? 'min-h-[160px] p-6' 
    : 'min-h-[120px] p-5';

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);
    
    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;
    
    setGlowStyle({
      background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${colors.glow} / 0.15, transparent 50%)`,
    });
  };

  const handleMouseLeave = () => {
    setTransform('');
    setGlowStyle({});
  };

  return (
    <Link
      ref={cardRef}
      to={`/emergency/${id}`}
      className={cn(
        'premium-card border-l-4 relative overflow-hidden',
        colors.border,
        sizeClasses,
        'flex flex-col justify-between',
        'cursor-pointer group',
        'transition-all duration-300 ease-out'
      )}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow overlay */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={glowStyle}
      />

      <div className="relative z-10 flex items-start gap-4">
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
          'group-hover:scale-110 transition-transform duration-300',
          colors.iconBg
        )}>
          <IconComponent className={cn('w-6 h-6', colors.iconText)} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {category}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default EmergencyCard;
