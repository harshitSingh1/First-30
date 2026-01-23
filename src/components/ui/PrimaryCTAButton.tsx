import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface PrimaryCTAButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'emergency' | 'success' | 'secondary';
  size?: 'default' | 'large' | 'xlarge';
  fullWidth?: boolean;
  icon?: LucideIcon;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const variantClasses = {
  primary: 'bg-primary hover:bg-primary/90 text-primary-foreground glow-primary hover:shadow-lg',
  emergency: 'bg-emergency hover:bg-emergency/90 text-emergency-foreground glow-emergency hover:shadow-lg',
  success: 'bg-success hover:bg-success/90 text-success-foreground glow-success hover:shadow-lg',
  secondary: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground hover:shadow-lg',
};

const sizeClasses = {
  default: 'h-12 px-6 text-base',
  large: 'h-14 px-8 text-lg',
  xlarge: 'h-16 px-10 text-xl',
};

const PrimaryCTAButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  icon: Icon,
  className,
  disabled = false,
  type = 'button',
}: PrimaryCTAButtonProps) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'font-semibold rounded-2xl transition-all duration-300',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        'flex items-center justify-center gap-3',
        className
      )}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </Button>
  );
};

export default PrimaryCTAButton;
