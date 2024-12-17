export type JwtPayload = {
  sub: string; // ユーザーID
  name: string; // ユーザー名
  iat?: number; // 発行時刻（自動で付与）
  exp?: number; // 有効期限（自動で付与）
};
