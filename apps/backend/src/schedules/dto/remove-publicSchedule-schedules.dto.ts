import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class RemovePublicScheduleDto {
  @ApiProperty({ description: 'カレンダーID' })
  @IsNotEmpty()
  @IsString()
  calendarId: string;

  @ApiProperty({ description: '削除フラグ' })
  @IsNotEmpty()
  @IsBoolean()
  isDeleted: boolean;
}
