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
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
};
