import { ApiProperty } from '@nestjs/swagger';
import { ServerWithRelations } from 'src/servers/entities/server.entity';

export class GetUserServersResponse {
  @ApiProperty({ description: 'サーバー', type: [ServerWithRelations] })
  data: ServerWithRelations[];
  @ApiProperty({ description: 'カレンダー数' })
  calendarCount: number;
}
