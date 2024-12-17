import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';
import { AuthUserDto } from './dto/auth-user.dto';
import { JwtPayload } from '../types/jwt.types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async validateUser(discordUser: AuthUserDto) {
    const { id, name, avatar } = discordUser;
    console.log('validateUser', id, name, avatar);
    let user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          id,
          name,
          avatar,
          lastLoggedInAt: new Date(),
        },
      });
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          avatar,
          lastLoggedInAt: new Date(),
        },
      });
    }

    return user;
  }

  async login(user: AuthUserDto) {
    const payload: JwtPayload = {
      sub: user.id,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
