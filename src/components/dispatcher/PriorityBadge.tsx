import { Priority } from '@/types/emergency';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showPulse?: boolean;
}

const priorityConfig = {
  P1: { 
    label: 'Critical', 
    color: 'bg-emergency text-white',
    ring: 'ring-emergency/50',
    pulse: true 
  },
  P2: { 
    label: 'High', 
    color: 'bg-orange-500 text-white',
    ring: 'ring-orange-500/50',
    pulse: false 
  },
  P3: { 
    label: 'Medium', 
    color: 'bg-warning text-black',
    ring: 'ring-warning/50',
    pulse: false 
  },
  P4: { 
    label: 'Low', 
    color: 'bg-success text-white',
    ring: 'ring-success/50',
    pulse: false 
  }
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base font-bold'
};

const PriorityBadge = ({ priority, size = 'md', showLabel = true, showPulse = true }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold ring-2",
        config.color,
        config.ring,
        sizeClasses[size],
        showPulse && config.pulse && "animate-pulse"
      )}
    >
      <span className="font-bold">{priority}</span>
      {showLabel && <span className="opacity-90">• {config.label}</span>}
    </span>
  );
};

export default PriorityBadge;
