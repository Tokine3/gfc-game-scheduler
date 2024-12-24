import { FC } from 'react';
import { CalendarDays, CrosshairIcon, UserIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../../../components/ui/tooltip';
import { Button } from '../../../../../../components/ui/button';

type Props = {
  onEventCreate: () => void;
  onPersonalEventCreate: () => void;
};

export const ActionBar: FC<Props> = ({
  onEventCreate,
  onPersonalEventCreate,
}) => (
  <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4'>
    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
      <div className='flex items-center gap-4'>
        <div className='p-2.5 bg-purple-500/10 rounded-lg'>
          <CalendarDays className='w-5 h-5 text-purple-400' />
        </div>
        <div className='space-y-1'>
          <h2 className='text-lg font-semibold text-gray-100'>
            イベントカレンダー
          </h2>
          <p className='text-sm text-gray-400'>
            ゲームイベントや個人の予定を管理できます
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:flex gap-2 w-full sm:w-auto'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onEventCreate}
                className='w-full sm:w-auto bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg shadow-violet-500/25 border border-violet-600/20'
              >
                <CrosshairIcon className='w-4 h-4 sm:mr-2' />
                <span className='ml-2 sm:ml-0'>イベント作成</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom'>
              <p>新しいゲームイベントを作成</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onPersonalEventCreate}
                variant='outline'
                className='w-full sm:w-auto bg-gradient-to-r from-gray-900/50 to-gray-800/50 hover:from-gray-800/50 hover:to-gray-700/50 border-purple-500/20 text-purple-100 hover:text-purple-50 shadow-lg shadow-purple-500/10'
              >
                <UserIcon className='w-4 h-4 sm:mr-2' />
                <span className='ml-2 sm:ml-0'>個人予定作成</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom'>
              <p>個人の練習予定を作成</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  </div>
);
