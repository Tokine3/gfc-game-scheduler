'use client';

import * as React from 'react';
import { cn } from '../../../lib/utils';

interface SegmentOption {
  value: string;
  label: string;
}

interface SegmentProps {
  value: string;
  options: SegmentOption[];
  onChange: (value: string) => void;
  className?: string;
}

export function Segment({ value, options, onChange, className }: SegmentProps) {
  return (
    <div className={cn('flex bg-gray-900/50 rounded-lg p-1', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/40',
            value === option.value
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
