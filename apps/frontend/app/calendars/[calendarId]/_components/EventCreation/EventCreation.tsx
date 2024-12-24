'use client';

import { FC, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Users,
  CalendarDays,
  Clock,
  MessageSquare,
  CrosshairIcon,
  Info,
  Loader2,
} from 'lucide-react';
import { client } from '../../../../../lib/api';
import { toast } from '../../../../components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Form } from '../../../../components/ui/form';
import { EventFormField } from './_components';

const formSchema = z.object({
  title: z.string().min(1, '必須項目です'),
  description: z.string().optional(),
  date: z.string().min(1, '必須項目です'),
  time: z.string().min(1, '必須項目です'),
  quota: z.number().min(1, '1人以上を指定してください'),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  onClose: () => void;
  date?: Date;
  calendarId: string;
};

export const EventCreation: FC<Props> = ({ onClose, date, calendarId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      date: date
        ? dayjs(date).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD'),
      time: dayjs().format('HH:mm'),
      quota: 1,
    },
  });

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setIsSubmitting(true);
      try {
        await client.schedules._calendarId(calendarId).public.$post({
          body: {
            title: values.title,
            description: values.description || '',
            date: dayjs(`${values.date} ${values.time}`).toISOString(),
            quota: values.quota,
          },
        });
        toast({
          title: 'イベントを作成しました',
          description: `「${values.title}」を作成しました`,
        });
        onClose();
      } catch (error) {
        console.error('Failed to create event:', error);
        toast({
          title: 'エラー',
          description: 'イベントの作成に失敗しました',
          variant: 'destructive',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [calendarId, onClose]
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='bg-gray-900/95 backdrop-blur-md border-gray-800 sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-gray-100 flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border border-violet-500/20'>
              <CrosshairIcon className='w-5 h-5 text-violet-400' />
            </div>
            ゲームイベントを作成
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-400'>
            参加者を募集するゲームイベントを作成できます
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6 py-4'
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className='space-y-4'
            >
              <div className='p-4 rounded-lg border border-violet-500/20 bg-violet-500/5 text-sm text-violet-200 flex items-start gap-2'>
                <Info className='w-4 h-4 mt-0.5 text-violet-400' />
                <div>
                  参加者を募集するゲームイベントを作成します。
                  <br />
                  募集人数や説明を設定して、メンバーを集めましょう。
                </div>
              </div>

              <EventFormField
                control={form.control}
                name='title'
                label='イベント名'
                Icon={Users}
                placeholder='例: スクリム練習会'
              />

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <EventFormField
                  control={form.control}
                  name='date'
                  label='開催日'
                  Icon={CalendarDays}
                  type='date'
                  className='w-full'
                />
                <EventFormField
                  control={form.control}
                  name='time'
                  label='開始時間'
                  Icon={Clock}
                  type='time'
                  className='w-full'
                />
              </div>

              <EventFormField
                control={form.control}
                name='quota'
                label='募集人数'
                Icon={Users}
                type='number'
                min={1}
              />

              <EventFormField
                control={form.control}
                name='description'
                label='説明'
                Icon={MessageSquare}
                type='textarea'
                placeholder='イベントの説明や参加に必要な情報を入力してください'
              />
            </motion.div>

            <div className='flex flex-col sm:flex-row gap-2 pt-2'>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='flex-1 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg shadow-violet-500/25 border border-violet-600/20'
              >
                {isSubmitting ? (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                ) : (
                  <CrosshairIcon className='w-4 h-4 mr-2' />
                )}
                イベントを作成
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={isSubmitting}
                className='flex-1 sm:flex-none border-gray-700 hover:bg-gray-800'
              >
                キャンセル
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EventCreation;
