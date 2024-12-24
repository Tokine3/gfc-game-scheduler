'use client';

import { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../../components/ui/dialog';
import { CrosshairIcon, UserIcon, Gamepad2, Users } from 'lucide-react';
import { EventTypeButton } from './_components';
type Props = {
  onClose: () => void;
  onSelectEvent: () => void;
  onSelectPersonal: () => void;
};

export const EventTypeSelector: FC<Props> = ({
  onClose,
  onSelectEvent,
  onSelectPersonal,
}) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='bg-gray-900/95 backdrop-blur-md border-gray-800 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-gray-100 flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border border-violet-500/20'>
              <Gamepad2 className='w-5 h-5 text-violet-400' />
            </div>
            イベントの種類を選択
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-400'>
            作成するイベントの種類を選択してください
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <EventTypeButton
            mainIcon={CrosshairIcon}
            subIcon={Users}
            title='ゲームイベント'
            description='参加者を募集して一緒にプレイするイベントを作成します。募集人数や説明を設定できます。'
            tags={['参加者募集', 'チーム練習']}
            onClick={onSelectEvent}
            colorScheme='violet'
          />

          <EventTypeButton
            mainIcon={UserIcon}
            subIcon={Gamepad2}
            title='個人予定'
            description='自分の練習予定や空き時間を登録します。他のメンバーに予定を共有できます。'
            tags={['個人練習', '空き時間']}
            onClick={onSelectPersonal}
            colorScheme='purple'
            delay={0.1}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventTypeSelector;
