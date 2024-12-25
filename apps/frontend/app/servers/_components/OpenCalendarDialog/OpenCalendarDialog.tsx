import { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../components/ui/dialog';
import { CalendarDays } from 'lucide-react';
import { Calendar } from '../../../../apis/@types';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  calendar: Calendar | null;
  serverName: string;
  onConfirm: (calendarId: string) => void;
};

export const OpenCalendarDialog: FC<Props> = ({
  isOpen,
  onClose,
  calendar,
  serverName,
  onConfirm,
}) => {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isOpen && calendar?.id) {
      router.prefetch(`/calendars/${calendar.id}`);
    }
  }, [isOpen, calendar?.id, router]);

  const handleConfirm = useCallback(
    async (calendarId: string) => {
      setIsTransitioning(true);
      await new Promise((resolve) => setTimeout(resolve, 50));
      onConfirm(calendarId);
    },
    [onConfirm]
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isOpen && isTransitioning) {
      timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 200);
    }
    return () => clearTimeout(timer);
  }, [isOpen, isTransitioning]);

  const dialogContent = useMemo(
    () => (
      <DialogContent className='bg-gray-900/95 backdrop-blur-md border-gray-800'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-gray-100 flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-purple-500/10'>
              <CalendarDays className='w-5 h-5 text-purple-400' />
            </div>
            {calendar?.name}
          </DialogTitle>
          <DialogDescription className='text-gray-400'>
            {calendar?.name}に移動します。
          </DialogDescription>
        </DialogHeader>

        <div className='p-4 rounded-lg bg-gradient-to-r from-purple-500/5 to-cyan-500/5 border border-purple-500/10'>
          <div className='text-sm text-gray-300'>
            <p>カレンダーページでは以下の操作が可能です：</p>
            <ul className='mt-2 space-y-1 text-gray-400'>
              <li>• イベントの確認と参加</li>
              <li>• スケジュールの管理</li>
              <li>• メンバーの予定確認</li>
            </ul>
          </div>
        </div>

        <DialogFooter className='gap-2'>
          <Button
            variant='outline'
            onClick={onClose}
            className='border-gray-700 hover:bg-gray-800/60'
            disabled={isTransitioning}
          >
            キャンセル
          </Button>
          <Button
            onClick={() => handleConfirm(calendar?.id || '')}
            className='bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg shadow-violet-500/25 border border-violet-600/20'
            disabled={isTransitioning}
          >
            {isTransitioning ? (
              <div className='flex items-center gap-2'>
                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                カレンダーページへ移動中...
              </div>
            ) : (
              '開く'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    ),
    [calendar?.name, isTransitioning, handleConfirm]
  );

  if (!calendar) return null;

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => !isTransitioning && !open && onClose()}
      >
        {dialogContent}
      </Dialog>

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className='fixed inset-0 z-50 bg-gray-900'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LoadingScreen
              message={
                <div className='flex items-center gap-2'>
                  <span className='text-purple-400 font-semibold'>
                    {calendar.name}
                  </span>
                  <span>に移動中...</span>
                </div>
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
