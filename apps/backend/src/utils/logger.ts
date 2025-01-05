import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const isDevelopment =
  configService.get('NODE_ENV') === 'development' ||
  configService.get('NODE_ENV') === 'local';

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info('[INFO]', ...args);
    }
  },
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
    // 本番環境では必要に応じてエラー監視サービスに送信するなど
  },

  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
};
