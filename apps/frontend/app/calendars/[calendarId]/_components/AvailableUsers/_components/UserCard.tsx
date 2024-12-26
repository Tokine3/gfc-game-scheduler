import { FC } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '../../../../../components/ui/avatar';
import { Check } from 'lucide-react';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    avatar: string | null;
    isFree: boolean;
  };
  index: number;
}

export const UserCard: FC<UserCardProps> = ({ user, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className='flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50'
    >
      <Avatar className='h-10 w-10 border border-gray-700/50'>
        <AvatarImage src={user.avatar || undefined} alt={user.name} />
        <AvatarFallback>{user.name[0]}</AvatarFallback>
      </Avatar>
      <div className='flex-1 min-w-0'>
        <div className='font-medium text-gray-200 truncate'>{user.name}</div>
        <div className='text-sm text-emerald-400 flex items-center gap-1'>
          <Check className='w-3.5 h-3.5' />
          空き予定あり
        </div>
      </div>
    </motion.div>
  );
}; 