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
  /** お気に入りかどうか */
  isFavorite: boolean;
  /** 参加しているかどうか */
  isJoined: boolean;
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

export type AddFavServerDto = {
  /** お気に入りフラグ */
  isFavorite: boolean;
  /** サーバーのメンバーかどうか */
  serversList: ServerWithRelations[];
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

export type ServerUserWithRelations = {
  /** サーバーに参加しているユーザーID */
  userId: string;
  /** サーバーID */
  serverId: string;
  /** お気に入りかどうか */
  isFavorite: boolean;
  /** 参加しているかどうか */
  isJoined: boolean;
  /** 参加日時 */
  createdAt: string;
  /** 更新日時 */
  updatedAt: string;

  /** ユーザー */
  user: User;
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
  /** 作成者名 */
  createdBy: string;
  /** 更新者名 */
  updatedBy: string;
  /** 作成日 */
  createdAt: string;
  /** 更新日 */
  updatedAt: string;
  /** 募集人数 */
  quota: number;
  /** 募集状況 */
  isRecruiting: boolean;
  /** 個人予定フラグ */
  isPersonal: boolean;
  /** 削除フラグ */
  isDeleted: boolean;
  /** 参加者 */
  participants: Participant[];

  /** サーバユーザ */
  serverUser: ServerUserWithRelations;
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
  /** 作成者名 */
  createdBy: string;
  /** 更新者名 */
  updatedBy: string;
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

  /** サーバユーザ */
  serverUser: ServerUserWithRelations;
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
  name: string;
};

export type CreatePublicScheduleDto = {
  /** 日付 */
  date: string;
  /** タイトル */
  title: string;
  /** 説明 */
  description?: string | undefined;
  /** 募集人数 */
  quota?: number | undefined;
};

export type UpsertPersonalScheduleDto = {
  /** 日付 */
  date: string;
  /** タイトル */
  title?: string | undefined;
  /** 説明 */
  description?: string | undefined;
  /** 非公開フラグ */
  isPrivate?: boolean | undefined;
  /** 空きフラグ */
  isFree?: boolean | undefined;
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
  /** 作成者名 */
  createdBy: string;
  /** 更新者名 */
  updatedBy: string;
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
};

export type AllUserSchedules = {
  /** 個人スケジュール */
  personalSchedules: PersonalScheduleWithRelations[];
  /** 公開スケジュール */
  publicSchedules: PublicScheduleWithRelations[];
};

export type UpdateScheduleDto = {};

export type RemovePublicScheduleDto = {
  /** カレンダーID */
  calendarId: string;
  /** 削除フラグ */
  isDeleted: boolean;
};

export type RemovePersonalScheduleDto = {
  /** カレンダーID */
  calendarId: string;
};
