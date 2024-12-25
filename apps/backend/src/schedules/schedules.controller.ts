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
import { UpdateScheduleDto } from './dto/update-schedule.dto';
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

  @Get()
  findAll() {
    return this.schedulesService.findAll();
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto
  ) {
    return this.schedulesService.update(+id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(+id);
  }
}
