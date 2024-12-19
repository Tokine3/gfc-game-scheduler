'use client';

import {
  Shield,
  User,
  Baby,
  Star,
  Heart,
  Lock,
  Users,
  Smile,
  AlertTriangle,
  AlertCircle,
  Calendar,
  Handshake,
  MessageCircleQuestion,
  Laugh,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';
import { privacyContent } from '../i18n/privacy';
import { LanguageSelect } from './ui/language-select';

type LanguageCode = 'ja' | 'en' | 'zh' | 'ko';

interface PrivacyPolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacyPolicyModal({
  open,
  onOpenChange,
}: PrivacyPolicyModalProps) {
  const [isKidsMode, setIsKidsMode] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>('ja');

  const content = privacyContent[language][isKidsMode ? 'kids' : 'adult'];

  // アイコンのマッピング
  const iconMap: { [key: string]: JSX.Element } = {
    Star: <Star className='w-5 h-5 text-yellow-400' />,
    Heart: <Heart className='w-5 h-5 text-red-400' />,
    Lock: <Lock className='w-5 h-5 text-violet-400' />,
    Shield: <Shield className='w-5 h-5 text-violet-400' />,
    Users: <Users className='w-5 h-5 text-blue-400' />,
    Calendar: <Calendar className='w-5 h-5 text-green-400' />,
    Smile: <Smile className='w-5 h-5 text-pink-400' />,
    AlertTriangle: <AlertTriangle className='w-5 h-5 text-yellow-400' />,
    AlertCircle: <AlertCircle className='w-5 h-5 text-orange-400' />,
    MessageCircle: <MessageCircleQuestion className='w-5 h-5 text-blue-400' />,
    Handshake: <Handshake className='w-5 h-5 text-blue-400' />,
    Laugh: <Laugh className='w-5 h-5 text-yellow-400' />,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[95vw] sm:w-[85vw] max-w-[900px] h-[100dvh] sm:h-[85vh] bg-gray-900/98 backdrop-blur-sm border-gray-700 shadow-2xl overflow-hidden'>
        <DialogHeader className='pb-4 space-y-4'>
          <div className='flex flex-col items-center justify-center'>
            <div className='bg-gradient-to-br from-violet-500/30 to-indigo-500/30 p-3.5 rounded-2xl border border-violet-500/30 shadow-lg'>
              <Shield className='h-7 w-7 text-violet-300' />
            </div>
          </div>
          <div className='text-center space-y-2'>
            <DialogTitle className='text-xl sm:text-2xl font-bold text-white'>
              {content.title}
            </DialogTitle>
            <DialogDescription className='text-sm sm:text-base text-gray-200'>
              {content.description}
            </DialogDescription>
          </div>
          <div className='flex justify-center'>
            <LanguageSelect
              language={language}
              isKids={isKidsMode}
              onChange={setLanguage}
            />
          </div>
        </DialogHeader>

        <div className='flex flex-col flex-1 min-h-0'>
          <ScrollArea className='flex-1 px-1.5 mt-2 rounded-xl border border-gray-700/50 bg-gray-800/50'>
            <div className='p-4 sm:p-6 space-y-6 sm:space-y-8'>
              {content.sections.map((section, index) => (
                <section key={index} className='space-y-2.5 sm:space-y-3.5'>
                  <h3 className='text-base sm:text-lg font-bold text-white flex items-center gap-2.5'>
                    {section.icon && iconMap[section.icon]}
                    {section.title}
                  </h3>
                  <p className='text-gray-50 leading-relaxed text-sm sm:text-base'>
                    {section.content}
                  </p>
                  {section.list && (
                    <ul className='space-y-3 sm:space-y-4 pl-2'>
                      {section.list.map((item, i) => (
                        <li
                          key={i}
                          className='flex items-start gap-2 sm:gap-3 text-gray-200 text-sm sm:text-base'
                        >
                          {section.icon && iconMap[section.icon]}
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </ScrollArea>

          <div className='mt-4 flex justify-between items-center border-t border-gray-700/50 pt-4 px-1.5 backdrop-blur-sm'>
            <button
              onClick={() => setIsKidsMode(!isKidsMode)}
              className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-white text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 sm:gap-2.5 shadow-lg ${
                isKidsMode
                  ? 'bg-slate-600 hover:bg-slate-500 active:bg-slate-700'
                  : 'bg-pink-500 hover:bg-pink-400 active:bg-pink-600'
              }`}
            >
              {isKidsMode ? (
                <>
                  <User className='w-6 h-6 sm:w-5 sm:h-5' />
                  <span>{content.switchToAdult}</span>
                </>
              ) : (
                <>
                  <Baby className='w-6 h-6 sm:w-5 sm:h-5' />
                  <span>{content.switchToKids}</span>
                </>
              )}
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className='px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-gray-100 text-xs sm:text-sm font-medium transition-all duration-200 shadow-lg'
            >
              {content.closeButton}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
