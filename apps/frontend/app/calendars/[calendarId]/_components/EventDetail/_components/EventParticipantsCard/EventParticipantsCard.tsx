import { FC } from 'react';
import { Users } from 'lucide-react';
import type { Participant } from '../../types';
import { ParticipantList } from '../ParticipantList/ParticipantList';

type Props = {
  participants: Participant[];
  quota: number;
};

export const EventParticipantsCard: FC<Props> = ({ participants, quota }) => (
  <div className='p-4 rounded-lg bg-gray-800/50 border border-gray-700/50'>
    <div className='flex items-center justify-between mb-3'>
      <div className='flex items-center gap-2'>
        <Users className='w-5 h-5 text-emerald-400' />
        <span className='font-medium text-gray-300'>参加者</span>
      </div>
      <div className='text-sm text-gray-400'>
        {participants.filter((p) => p.reaction === 'OK').length}/{quota}
      </div>
    </div>
    <ParticipantList participants={participants} quota={quota} />
  </div>
);
