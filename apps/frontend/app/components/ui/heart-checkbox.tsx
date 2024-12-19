'use client';

import * as React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface HeartCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const HeartCheckbox = React.forwardRef<HTMLInputElement, HeartCheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => (
    <label className='relative inline-block cursor-pointer'>
      <input
        type='checkbox'
        className='sr-only'
        ref={ref}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        {...props}
      />
      <Heart
        className={cn(
          'w-6 h-6 transition-all duration-200',
          checked
            ? 'fill-pink-500 stroke-pink-500'
            : 'stroke-gray-400 hover:stroke-pink-400',
          className
        )}
      />
    </label>
  )
);
HeartCheckbox.displayName = 'HeartCheckbox';

export { HeartCheckbox };
