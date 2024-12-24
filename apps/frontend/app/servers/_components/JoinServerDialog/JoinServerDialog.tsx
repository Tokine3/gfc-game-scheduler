import { FC } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../components/ui/dialog';
import { ServerIcon } from 'lucide-react';
import Image from 'next/image';
import type { Server } from '../../types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  server: Server | null;
  onConfirm: (server: Server) => Promise<void>;
  isSubmitting: boolean;
};

export const JoinServerDialog: FC<Props> = ({
  isOpen,
  onClose,
  server,
  onConfirm,
  isSubmitting,
}) => {
  if (!server) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-gray-900/95 backdrop-blur-md border-gray-800'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-gray-100 flex items-center gap-3'>
            <div className='relative w-8 h-8 rounded-lg overflow-hidden ring-1 ring-gray-700/50'>
              {server.icon ? (
                <Image
                  src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`}
                  alt={server.name}
                  fill
                  sizes='32px'
                  className='object-cover'
                />
              ) : (
                <div className='w-full h-full bg-gray-700/50 flex items-center justify-center'>
                  <ServerIcon className='w-4 h-4 text-gray-400' />
                </div>
              )}
            </div>
            {server.name}に参加
          </DialogTitle>
          <DialogDescription className='text-gray-400'>
            このサーバーに参加すると、カレンダーの作成や管理が可能になります。
          </DialogDescription>
        </DialogHeader>

        <div className='p-4 rounded-lg bg-gradient-to-r from-purple-500/5 to-cyan-500/5 border border-purple-500/10'>
          <div className='text-sm text-gray-300'>
            <p>参加すると以下の機能が利用可能になります：</p>
            <ul className='mt-2 space-y-1 text-gray-400'>
              <li>• カレンダーの作成と管理</li>
              <li>• イベントの作成と参加</li>
              <li>• メンバーとのスケジュール共有</li>
            </ul>
          </div>
        </div>

        <DialogFooter className='gap-2'>
          <Button
            variant='outline'
            onClick={onClose}
            className='border-gray-700 hover:bg-gray-800/60'
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
          <Button
            onClick={() => onConfirm(server)}
            className='bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg shadow-violet-500/25 border border-violet-600/20'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className='flex items-center gap-2'>
                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                参加中...
              </div>
            ) : (
              '参加する'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
