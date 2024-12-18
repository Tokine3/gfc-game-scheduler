import { Module } from '@nestjs/common';
import { CalendarsService } from './calendars.service';
import { CalendarsController } from './calendars.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CalendarsController],
  providers: [CalendarsService, PrismaService],
})
export class CalendarsModule {}
