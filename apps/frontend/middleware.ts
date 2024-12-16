import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const isLoginPage =
    request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login';

  // トークンがある場合（認証済み）
  if (token) {
    // ログインページにアクセスしようとした場合はホームページにリダイレクト
    if (isLoginPage) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return NextResponse.next();
  }

  // トークンがない場合（未認証）
  if (!isLoginPage) {
    // ログインページ以外にアクセスしようとした場合はログインページにリダイレクト
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// ミドルウェアを適用するパス
export const config = {
  matcher: ['/', '/login', '/home'],
};
