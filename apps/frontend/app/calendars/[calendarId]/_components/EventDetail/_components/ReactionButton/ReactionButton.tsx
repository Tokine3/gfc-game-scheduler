import { FC } from 'react';
import { Button } from '../../../../../../components/ui/button';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

type Props = {
  type: 'OK' | 'PENDING' | 'NG';
  onClick: () => void;
  disabled?: boolean;
};

const buttonConfig = {
  OK: {
    icon: CheckCircle,
    label: '参加する',
    className:
      'flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white',
    variant: 'default' as const,
  },
  PENDING: {
    icon: HelpCircle,
    label: '未定',
    className:
      'flex-1 border-amber-500/30 text-amber-200 hover:bg-amber-500/10',
    variant: 'outline' as const,
  },
  NG: {
    icon: XCircle,
    label: '不参加',
    className: 'flex-1 border-red-500/30 text-red-200 hover:bg-red-500/10',
    variant: 'outline' as const,
  },
};

export const ReactionButton: FC<Props> = ({ type, onClick, disabled }) => {
  const config = buttonConfig[type];
  const Icon = config.icon;

  return (
    <Button
      variant={config.variant}
      className={config.className}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className='w-4 h-4 mr-2' />
      {config.label}
    </Button>
  );
};
