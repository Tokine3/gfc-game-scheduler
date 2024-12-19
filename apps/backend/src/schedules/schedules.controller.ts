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
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CreatePublicScheduleDto } from './dto/create-publicSchedule.dto';
import { CreatePersonalScheduleDto } from './dto/create-pesonalSchedule.dto';
import { RequestWithUser } from 'src/types/request.types';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PersonalSchedule } from './entities/schedule.entity';
import { DiscordAuthGuard } from 'src/auth/discord-auth.guard';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @ApiOperation({ summary: '公開スケジュール作成' })
  @ApiResponse({
    status: 200,
    description: '公開スケジュール作成成功',
  })
  @UseGuards(DiscordAuthGuard)
  @Post('public')
  createPublicSchedule(
    @Request() req: RequestWithUser,
    @Body() body: CreatePublicScheduleDto
  ) {
    return this.schedulesService.createPublicSchedule(req, body);
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
  @Post('personal')
  createPersonalSchedule(
    @Request() req: RequestWithUser,
    @Body() body: [CreatePersonalScheduleDto]
  ) {
    return this.schedulesService.createPersonalSchedule(req, body);
  }

  @Get()
  findAll() {
    return this.schedulesService.findAll();
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
