import { FC } from 'react';
import { LucideIcon } from 'lucide-react';

type Props = {
  icon: LucideIcon;
  label: string;
  value: string;
  iconColor: string;
};

export const EventInfoCard: FC<Props> = ({
  icon: Icon,
  label,
  value,
  iconColor,
}) => (
  <div className='flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50'>
    <Icon className={`w-5 h-5 ${iconColor}`} />
    <div>
      <div className='text-sm font-medium text-gray-300'>{label}</div>
      <div className='text-gray-400'>{value}</div>
    </div>
  </div>
);
