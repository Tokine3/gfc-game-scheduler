import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ description: 'DiscordユーザID' })
  id: string;

  @ApiProperty({ description: 'ユーザー名' })
  name: string;

  @ApiProperty({ description: 'アバター画像URL', nullable: true })
  avatar?: string;

  @ApiProperty({ description: '作成日時' })
  createdAt: Date;

  @ApiProperty({ description: '更新日時' })
  updatedAt: Date;

  @ApiProperty({ description: '最終ログイン日時' })
  lastLoggedInAt: Date;
}

export class FindAllUser {
  @ApiProperty({ description: 'ユーザー一覧', type: [User] })
  users: User[];

  @ApiProperty({ description: '総件数' })
  total: number;
}
