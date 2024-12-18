import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCalendarDto {
  @ApiProperty({ description: 'カレンダー名' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'サーバーID' })
  @IsNotEmpty()
  @IsString()
  serverId: string;

  @ApiProperty({ description: 'サーバー名' })
  @IsNotEmpty()
  @IsString()
  serverName: string;

  @ApiProperty({ description: 'サーバーアイコンURL', nullable: true })
  @IsString()
  icon: string | null;
}
