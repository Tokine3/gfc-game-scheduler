import { Injectable } from '@nestjs/common';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePublicScheduleDto } from './dto/create-publicSchedule.dto';
import { CreatePersonalScheduleDto } from './dto/create-pesonalSchedule.dto';
import { RequestWithUser } from 'src/types/request.types';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  createPublicSchedule(req: RequestWithUser, body: CreatePublicScheduleDto) {
    console.log('createPublicSchedule', req, body);
    return;
  }

  createPersonalSchedule(
    req: RequestWithUser,
    body: CreatePersonalScheduleDto[]
  ) {
    console.log('createPersonalSchedule', body);
    return;
  }

  findAll() {
    return `This action returns all schedules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
