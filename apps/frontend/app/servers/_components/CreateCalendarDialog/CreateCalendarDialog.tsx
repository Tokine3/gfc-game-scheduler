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
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  calendarName: string;
  onCalendarNameChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
};

export const CreateCalendarDialog: FC<Props> = ({
  isOpen,
  onClose,
  calendarName,
  onCalendarNameChange,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-gray-900/95 backdrop-blur-md border-gray-800'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-gray-100'>
            カレンダーの作成
          </DialogTitle>
          <DialogDescription className='text-gray-400'>
            新しいカレンダーを作成します。
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-6 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='calendar-name' className='text-gray-200'>
              カレンダー名
            </Label>
            <Input
              id='calendar-name'
              placeholder='例: レイドイベント'
              value={calendarName}
              onChange={(e) => onCalendarNameChange(e.target.value)}
              className='bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500'
            />
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
            onClick={onSubmit}
            className='bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white shadow-lg shadow-purple-500/20'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className='flex items-center gap-2'>
                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                作成中...
              </div>
            ) : (
              '作成する'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
