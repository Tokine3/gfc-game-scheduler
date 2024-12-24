import { FC } from 'react';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

type Props = {
  totalServers: number;
  joinedServers: number;
};

export const ServersHeader: FC<Props> = ({ totalServers, joinedServers }) => {
  return (
    <motion.div
      className='space-y-4'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className='text-3xl font-bold text-gray-100'>サーバーを選択</h1>
      <div className='flex items-center gap-2 text-sm text-gray-400'>
        <Users className='w-4 h-4' />
        <span>接続中のサーバー: {totalServers}</span>
        <span className='mx-2'>•</span>
        <span>参加済み: {joinedServers}</span>
      </div>
      <p className='text-gray-400'>
        カレンダーを管理したいDiscordサーバーを選択してください
      </p>
    </motion.div>
  );
};
