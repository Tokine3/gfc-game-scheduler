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
} from '@nestjs/common';
import { CalendarsService } from './calendars.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { RequestWithUser } from '../types/request.types';
import { ApiResponse } from '@nestjs/swagger';
import { Calendar, CalendarWithRelations } from './entities/calendar.entity';
import { DiscordAuthGuard } from 'src/auth/discord-auth.guard';

@Controller('calendars')
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {}

  @ApiResponse({
    status: 201,
    description: 'カレンダー作成成功',
    type: CalendarWithRelations,
  })
  @Post()
  @UseGuards(DiscordAuthGuard)
  create(@Request() req: RequestWithUser, @Body() body: CreateCalendarDto) {
    return this.calendarsService.create(req, body);
  }

  @Get()
  findAll() {
    return this.calendarsService.findAll();
  }

  @ApiResponse({
    status: 201,
    description: 'カレンダー取得成功',
    type: CalendarWithRelations,
  })
  @UseGuards(DiscordAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calendarsService.findOne(id);
  }

  @ApiResponse({
    status: 200,
    description: 'カレンダー更新成功',
    type: CalendarWithRelations,
  })
  @UseGuards(DiscordAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Body() updateCalendarDto: UpdateCalendarDto
  ) {
    return this.calendarsService.update(id, req, updateCalendarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calendarsService.remove(+id);
  }
}
