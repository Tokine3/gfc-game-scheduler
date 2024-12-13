import { forwardRef } from 'react';
import { cn } from '../../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, variant = 'default', size = 'default', ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type='button'
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium',
          'transition-colors focus-visible:outline-none focus-visible:ring-1',
          'disabled:pointer-events-none disabled:opacity-50',
          variant === 'outline'
            ? 'border border-gray-700 bg-transparent hover:bg-gray-800'
            : 'bg-gray-800 text-gray-200 hover:bg-gray-700',
          size === 'icon' ? 'h-9 w-9 p-0' : 'px-4 py-2',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
