import { User } from 'src/user/entities/user.entity';
import { Calendar } from '../../calendars/entities/calendar.entity';
import { ApiProperty } from '@nestjs/swagger';

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

export class ServerWithServerUser extends Server {
  @ApiProperty({
    description: 'サーバーに参加しているユーザー',
    type: ServerUser,
  })
  serverUser: ServerUser;
}
