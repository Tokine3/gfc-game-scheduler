import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { logger } from './utils/logger';

// UTCプラグインを追加
dayjs.extend(utc);

async function bootstrap() {
  // タイムゾーンを明示的に設定
  process.env.TZ = 'Asia/Tokyo';
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('GFC Scheduler API')
    .setDescription('GFC Scheduler API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Swagger JSONをファイルとして出力
  const fs = require('fs');
  fs.writeFileSync('./swagger.json', JSON.stringify(document));

  // CORSを有効化
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: [
      'content-type',
      'authorization',
      'x-discord-id',
      'x-discord-token',
    ],
  });

  // Railwayが提供するPORTを使用
  const port = process.env.PORT || 8000;
  await app.listen(port);
  logger.log(`Application is running on: ${port}`);
}
bootstrap();
