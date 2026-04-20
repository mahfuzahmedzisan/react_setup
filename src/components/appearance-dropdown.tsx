import { Monitor, Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/useAppearance';

export default function AppearanceToggleDropdown({
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { theme, toggleTheme } = useAppearance();
  const { t } = useTranslation();

  const getCurrentIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-5 w-5" />;
      case 'light':
        return <Sun className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  return (
    <div className={className} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
            {getCurrentIcon()}
            <span className="sr-only">{t('common.system')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => toggleTheme('light')}>
            <span className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              {t('common.light')}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleTheme('dark')}>
            <span className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              {t('common.dark')}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleTheme('system')}>
            <span className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              {t('common.system')}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
