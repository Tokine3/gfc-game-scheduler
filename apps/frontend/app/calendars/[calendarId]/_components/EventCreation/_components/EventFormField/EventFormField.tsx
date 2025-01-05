import { FC } from 'react';
import { LucideIcon } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../../../components/ui/form';
import { Input } from '../../../../../../components/ui/input';
import { Textarea } from '../../../../../../components/ui/textarea';
import { TimeSelect } from '../../../../../../components/ui/time-select';

type Props = {
  control: any;
  name: string;
  label: string;
  Icon: LucideIcon;
  type?: 'text' | 'number' | 'date' | 'time' | 'textarea';
  placeholder?: string;
  className?: string;
  min?: number;
};

export const EventFormField: FC<Props> = ({
  control,
  name,
  label,
  Icon,
  type = 'text',
  placeholder,
  className,
  min,
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={className}>
        <FormLabel className='text-gray-200 flex items-center gap-2'>
          <Icon className='w-4 h-4 text-violet-400' />
          {label}
        </FormLabel>
        <FormControl>
          {type === 'textarea' ? (
            <Textarea
              placeholder={placeholder}
              className='bg-gray-800/50 border-gray-700/50 text-gray-100 min-h-[120px] resize-none'
              {...field}
            />
          ) : type === 'time' ? (
            <TimeSelect value={field.value} onChange={field.onChange} />
          ) : (
            <Input
              maxLength={30}
              type={type}
              min={min}
              placeholder={placeholder}
              className='bg-gray-800/50 border-gray-700/50 text-gray-100'
              {...field}
              onChange={
                type === 'number'
                  ? (e) => field.onChange(parseInt(e.target.value))
                  : field.onChange
              }
            />
          )}
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
