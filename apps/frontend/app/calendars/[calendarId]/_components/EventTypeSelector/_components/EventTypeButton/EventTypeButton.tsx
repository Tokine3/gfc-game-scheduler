import { FC } from 'react';
import { Button } from '../../../../../../components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../../../../../../lib/utils';
import { motion } from 'framer-motion';

type Props = {
  mainIcon: LucideIcon;
  subIcon: LucideIcon;
  title: string;
  description: string;
  tags: string[];
  onClick: () => void;
  colorScheme: 'violet' | 'purple';
  delay?: number;
};

export const EventTypeButton: FC<Props> = ({
  mainIcon: MainIcon,
  subIcon: SubIcon,
  title,
  description,
  tags,
  onClick,
  colorScheme,
  delay = 0,
}) => {
  const colors = {
    violet: {
      hover: 'hover:from-violet-500/10 hover:to-indigo-500/10',
      border: 'border-violet-500/20 hover:border-violet-500/30',
      gradient: 'from-violet-500 to-indigo-500',
      icon: 'text-violet-400 group-hover:text-violet-300',
      iconBg: 'bg-violet-500/10 group-hover:bg-violet-500/20',
      text: 'group-hover:text-violet-100',
      tag: 'text-violet-400/75 bg-violet-500/10 border-violet-500/20',
    },
    purple: {
      hover: 'hover:from-purple-500/10 hover:to-pink-500/10',
      border: 'border-purple-500/20 hover:border-purple-500/30',
      gradient: 'from-purple-500 to-pink-500',
      icon: 'text-purple-400 group-hover:text-purple-300',
      iconBg: 'bg-purple-500/10 group-hover:bg-purple-500/20',
      text: 'group-hover:text-purple-100',
      tag: 'text-purple-400/75 bg-purple-500/10 border-purple-500/20',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay }}
    >
      <Button
        variant='outline'
        onClick={onClick}
        className={cn(
          'w-full h-auto p-4',
          'bg-gradient-to-r from-gray-900/50 to-gray-800/50',
          colors[colorScheme].hover,
          colors[colorScheme].border,
          'group relative overflow-hidden transition-all'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity',
            colors[colorScheme].gradient
          )}
        />
        <div className='flex items-start gap-4'>
          <div className='relative'>
            <div
              className={cn(
                'p-3 rounded-lg transition-colors',
                colors[colorScheme].iconBg
              )}
            >
              <MainIcon className={cn('w-6 h-6', colors[colorScheme].icon)} />
            </div>
            <div
              className={cn(
                'absolute -bottom-1 -right-1 p-1.5 rounded-md text-white shadow-lg',
                `bg-${colorScheme}-500`,
                `shadow-${colorScheme}-500/20`
              )}
            >
              <SubIcon className='w-3 h-3' />
            </div>
          </div>
          <div className='text-left'>
            <div
              className={cn(
                'font-semibold text-gray-100 mb-1',
                colors[colorScheme].text
              )}
            >
              {title}
            </div>
            <div className='text-sm text-gray-400 group-hover:text-gray-300'>
              {description}
            </div>
            <div className='flex items-center gap-2 mt-3 text-xs'>
              {tags.map((tag) => (
                <div
                  key={tag}
                  className={cn(
                    'px-2 py-1 rounded-md border',
                    colors[colorScheme].tag
                  )}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Button>
    </motion.div>
  );
};
