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
import { CreatePersonalScheduleDto } from './dto/create-pesonalSchedule.dto';
import { RequestWithUser } from 'src/types/request.types';
import { ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AllUserSchedules, PersonalSchedule } from './entities/schedule.entity';
import { DiscordAuthGuard } from 'src/auth/discord-auth.guard';
import { FindAllUserSchedulesSchedulesDto } from './dto/findAllUserSchedules-schedules.dto';

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

  @ApiOperation({ summary: '個人スケジュール作成' })
  @ApiResponse({
    status: 201,
    description: '個人スケジュール作成成功',
    type: PersonalSchedule,
  })
  @ApiBody({
    type: [CreatePersonalScheduleDto],
    description: '個人スケジュール作成リクエスト',
  })
  @UseGuards(DiscordAuthGuard)
  @Post(':calendarId/personal')
  createPersonalSchedules(
    @Request() req: RequestWithUser,
    @Param('calendarId') calendarId: string,
    @Body() body: [CreatePersonalScheduleDto]
  ) {
    return this.schedulesService.createPersonalSchedules(req, calendarId, body);
  }

  @Get()
  findAll() {
    return this.schedulesService.findAll();
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
