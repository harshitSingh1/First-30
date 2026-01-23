import { ReactNode } from 'react';

interface DispatcherPanelProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const DispatcherPanel = ({ title, children, className = '' }: DispatcherPanelProps) => {
  return (
    <div className={`glass-card-strong flex flex-col h-full ${className}`}>
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
};

export default DispatcherPanel;
