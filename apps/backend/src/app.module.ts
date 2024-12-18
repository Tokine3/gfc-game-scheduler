import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServersModule } from './servers/servers.module';
import { CalendarsModule } from './calendars/calendars.module';
import { PrismaModule } from './prisma/prisma.module';
import { SchedulesModule } from './schedules/schedules.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ServersModule,
    CalendarsModule,
    SchedulesModule,
  ],
  controllers: [HealthController], // Railwayのヘルスチェック用
}) //
export class AppModule {}
