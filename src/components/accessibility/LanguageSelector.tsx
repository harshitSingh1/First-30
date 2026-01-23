import { useLanguage, Language } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  variant?: 'default' | 'compact';
  className?: string;
}

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
];

const LanguageSelector = ({ variant = 'default', className }: LanguageSelectorProps) => {
  const { language: currentLanguage, setLanguage } = useLanguage();

  return (
    <Select value={currentLanguage} onValueChange={(value) => setLanguage(value as Language)}>
      <SelectTrigger 
        className={cn(
          'bg-secondary/50 border-border/50',
          variant === 'compact' ? 'w-[100px] h-9' : 'w-[140px]',
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-popover border-border">
        {languages.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            className="cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span>{lang.nativeName}</span>
              {variant === 'default' && (
                <span className="text-xs text-muted-foreground">({lang.name})</span>
              )}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
