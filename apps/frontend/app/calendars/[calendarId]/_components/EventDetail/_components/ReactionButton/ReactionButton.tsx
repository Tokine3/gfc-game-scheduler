import { FC, memo } from 'react';
import { Button } from '../../../../../../components/ui/button';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { cn } from '../../../../../../../lib/utils';

type Props = {
  type: 'OK' | 'PENDING' | 'NG';
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
};

const buttonConfig = {
  OK: {
    icon: CheckCircle,
    label: '参加',
    baseClassName:
      'border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/10',
    activeClassName:
      'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-transparent',
    variant: 'outline' as const,
  },
  PENDING: {
    icon: HelpCircle,
    label: '未定',
    baseClassName: 'border-amber-500/30 text-amber-200 hover:bg-amber-500/10',
    activeClassName:
      'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-transparent',
    variant: 'outline' as const,
  },
  NG: {
    icon: XCircle,
    label: '不参加',
    baseClassName: 'border-red-500/30 text-red-200 hover:bg-red-500/10',
    activeClassName:
      'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-transparent',
    variant: 'outline' as const,
  },
};

export const ReactionButton: FC<Props> = memo(function ReactionButton({
  type,
  onClick,
  disabled,
  isActive,
}) {
  const config = buttonConfig[type];
  const Icon = config.icon;

  return (
    <Button
      variant={config.variant}
      className={cn(
        'flex-1',
        isActive ? config.activeClassName : config.baseClassName
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className='w-4 h-4 mr-2' />
      {config.label}
    </Button>
  );
});
