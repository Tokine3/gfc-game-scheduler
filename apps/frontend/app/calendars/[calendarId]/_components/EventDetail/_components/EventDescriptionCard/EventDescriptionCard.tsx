import { FC } from 'react';
import { MessageSquare } from 'lucide-react';

type Props = {
  description: string;
};

export const EventDescriptionCard: FC<Props> = ({ description }) => (
  <div className='p-4 rounded-lg bg-gray-800/50 border border-gray-700/50'>
    <div className='flex items-center gap-2 mb-3'>
      <MessageSquare className='w-5 h-5 text-indigo-400' />
      <span className='font-medium text-gray-300'>説明</span>
    </div>
    <p className='text-gray-400 whitespace-pre-wrap'>
      {description || '説明はありません'}
    </p>
  </div>
);
