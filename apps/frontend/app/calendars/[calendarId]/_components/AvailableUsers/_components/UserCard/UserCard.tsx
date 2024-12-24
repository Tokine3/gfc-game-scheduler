import { FC, memo } from 'react';
import { User, Star, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../../../../../lib/utils';

type Props = {
  user: {
    id: string;
    name: string;
    avatar: string | null;
    isJoined: boolean;
  };
  index: number;
};

export const UserCard: FC<Props> = memo(({ user, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ delay: index * 0.05 }}
    className='group relative flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/5'
  >
    <div className='flex-shrink-0 relative'>
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className={cn(
            'w-10 h-10 rounded-full border-2 transition-colors',
            user.isJoined
              ? 'border-emerald-500/50 group-hover:border-emerald-500/70'
              : 'border-gray-700 group-hover:border-violet-500/50'
          )}
        />
      ) : (
        <div className='w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center group-hover:bg-gray-600 transition-colors'>
          <User className='w-5 h-5 text-gray-400' />
        </div>
      )}
      <div
        className={cn(
          'absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center',
          user.isJoined
            ? 'bg-emerald-500/20 border border-emerald-500/30'
            : 'bg-violet-500/20 border border-violet-500/30'
        )}
      >
        <div
          className={cn(
            'w-2 h-2 rounded-full',
            user.isJoined ? 'bg-emerald-400' : 'bg-violet-400'
          )}
        />
      </div>
    </div>
    <div className='min-w-0 flex-1'>
      <p className='text-sm font-medium text-gray-200 group-hover:text-gray-100 transition-colors'>
        {user.name}
      </p>
      {user.isJoined && <p className='text-xs text-emerald-400/80'>参加済み</p>}
    </div>
    <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
      {!user.isJoined && (
        <button className='p-1.5 rounded-md hover:bg-gray-700/50 text-gray-400 hover:text-violet-400 transition-colors'>
          <Star className='w-4 h-4' />
        </button>
      )}
      <button className='p-1.5 rounded-md hover:bg-gray-700/50 text-gray-400 hover:text-violet-400 transition-colors'>
        <Mail className='w-4 h-4' />
      </button>
    </div>
  </motion.div>
));

UserCard.displayName = 'UserCard';
