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
  Req,
  Query,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { UpdatePublicScheduleDto } from './dto/update-publicSchedule.dto';
import { CreatePublicScheduleDto } from './dto/create-publicSchedule.dto';
import { RequestWithUser } from 'src/types/request.types';
import { ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  AllUserSchedules,
  PersonalSchedule,
  PersonalScheduleWithRelations,
  PublicScheduleWithRelations,
} from './entities/schedule.entity';
import { DiscordAuthGuard } from 'src/auth/discord-auth.guard';
import { FindAllUserSchedulesSchedulesDto } from './dto/findAllUserSchedules-schedules.dto';
import { FindMyPersonalSchedulesScheduleDto } from './dto/findMyPersonalSchedules-schedule.dto';
import { UpsertPersonalScheduleDto } from './dto/upsert-pesonalSchedule.dto';
import { FindPublicSchedulesScheduleDto } from './dto/findPublicShedules-schedules.dto';
import { RemovePublicScheduleDto } from './dto/remove-publicSchedule-schedules.dto';
import { RemovePersonalScheduleDto } from './dto/remove-personalSchedule-schedules.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @ApiOperation({ summary: '公開スケジュール作成' })
  @ApiResponse({
    status: 200,
    description: '公開スケジュール作成成功',
  })
  @ApiBody({
    type: CreatePublicScheduleDto,
    description: '公開スケジュール作成リクエスト',
  })
  @UseGuards(DiscordAuthGuard)
  @Post(':calendarId/public')
  createPublicSchedule(
    @Request() req: RequestWithUser,
    @Param('calendarId') calendarId: string,
    @Body() body: CreatePublicScheduleDto
  ) {
    return this.schedulesService.createPublicSchedule(req, calendarId, body);
  }

  @ApiOperation({
    summary: '個人スケジュールの一括更新',
    description: '指定された期間の個人スケジュールを一括で作成・更新します',
  })
  @ApiResponse({
    status: 201,
    description: '個人スケジュール作成成功',
    type: PersonalSchedule,
  })
  @ApiBody({
    type: [UpsertPersonalScheduleDto],
    description: '個人スケジュール作成リクエスト',
  })
  @UseGuards(DiscordAuthGuard)
  @Post(':calendarId/personal')
  upsertPersonalSchedules(
    @Request() req: RequestWithUser,
    @Param('calendarId') calendarId: string,
    @Body() body: [UpsertPersonalScheduleDto]
  ) {
    return this.schedulesService.upsertPersonalSchedules(req, calendarId, body);
  }

  @ApiOperation({ summary: 'ユーザーの個人スケジュール取得' })
  @ApiResponse({
    status: 200,
    description: 'ユーザーの個人スケジュール取得成功',
    type: [PersonalScheduleWithRelations],
  })
  @ApiQuery({
    type: FindMyPersonalSchedulesScheduleDto,
    description: 'ユーザーの個人スケジュール取得リクエスト',
  })
  @UseGuards(DiscordAuthGuard)
  @Get(':calendarId/me/personal')
  findMyPersonalSchedules(
    @Request() req: RequestWithUser,
    @Param('calendarId') calendarId: string,
    @Query() query: FindMyPersonalSchedulesScheduleDto
  ) {
    return this.schedulesService.findMyPersonalSchedules(
      req,
      calendarId,
      query
    );
  }

  @ApiOperation({ summary: '公開スケジュール取得' })
  @ApiResponse({
    status: 200,
    description: '公開スケジュール取得成功',
    type: [PublicScheduleWithRelations],
  })
  @ApiQuery({
    type: FindPublicSchedulesScheduleDto,
    description: '公開スケジュール取得リクエスト',
  })
  @Get(':calendarId/public')
  findPublicSchedules(
    @Request() req: RequestWithUser,
    @Query() query: FindPublicSchedulesScheduleDto,
    @Param('calendarId') calendarId: string
  ) {
    return this.schedulesService.findPublicSchedules(req, calendarId, query);
  }

  @ApiOperation({ summary: 'ユーザーのスケジュール取得' })
  @ApiResponse({
    status: 200,
    description: 'ユーザーのスケジュール取得成功',
    type: AllUserSchedules,
  })
  @ApiQuery({
    type: FindAllUserSchedulesSchedulesDto,
    description: 'ユーザーのスケジュール取得リクエスト',
  })
  @UseGuards(DiscordAuthGuard)
  @Get(':calendarId/all-schedules')
  findAllUserSchedules(
    @Req() req: RequestWithUser,
    @Param('calendarId') calendarId: string,
    @Query() query: FindAllUserSchedulesSchedulesDto
  ) {
    return this.schedulesService.findAllUserSchedules(req, calendarId, query);
  }

  @ApiOperation({ summary: '公開スケジュール更新' })
  @ApiResponse({
    status: 200,
    description: '公開スケジュール更新成功',
    type: PublicScheduleWithRelations,
  })
  @ApiBody({
    type: UpdatePublicScheduleDto,
    description: '公開スケジュール更新リクエスト',
  })
  @UseGuards(DiscordAuthGuard)
  @Patch(':id/public')
  updatePublicSchedule(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: UpdatePublicScheduleDto
  ) {
    return this.schedulesService.updatePublicSchedule(req, +id, body);
  }

  @ApiOperation({ summary: '公開スケジュール削除' })
  @ApiResponse({
    status: 200,
    description: '公開スケジュール削除成功',
    type: null,
  })
  @ApiBody({
    type: RemovePublicScheduleDto,
    description: '公開スケジュール削除リクエスト',
  })
  @UseGuards(DiscordAuthGuard)
  @Delete(':id/public')
  removePublicSchedule(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: RemovePublicScheduleDto
  ) {
    return this.schedulesService.removePublicSchedule(req, +id, body);
  }

  @ApiOperation({ summary: '個人スケジュール削除' })
  @ApiResponse({
    status: 204,
    description: '個人スケジュール削除成功',
    type: null,
  })
  @ApiBody({
    type: RemovePersonalScheduleDto,
    description: '個人スケジュール削除リクエスト',
  })
  @UseGuards(DiscordAuthGuard)
  @Delete(':id/personal')
  removePersonalSchedule(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: RemovePersonalScheduleDto
  ) {
    return this.schedulesService.removePersonalSchedule(req, +id, body);
  }
}
