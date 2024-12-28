import { User } from 'src/user/entities/user.entity';
import { Calendar } from '../../calendars/entities/calendar.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class Server {
  @ApiProperty({ description: 'サーバーID' })
  id: string;
  @ApiProperty({ description: 'サーバー名' })
  name: string;
  @ApiProperty({ description: 'サーバーアイコンURL', nullable: true })
  icon: string | null;
}

export class ServerUser {
  @ApiProperty({ description: 'サーバーに参加しているユーザーID' })
  userId: string;

  @ApiProperty({ description: 'サーバーID' })
  serverId: string;

  @ApiProperty({ description: 'お気に入りかどうか' })
  isFavorite: boolean;

  @ApiProperty({ description: '参加しているかどうか' })
  isJoined: boolean;

  @ApiProperty({ description: '参加日時' })
  createdAt: Date;

  @ApiProperty({ description: '更新日時' })
  updatedAt: Date;
}

export class ServerWithRelations extends Server {
  @ApiProperty({ description: 'カレンダー', type: [Calendar] })
  calendars: Calendar[];

  @ApiProperty({
    description: 'サーバーに参加しているユーザー',
    type: [ServerUser],
  })
  serverUsers: ServerUser[];
}

export class ServerUserWithRelations extends ServerUser {
  @ApiProperty({ description: 'ユーザー' })
  @Type(() => User)
  user: User;
}

export class ServerWithServerUser extends Server {
  @ApiProperty({
    description: 'サーバーに参加しているユーザー',
    type: ServerUser,
  })
  serverUser: ServerUser;
}
