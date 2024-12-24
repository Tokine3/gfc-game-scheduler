import { FC } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ServerIcon,
  CalendarDays,
  Users,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { Server } from '../../types';
import { Button } from '../../../components/ui/button';
import { HeartCheckbox } from '../../../components/ui/heart-checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip';

type Props = {
  server: Server;
  isFavorite: boolean;
  onFavoriteChange: (serverId: string, isFavorite: boolean) => Promise<void>;
  onJoinServer: (server: Server) => Promise<void>;
  onCreateCalendar: (serverId: string) => void;
};

export const ServerCard: FC<Props> = ({
  server,
  isFavorite,
  onFavoriteChange,
  onJoinServer,
  onCreateCalendar,
}) => {
  const router = useRouter();

  const renderServerActions = () => {
    if (!server.isJoined) {
      return (
        <Button
          className='w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg shadow-violet-500/25 border border-violet-600/20'
          onClick={() => onJoinServer(server)}
        >
          <Users className='w-4 h-4 mr-2' />
          サーバーに参加
        </Button>
      );
    }

    return (
      <div className='space-y-3'>
        <div className='flex items-center justify-between px-1'>
          <div className='flex items-center gap-2'>
            <CalendarDays className='w-4 h-4 text-purple-400' />
            <span className='text-sm font-medium text-gray-300'>
              作成済みカレンダー
            </span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 hover:bg-gray-700/50 hover:text-purple-400 transition-colors'
                  onClick={() => onCreateCalendar(server.id)}
                >
                  <Plus className='w-4 h-4' />
                  <span className='sr-only'>新規作成</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side='top'
                className='bg-gray-800 border-gray-700'
              >
                <p>新規作成</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className='space-y-1.5'>
          {server.calendars.length > 0 ? (
            server.calendars.map((calendar) => (
              <Button
                key={calendar.id}
                variant='outline'
                className='w-full justify-start border-gray-700 hover:bg-gray-700/50 group relative overflow-hidden'
                onClick={() => router.push(`/calendar/${calendar.id}`)}
              >
                <div className='absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity' />
                <div className='relative flex items-center w-full'>
                  <div className='flex items-center gap-2 min-w-0'>
                    <div className='p-1 rounded-md bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors'>
                      <CalendarDays className='w-4 h-4' />
                    </div>
                    <span className='truncate text-gray-300 group-hover:text-gray-100 transition-colors'>
                      {calendar.name}
                    </span>
                  </div>
                  <div className='ml-auto pl-3'>
                    <div className='p-1 rounded-full hover:bg-gray-700/50 text-gray-400 opacity-0 group-hover:opacity-100 transition-all'>
                      <ArrowRight className='w-3 h-3' />
                    </div>
                  </div>
                </div>
              </Button>
            ))
          ) : (
            <div className='text-sm text-gray-500 text-center py-2'>
              カレンダーがありません
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className='group relative'
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className='absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300' />
      <div className='relative p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:bg-gray-800/70 transition-colors'>
        {/* サーバーアイコンと名前 */}
        <div className='flex items-start gap-4'>
          {server.icon ? (
            <div className='relative w-12 h-12 rounded-xl overflow-hidden ring-1 ring-gray-700/50'>
              <Image
                src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`}
                alt={server.name}
                fill
                sizes='20vw'
                className='object-cover'
              />
            </div>
          ) : (
            <div className='w-12 h-12 rounded-xl bg-gray-700/50 flex items-center justify-center'>
              <ServerIcon className='w-6 h-6 text-gray-400' />
            </div>
          )}
          <div className='flex-1 min-w-0'>
            <div className='flex items-center justify-between gap-2'>
              <div className='flex-1 min-w-0'>
                <h3 className='text-lg font-semibold text-gray-100 truncate'>
                  {server.name}
                </h3>
                {server.isJoined && (
                  <div className='mt-1.5 inline-flex items-center'>
                    <div className='px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-emerald-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] group-hover:border-emerald-500/40 transition-all'>
                      <div className='flex items-center gap-1.5'>
                        <div className='w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-pulse' />
                        <span className='text-xs font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'>
                          参加済み
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <HeartCheckbox
                className='text-gray-400 hover:text-pink-400 shrink-0'
                checked={isFavorite}
                onChange={(e) => onFavoriteChange(server.id, e.target.checked)}
              />
            </div>
            <div className='flex items-center gap-3 mt-1.5'>
              <div className='flex items-center gap-1 text-sm text-gray-400'>
                <CalendarDays className='w-4 h-4' />
                <span>{server.calendars.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-4 space-y-2'>{renderServerActions()}</div>
      </div>
    </motion.div>
  );
};
