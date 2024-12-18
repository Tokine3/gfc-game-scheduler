import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JoinServerDto {
  @ApiProperty({
    description: '参加するサーバーのID',
  })
  @IsString()
  serverId: string;

  @ApiProperty({
    description: '参加するサーバーの名前',
  })
  @IsString()
  serverName: string;

  @ApiProperty({
    description: '参加するサーバーのアイコン',
  })
  @IsString()
  serverIcon: string;
}
