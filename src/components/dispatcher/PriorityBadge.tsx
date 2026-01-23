import { Priority } from '@/types/emergency';

interface PriorityBadgeProps {
  priority: Priority;
  showPulse?: boolean;
}

const priorityConfig = {
  P1: { label: 'P1 - Critical', classes: 'priority-p1', pulse: true },
  P2: { label: 'P2 - Urgent', classes: 'priority-p2', pulse: false },
  P3: { label: 'P3 - Moderate', classes: 'priority-p3', pulse: false },
  P4: { label: 'P4 - Low', classes: 'priority-p4', pulse: false },
};

const PriorityBadge = ({ priority, showPulse = true }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];

  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border
      ${config.classes}
      ${showPulse && config.pulse ? 'animate-pulse' : ''}
    `}>
      {config.label}
    </span>
  );
};

export default PriorityBadge;
