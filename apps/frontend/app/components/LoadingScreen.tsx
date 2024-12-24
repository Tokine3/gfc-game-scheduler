import { FC, ReactNode } from 'react';

type Props = {
  message?: ReactNode;
};

export const LoadingScreen: FC<Props> = ({ message = '読み込み中...' }) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm'>
      <div className='text-center'>
        <div className='w-16 h-16 border-4 border-t-purple-500 border-gray-700/50 rounded-full animate-spin mx-auto' />
        <div className='mt-4 text-gray-400 font-medium flex items-center gap-1 justify-center'>
          {message}
        </div>
      </div>
    </div>
  );
};
