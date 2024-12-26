'use client';

import { FC } from 'react';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { ServerIcon } from 'lucide-react';

interface Props {
  totalServers: number;
  joinedServers: number;
  activeTab: 'joined' | 'all';
  onTabChange: (value: 'joined' | 'all') => void;
}

export const ServersHeader: FC<Props> = ({
  totalServers,
  joinedServers,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='p-3 rounded-xl bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-violet-400'>
            <ServerIcon className='w-6 h-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-100'>サーバー一覧</h1>
            <div className='flex items-center gap-2 mt-1 text-sm text-gray-400'>
              <span>接続中のサーバー: {totalServers}</span>
              <span className='mx-1'>•</span>
              <span>参加済み: {joinedServers}</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as 'joined' | 'all')}>
          <span className='text-sm text-gray-400'>表示：</span>
          <TabsList className='border border-gray-700/50'>
            <TabsTrigger value='joined'>参加済み</TabsTrigger>
            <TabsTrigger value='all'>すべて</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
