'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  CalendarDays,
  Users,
  ArrowRight,
  Github,
  Twitter,
  LogIn,
  Share2,
  Copy,
  LogOut,
} from 'lucide-react';
import { TermsModal } from '../components/TermsModal';
import { PrivacyPolicyModal } from '../components/PrivacyPolicyModal';
import Header from '../components/Header';
import { toast } from '../components/ui/use-toast';
import { LoadingScreen } from '../components/LoadingScreen';

export default function LoginPage() {
  const router = useRouter();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // トークンチェックとログアウトメッセージの処理
  useEffect(() => {
    // ログアウト成功メッセージの表示
    const logoutSuccess = sessionStorage.getItem('logoutSuccess');
    if (logoutSuccess) {
      toast({
        title: 'ログアウトしました',
        description: (
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center ring-1 ring-red-500/30'>
              <LogOut className='w-4 h-4 text-red-400' />
            </div>
            <span>またのご利用をお待ちしております</span>
          </div>
        ),
        className:
          'bg-gray-900/95 border border-gray-800/60 backdrop-blur-md fixed top-4 left-1/2 transform -translate-x-1/2',
        duration: 3000,
      });
      sessionStorage.removeItem('logoutSuccess');
    }

    // トークンチェック
    const checkToken = setTimeout(() => {
      const token = localStorage.getItem('token');
      if (token) {
        const redirectPath =
          sessionStorage.getItem('redirectPath') || '/servers';
        sessionStorage.removeItem('redirectPath');
        router.push(redirectPath);
      } else {
        setIsChecking(false);
      }
    }, 100);

    return () => clearTimeout(checkToken);
  }, [router]);

  if (isChecking) {
    return <LoadingScreen message='認証情報を確認中...' />;
  }

  const handleLogin = () => {
    try {
      const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
      const REDIRECT_URI = encodeURIComponent(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/discord/callback`
      );
      const state = Math.random().toString(36).substring(7); // ランダムな状態文字列を生成
      localStorage.setItem('discord_state', state); // 状態を保存

      const DISCORD_AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify%20guilds&state=${state}`;

      window.location.href = DISCORD_AUTH_URL;
    } catch (error) {
      toast({
        title: 'ログインに失敗しました',
        description: 'しばらく待ってから再度お試しください',
        className: 'bg-gray-900/95 border border-gray-800/60 backdrop-blur-md',
      });
      console.error('Login error:', error);
    }
  };

  // URLコピーボタンのクリックハンドラ
  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'URLをコピーしました',
      description: (
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center ring-1 ring-cyan-500/30'>
            <Copy className='w-4 h-4 text-cyan-400' />
          </div>
          <span>クリップボードにコピーされました</span>
        </div>
      ),
      className:
        'bg-gray-900/95 border border-gray-800/60 backdrop-blur-md fixed top-4 left-1/2 transform -translate-x-1/2',
      duration: 2000,
    });
  };

  return (
    <div className='min-h-screen bg-gray-900 flex flex-col'>
      {/* 装飾的な背景要素 */}
      <div className='fixed inset-0 z-0'>
        <div className='absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob' />
        <div className='absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000' />
        <div className='absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000' />
      </div>

      {/* 既存のヘッダーを削除し、共通のHeaderコンポーネントを使用 */}
      <Header />

      {/* メインコンテンツ */}
      <main className='flex-1 flex items-center justify-center p-4 mt-16 relative z-10'>
        <div className='w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
          {/* 左側: 説明部分 */}
          <div className='space-y-8'>
            <div className='space-y-4'>
              <motion.h2
                className='text-4xl sm:text-5xl font-bold'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400'>
                  ゲーマーのための
                </span>
                <br />
                <span className='text-gray-100'>スケジュール管理ツール</span>
              </motion.h2>
              <motion.p
                className='text-gray-400 text-lg leading-relaxed'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Discord サーバーと連携して、
                <br />
                ゲームの予定を簡単に管理できます。
              </motion.p>
            </div>

            {/* 機能一覧 */}
            <motion.div
              className='grid gap-4'
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial='hidden'
              animate='show'
            >
              {[
                {
                  icon: <Gamepad2 className='w-5 h-5' />,
                  title: 'イベント管理',
                  description: 'ゲームイベントを簡単に作成・管理',
                  color: 'purple',
                },
                {
                  icon: <CalendarDays className='w-5 h-5' />,
                  title: 'カレンダー共有',
                  description: 'メンバーと予定を共有・調整',
                  color: 'cyan',
                },
                {
                  icon: <Users className='w-5 h-5' />,
                  title: 'Discord 連携',
                  description: 'サーバーメンバーと簡単に共有',
                  color: 'indigo',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className='group flex items-start gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70 transition-colors'
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    show: { opacity: 1, x: 0 },
                  }}
                >
                  <div
                    className={`p-2.5 rounded-lg bg-${feature.color}-500/10 text-${feature.color}-400 group-hover:scale-110 transition-transform`}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className='font-medium text-gray-200'>
                      {feature.title}
                    </h3>
                    <p className='text-sm text-gray-400'>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* 右側: ログインフォーム */}
          <motion.div
            className='relative'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className='p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm'>
              <div className='text-center space-y-4 mb-6'>
                <div className='flex items-center justify-center gap-3 mb-2'>
                  <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center ring-1 ring-violet-500/30'>
                    <LogIn className='w-6 h-6 text-violet-400' />
                  </div>
                </div>
                <h2 className='text-2xl font-bold text-gray-100'>
                  ログインして始める
                </h2>
                <p className='text-gray-400'>
                  Discord アカウントでログインして、
                  <br />
                  サーバーのスケジュール管理を始めましょう
                </p>
              </div>

              <Button
                onClick={handleLogin}
                className='w-full h-12 bg-[#5865F2] hover:bg-[#4752C4] transition-all flex items-center justify-center gap-3 text-white hover:scale-[1.02] active:scale-[0.98]'
              >
                <div className='w-5 h-5 relative'>
                  <Image
                    src='/discord-logo.svg'
                    alt='Discord'
                    fill
                    className='object-contain'
                  />
                </div>
                <span>Discord でログイン</span>
                <ArrowRight className='w-4 h-4 ml-2' />
              </Button>

              <div className='mt-6 pt-6 border-t border-gray-700/50'>
                <div className='flex flex-col items-center gap-3 mb-4'>
                  <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center ring-1 ring-cyan-500/30'>
                    <Share2 className='w-6 h-6 text-cyan-400' />
                  </div>
                  <p className='text-lg text-gray-400'>友達に教える</p>
                </div>

                <div className='flex gap-2'>
                  <Button
                    onClick={handleCopyUrl}
                    variant='outline'
                    size='sm'
                    className='flex-1 border-gray-700 hover:bg-gray-800/60'
                  >
                    <Copy className='w-4 h-4 mr-2' />
                    URLをコピー
                  </Button>
                  <Button
                    onClick={() => {
                      const tweetText = encodeURIComponent(
                        'ゲーマーのためのスケジュール管理ツール「GFC Scheduler」を使ってみませんか？\n\n'
                      );
                      const tweetUrl = encodeURIComponent(window.location.href);
                      const intent = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`;

                      window.open(
                        intent,
                        '_blank',
                        'width=550,height=420,scrollbars=yes'
                      );
                    }}
                    size='sm'
                    className='flex-1 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white'
                  >
                    <Twitter className='w-4 h-4 mr-2' />
                    共有する
                  </Button>
                </div>
              </div>

              <p className='mt-4 text-center text-sm text-gray-500'>
                ログインすることで、
                <button
                  onClick={() => setShowTerms(true)}
                  className='text-violet-400 hover:text-violet-300 hover:underline transition-colors'
                >
                  利用規約
                </button>
                と
                <button
                  onClick={() => setShowPrivacyPolicy(true)}
                  className='text-violet-400 hover:text-violet-300 hover:underline transition-colors'
                >
                  プライバシーポリシー
                </button>
                に同意したことになります。
              </p>
            </div>

            {/* 装飾的な背景要素 */}
            <div className='absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl -z-10 blur-xl animate-pulse' />
          </motion.div>
        </div>
      </main>

      {/* フッター */}
      <footer className='relative z-10 border-t border-gray-800/60 bg-gray-900/95 backdrop-blur-md py-8'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
            <div className='flex items-center gap-2'>
              <div className='relative w-6 h-6 rounded-lg overflow-hidden'>
                <Image
                  src='/GFC.png'
                  alt='Logo'
                  fill
                  className='object-cover'
                />
              </div>
              <p className='text-sm text-gray-400'>
                © 2024 GFC Scheduler. All rights reserved.
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <a
                href='https://github.com/yourusername'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-gray-300 transition-colors'
              >
                <Github className='w-5 h-5' />
              </a>
              <a
                href='https://twitter.com/yourusername'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-gray-300 transition-colors'
              >
                <Twitter className='w-5 h-5' />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* モーダル */}
      <TermsModal open={showTerms} onOpenChange={setShowTerms} />
      <PrivacyPolicyModal
        open={showPrivacyPolicy}
        onOpenChange={setShowPrivacyPolicy}
      />
    </div>
  );
}
