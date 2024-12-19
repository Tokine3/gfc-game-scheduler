'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Globe } from 'lucide-react';

interface LanguageSelectProps {
  language: 'ja' | 'en' | 'zh' | 'ko';
  isKids: boolean;
  onChange: (value: 'ja' | 'en' | 'zh' | 'ko') => void;
}

export function LanguageSelect({
  language,
  isKids,
  onChange,
}: LanguageSelectProps) {
  return (
    <Select value={language} onValueChange={onChange}>
      <SelectTrigger className='w-[140px] bg-gray-800/50 border-gray-700'>
        <Globe className='w-4 h-4 mr-2' />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className='bg-gray-900 border-gray-700'>
        <SelectItem value='ja'>{isKids ? 'にほんご' : '日本語'}</SelectItem>
        <SelectItem value='en'>English</SelectItem>
        <SelectItem value='zh'>中文</SelectItem>
        <SelectItem value='ko'>한국어</SelectItem>
      </SelectContent>
    </Select>
  );
}
