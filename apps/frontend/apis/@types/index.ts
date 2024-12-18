/* eslint-disable */
export type Calendar = {
  /** カレンダーID */
  id: string;
  /** サーバーID */
  serverId: string;
  /** カレンダー名 */
  name: string;
  /** 作成日 */
  createdAt: string;
  /** 更新日 */
  updatedAt: string;
};

export type ServerUser = {
  /** サーバーに参加しているユーザーID */
  userId: string;
  /** サーバーID */
  serverId: string;
  /** 参加日時 */
  createdAt: string;
  /** 更新日時 */
  updatedAt: string;
};

export type ServerWithRelations = {
  /** サーバーID */
  id: string;
  /** サーバー名 */
  name: string;
  /** サーバーアイコンURL */
  icon: string | null;
  /** カレンダー */
  calendars: Calendar[];
  /** サーバーに参加しているユーザー */
  serverUsers: ServerUser[];
};

export type GetUserServersResponse = {
  /** サーバー */
  data: ServerWithRelations[];
  /** カレンダー数 */
  calendarCount: number;
};

export type User = {
  /** DiscordユーザID */
  id: string;
  /** ユーザー名 */
  name: string;
  /** アバター画像URL */
  avatar: string | null;
  /** 作成日時 */
  createdAt: string;
  /** 更新日時 */
  updatedAt: string;
  /** 最終ログイン日時 */
  lastLoggedInAt: string;
};

export type FindAllUser = {
  /** ユーザー一覧 */
  users: User[];
  /** 総件数 */
  total: number;
};

export type UpdateUserDto = {
  /** ユーザ名 */
  name?: string | undefined;
};

export type JoinServerDto = {
  /** 参加するサーバーのID */
  serverId: string;
  /** 参加するサーバーの名前 */
  serverName: string;
  /** 参加するサーバーのアイコン */
  serverIcon: string;
};

export type ServerWithServerUser = {
  /** サーバーID */
  id: string;
  /** サーバー名 */
  name: string;
  /** サーバーアイコンURL */
  icon: string | null;

  /** サーバーに参加しているユーザー */
  serverUser: ServerUser;
};

export type UpdateServerDto = {
  /** サーバー名 */
  name?: string | undefined;
  /** サーバーアイコン */
  icon?: string | undefined;
  /** サーバーID */
  serverId?: string | undefined;
};

export type CreateCalendarDto = {
  /** カレンダー名 */
  name: string;
  /** サーバーID */
  serverId: string;
  /** サーバー名 */
  serverName: string;
  /** サーバーアイコンURL */
  icon: string | null;
};

export type Server = {
  /** サーバーID */
  id: string;
  /** サーバー名 */
  name: string;
  /** サーバーアイコンURL */
  icon: string | null;
};

export type ScheduleUserInfo = {
  /** ユーザーID */
  id: string;
  /** ユーザー名 */
  name: string;
  /** アバターURL */
  avatar: string;
};

export type Participant = {
  /** 参加者ID */
  userId: string;
  /** 参加者名 */
  name: string;
  /** 参加者反応 */
  reaction: "OK" | "UNDECIDED" | "NG";
  /** 参加者反応日 */
  createdAt: string;
  /** 参加者反応更新日 */
  updatedAt: string;
};

export type PublicScheduleWithRelations = {
  /** ID */
  id: string;
  /** 日付 */
  date: string;
  /** タイトル */
  title: string;
  /** 説明 */
  description: string;

  /** 作成者情報 */
  createdBy: ScheduleUserInfo;

  /** 更新者情報 */
  updatedBy: ScheduleUserInfo;

  /** 作成者ID */
  createdById: string;
  /** 更新者ID */
  updatedById: string;
  /** 作成日 */
  createdAt: string;
  /** 更新日 */
  updatedAt: string;
  /** 募集人数 */
  recruitCount: number;
  /** 募集状況 */
  isRecruiting: boolean;
  /** 個人予定フラグ */
  isPersonal: boolean;
  /** 参加者 */
  participants: Participant[];
};

export type PersonalScheduleWithRelations = {
  /** ID */
  id: string;
  /** 日付 */
  date: string;
  /** タイトル */
  title: string;
  /** 説明 */
  description: string;

  /** 作成者情報 */
  createdBy: ScheduleUserInfo;

  /** 更新者情報 */
  updatedBy: ScheduleUserInfo;

  /** 作成者ID */
  createdById: string;
  /** 更新者ID */
  updatedById: string;
  /** 作成日 */
  createdAt: string;
  /** 更新日 */
  updatedAt: string;
  /** 非公開フラグ */
  isPrivate: boolean;
  /** 空き予定フラグ */
  isFree: boolean;
  /** 個人予定フラグ */
  isPersonal: boolean;

  /** 作成したユーザ */
  user: User;
};

export type CalendarWithRelations = {
  /** カレンダーID */
  id: string;
  /** サーバーID */
  serverId: string;
  /** カレンダー名 */
  name: string;
  /** 作成日 */
  createdAt: string;
  /** 更新日 */
  updatedAt: string;

  /** サーバー */
  server: Server;

  /** 公開予定 */
  publicSchedules: PublicScheduleWithRelations[];
  /** 個人予定 */
  personalSchedules: PersonalScheduleWithRelations[];
};

export type UpdateCalendarDto = {
  /** カレンダー名 */
  name?: string | undefined;
  /** サーバーID */
  serverId?: string | undefined;
  /** サーバー名 */
  serverName?: string | undefined;
  /** サーバーアイコンURL */
  icon?: string | null | undefined;
};

export type CreatePublicScheduleDto = {
  /** 日付 */
  date: string;
  /** タイトル */
  title: string;
  /** 説明 */
  description: string;
  /** 募集人数 */
  recruitCount: number;
};

export type CreatePersonalScheduleDto = {
  /** 日付 */
  date: string;
  /** タイトル */
  title: string;
  /** 説明 */
  description: string;
  /** 非公開フラグ */
  isPrivate: boolean;
  /** 無料フラグ */
  isFree: boolean;
};

export type PersonalSchedule = {
  /** ID */
  id: string;
  /** 日付 */
  date: string;
  /** タイトル */
  title: string;
  /** 説明 */
  description: string;

  /** 作成者情報 */
  createdBy: ScheduleUserInfo;

  /** 更新者情報 */
  updatedBy: ScheduleUserInfo;

  /** 作成者ID */
  createdById: string;
  /** 更新者ID */
  updatedById: string;
  /** 作成日 */
  createdAt: string;
  /** 更新日 */
  updatedAt: string;
  /** 非公開フラグ */
  isPrivate: boolean;
  /** 空き予定フラグ */
  isFree: boolean;
  /** 個人予定フラグ */
  isPersonal: boolean;

  /** 作成したユーザ */
  user: User;
};

export type UpdateScheduleDto = {};
