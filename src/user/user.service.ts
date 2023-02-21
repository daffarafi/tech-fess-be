import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        displayName: true,
        username: true,
        birthdate: true,
        biodata: true,
        email: true,
      },
    });
    return users;
  }

  async getUserByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        displayName: true,
        username: true,
        birthdate: true,
        biodata: true,
        email: true,
        closefriends: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            displayName: true,
            username: true,
            birthdate: true,
            biodata: true,
            email: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User tidak ditemukan!');

    return user;
  }

  async checkEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        username: true,
      },
    });

    if (!user) return { message: `Tidak ada user dengan email ${email}` };

    return user;
  }

  async checkUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    });

    if (!user) return { message: `Tidak ada user dengan username ${username}` };

    return user;
  }

  async getUserPostingsByUserId(currentUserId: number | null, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        postings: true,
        closefriends: true,
      },
    });

    if (!user) throw new NotFoundException('User tidak ditemukan!');

    const { postings, closefriends } = user;
    const closefriendsId = closefriends.map((closefriend) => closefriend.id);

    const filteredPostings = postings.filter((posting) => {
      const isCloseFriend = closefriendsId.includes(currentUserId as number);
      return !posting.isPrivate || isCloseFriend;
    });

    return filteredPostings;
  }

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User tidak ditemukan!');

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    const { password, ...result } = updatedUser;

    return result;
  }
}
