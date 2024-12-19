import { Module, OnModuleInit } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { DiscordStrategy } from './discord.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { admin } from '../utils/firebase';
import { DiscordAuthGuard } from './discord-auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'discord' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '24h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, DiscordStrategy, PrismaService, DiscordAuthGuard],
  exports: [AuthService],
})
export class AuthModule implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    if (!admin.apps.length) {
      try {
        const privateKey = this.configService
          .get<string>('FIREBASE_PRIVATE_KEY')
          ?.replace(/\\n/g, '\n');

        if (!privateKey) {
          throw new Error('FIREBASE_PRIVATE_KEY is not set');
        }

        const projectId = this.configService.get('FIREBASE_PROJECT_ID');
        const clientEmail = this.configService.get('FIREBASE_CLIENT_EMAIL');

        console.log('Firebase Admin Config:', {
          projectId,
          clientEmail,
          privateKeyLength: privateKey.length,
        });

        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
          projectId,
        });

        // 初期化テスト
        const testToken = await admin.auth().createCustomToken('test-user', {
          role: 'test',
        });
        console.log('Firebase Admin initialized:', {
          hasToken: !!testToken,
          projectId: admin.app().options.projectId,
        });
      } catch (error) {
        console.error('Firebase Admin initialization error:', error);
        throw error;
      }
    }
  }
}
