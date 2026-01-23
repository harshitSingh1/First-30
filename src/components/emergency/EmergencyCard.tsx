import { Link } from 'react-router-dom';
import { 
  Droplets, 
  Wind, 
  Heart, 
  Flame, 
  AlertCircle, 
  Zap,
  LucideIcon 
} from 'lucide-react';

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

const priorityColorMap: Record<string, string> = {
  P1: 'border-l-red-500 hover:shadow-red-500/20',
  P2: 'border-l-orange-500 hover:shadow-orange-500/20',
  P3: 'border-l-yellow-500 hover:shadow-yellow-500/20',
  P4: 'border-l-green-500 hover:shadow-green-500/20',
};

const iconColorMap: Record<string, string> = {
  P1: 'text-red-400 bg-red-500/20',
  P2: 'text-orange-400 bg-orange-500/20',
  P3: 'text-yellow-400 bg-yellow-500/20',
  P4: 'text-green-400 bg-green-500/20',
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
  const priorityColor = priorityColorMap[priorityHint];
  const iconColor = iconColorMap[priorityHint];

  const sizeClasses = size === 'large' 
    ? 'min-h-[160px] p-6' 
    : 'min-h-[120px] p-5';

  return (
    <Link
      to={`/emergency/${id}`}
      className={`
        glass-card border-l-4 ${priorityColor}
        ${sizeClasses}
        flex flex-col justify-between
        hover-lift cursor-pointer
        hover:shadow-lg transition-all duration-300
        group
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`
          w-12 h-12 rounded-xl ${iconColor}
          flex items-center justify-center flex-shrink-0
          group-hover:scale-110 transition-transform duration-300
        `}>
          <IconComponent className="w-6 h-6" />
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
