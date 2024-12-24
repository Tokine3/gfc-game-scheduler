import { FC, memo } from 'react';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../../../../../components/ui/avatar';
import { Participant } from '../../types';

type Props = {
  participants: Participant[];
  quota: number;
};

export const ParticipantList: FC<Props> = memo(({ participants, quota }) => {
  const statuses = [
    { key: 'OK', icon: CheckCircle, label: '参加', color: 'text-emerald-400' },
    {
      key: 'PENDING',
      icon: HelpCircle,
      label: '未回答',
      color: 'text-amber-400',
    },
    { key: 'NG', icon: XCircle, label: '不参加', color: 'text-red-400' },
  ] as const;

  return (
    <div className='space-y-4'>
      {statuses.map(({ key, icon: Icon, label, color }) => {
        const filteredParticipants = participants.filter(
          (p) => p.reaction === key
        );
        if (filteredParticipants.length === 0) return null;

        return (
          <div key={key} className='space-y-2'>
            <div className='flex items-center gap-2 text-sm'>
              <Icon className={`w-4 h-4 ${color}`} />
              <span className='text-gray-400'>
                {label}（{filteredParticipants.length}）
              </span>
            </div>
            <div className='flex flex-wrap gap-2'>
              {filteredParticipants.map((participant) => (
                <div
                  key={participant.userId}
                  className='flex items-center gap-2 p-2 rounded-lg bg-gray-800/50'
                >
                  <Avatar className='w-6 h-6'>
                    <AvatarImage src={undefined} alt={participant.name} />
                    <AvatarFallback>{participant.name}</AvatarFallback>
                  </Avatar>
                  <span className='text-sm text-gray-300'>
                    {participant.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
});

ParticipantList.displayName = 'ParticipantList';
