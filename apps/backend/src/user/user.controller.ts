import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Headers,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestWithUser } from 'src/types/request.types';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FindAllUserDto } from './dto/findAll-user.dto';
import { FindAllUser, User } from './entities/user.entity';
import { logger } from 'src/utils/logger';
import { DiscordAuthGuard } from 'src/auth/discord-auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '検索条件に当てはまるユーザの全取得' })
  @ApiResponse({
    status: 200,
    description: '検索条件に当てはまるユーザの取得成功',
    type: FindAllUser,
  })
  @UseGuards(DiscordAuthGuard)
  @Get()
  findAll(@Query() query: FindAllUserDto) {
    return this.userService.findAll(query);
  }

  @ApiOperation({ summary: '認証済みでのログイン' })
  @ApiResponse({
    status: 200,
    description: '最終ログイン時間の更新と自身のデータ取得成功',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('login')
  @UseGuards(DiscordAuthGuard)
  async login(@Request() req: RequestWithUser) {
    logger.log('login', req.user.id);
    return await this.userService.login(req.user.id);
  }

  @ApiOperation({ summary: 'ログイン中のユーザの取得' })
  @ApiResponse({
    status: 200,
    description: 'ログイン中のユーザの取得成功',
    type: User,
  })
  @UseGuards(DiscordAuthGuard)
  @Get('me')
  me(@Request() req: RequestWithUser) {
    return this.userService.me(req.user.id);
  }

  @ApiOperation({ summary: '指定したユーザの取得' })
  @ApiResponse({
    status: 200,
    description: '指定したユーザの取得成功',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(DiscordAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'ユーザの更新' })
  @ApiResponse({
    status: 200,
    description: 'ユーザの更新成功',
    type: User,
  })
  @UseGuards(DiscordAuthGuard)
  @Patch(':id')
  update(@Request() req: RequestWithUser, @Body() body: UpdateUserDto) {
    return this.userService.update(req.user.id, body);
  }

  @ApiOperation({ summary: 'ユーザの削除' })
  @ApiResponse({
    status: 200,
    description: 'ユーザの削除成功',
  })
  @UseGuards(DiscordAuthGuard)
  @Delete(':id')
  remove(@Request() req: RequestWithUser) {
    return this.userService.remove(req.user.id);
  }
}
