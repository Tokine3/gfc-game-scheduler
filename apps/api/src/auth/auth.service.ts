import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async validateUser(discordUser: User) {
    let user = await this.prisma.user.findUnique({
      where: { discordId: discordUser.discordId },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          discordId: discordUser.discordId,
          name: discordUser.name,
          avatar: discordUser.avatar,
        },
      });
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name: discordUser.name,
          avatar: discordUser.avatar,
          updatedAt: new Date(),
        },
      });
    }

    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, discordId: user.discordId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
