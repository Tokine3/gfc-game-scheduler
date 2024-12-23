import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Req,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { DiscordAuthGuard } from '../auth/discord-auth.guard';
import { RequestWithUser } from 'src/types/request.types';
import { JoinServerDto } from './dto/join-server.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServerUser, ServerWithServerUser } from './entities/server.entity';
import { AddFavServerDto } from './dto/addFav-server-dto';

@ApiTags('Servers')
@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @ApiOperation({ summary: 'サーバーに参加する' })
  @ApiResponse({
    status: 200,
    description: 'サーバーに参加しました',
    type: ServerWithServerUser,
  })
  @Post('join')
  @UseGuards(DiscordAuthGuard)
  join(@Request() req: RequestWithUser, @Body() body: JoinServerDto) {
    return this.serversService.join(req, body);
  }

  @ApiOperation({ summary: '自身がサーバーに参加しているかどうかを取得する' })
  @ApiResponse({
    status: 200,
    description: 'サーバーに参加しているかどうか',
    type: Boolean,
  })
  @Get('me/server-user')
  @UseGuards(DiscordAuthGuard)
  findMeServerUser(
    @Request() req: RequestWithUser,
    @Query('serverId') serverId: string
  ) {
    return this.serversService.findMeServerUser(req, serverId);
  }

  @Get()
  findAll() {
    return this.serversService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serversService.findOne(+id);
  }

  @ApiOperation({ summary: 'サーバーをお気に入りに追加する' })
  @ApiResponse({
    status: 200,
    description: 'サーバーをお気に入りに追加しました',
    type: ServerUser,
  })
  @UseGuards(DiscordAuthGuard)
  @Patch('fav/:id')
  async addFavorite(
    @Param('id') id: string,
    @Body() addFavServerDto: AddFavServerDto,
    @Req() req: RequestWithUser
  ) {
    return this.serversService.addFavorite(id, addFavServerDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serversService.remove(+id);
  }
}
