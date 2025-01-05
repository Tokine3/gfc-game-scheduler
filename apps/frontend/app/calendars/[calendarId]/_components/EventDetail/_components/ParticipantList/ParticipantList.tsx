import { FC, memo } from 'react';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../../../../../components/ui/avatar';
import { ParticipantWithRelations } from '../../../../../../../apis/@types';
import { dateUtils } from '../../../../../../../lib/dateUtils';

type Props = {
  participants: ParticipantWithRelations[];
  quota: number;
};

export const ParticipantList: FC<Props> = memo(({ participants, quota }) => {
  const statuses = [
    { key: 'OK', icon: CheckCircle, label: '参加', color: 'text-emerald-400' },
    {
      key: 'PENDING',
      icon: HelpCircle,
      label: '未定',
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
            <div className='flex flex-col gap-2'>
              {filteredParticipants.map((participant) => (
                <div
                  key={participant.serverUser?.user?.id}
                  className='flex items-center justify-between p-2 rounded-lg bg-gray-800/50'
                >
                  <div className='flex items-center gap-2'>
                    <Avatar className='w-6 h-6'>
                      <AvatarImage
                        src={`https://cdn.discordapp.com/avatars/${participant.serverUser?.user?.id}/${participant.serverUser?.user?.avatar}`}
                        alt={participant.serverUser?.user?.name}
                      />
                      <AvatarFallback>
                        {participant.serverUser?.user?.name}
                      </AvatarFallback>
                    </Avatar>
                    <span className='text-sm text-gray-300'>
                      {participant.serverUser?.user?.name}
                    </span>
                  </div>
                  <time className='text-xs text-gray-500'>
                    {'更新日：' +
                      dateUtils.formatToDisplay(
                        participant.updatedAt,
                        'MM/DD HH:mm'
                      )}
                  </time>
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
