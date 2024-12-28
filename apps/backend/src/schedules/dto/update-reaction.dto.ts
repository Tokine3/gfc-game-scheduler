import { ApiProperty } from '@nestjs/swagger';
import { Reaction } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateReactionDto {
  @ApiProperty({ description: 'カレンダーID' })
  @IsString()
  @IsNotEmpty()
  calendarId: string;

  @ApiProperty({ description: '参加者反応', enum: Reaction })
  @IsEnum(Reaction)
  @IsNotEmpty()
  reaction: Reaction;
}
