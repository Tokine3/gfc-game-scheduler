import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async login(discordId: string) {
    if (!discordId) {
      throw new NotFoundException('Discord ID not found');
    }

    const user = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: discordId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return await tx.user.update({
        where: { id: discordId },
        data: {
          lastLoggedInAt: new Date(),
        },
      });
    });

    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
