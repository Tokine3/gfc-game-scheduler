import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllUserDto } from './dto/findAll-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async login(id: string) {
    console.log('id', id);
    if (!id) {
      throw new NotFoundException('Discord ID not found');
    }

    const user = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return await tx.user.update({
        where: { id },
        data: {
          lastLoggedInAt: new Date(),
        },
      });
    });

    return user;
  }

  async me(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  findAll(query: FindAllUserDto) {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    const user = this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('ユーザが存在しません');
    }

    return user;
  }

  update(id: string, body: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...body,
      },
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
