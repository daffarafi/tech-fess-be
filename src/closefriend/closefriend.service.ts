import { Injectable, NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

type UserWithClosefriends = Prisma.UserGetPayload<{
  include: { closefriends: true };
}>;

@Injectable()
export class ClosefriendService {
  constructor(private prisma: PrismaService) {}

  async addCloseFriend(friendId: number, userId: number) {
    if (userId === friendId)
      throw new BadRequestException('Anda tidak dapat menambah diri sendiri!');

    const friend = await this.prisma.user.findUnique({
      where: { id: friendId },
    });

    if (!friend) {
      throw new NotFoundException('Akun yang dituju tidak ditemukan!');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { closefriends: true },
    });

    const { closefriends } = user as User & UserWithClosefriends;

    const isFriendAlreadyAdded = closefriends.some(
      (closefriend) => closefriend.id === friendId,
    );

    if (isFriendAlreadyAdded) {
      throw new BadRequestException(
        `${friend.displayName} sudah ditambahkan sebagai teman dekat sebelumnya!`,
      );
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { closefriends: { connect: { id: friendId } } },
    });

    return {
      message: `${friend.displayName} berhasil ditambahkan sebagai teman dekat!`,
    };
  }

  async removeCloseFriend(friendId: number, userId: number) {
    if (userId === friendId)
      throw new BadRequestException('Anda tidak dapat menghapus diri sendiri!');

    const friend = await this.prisma.user.findUnique({
      where: { id: friendId },
    });

    if (!friend) {
      throw new NotFoundException('Akun yang dituju tidak ditemukan!');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { closefriends: true },
    });

    const { closefriends } = user as User & UserWithClosefriends;

    const isFriendAlreadyAdded = closefriends.some(
      (closefriend) => closefriend.id === friendId,
    );

    if (!isFriendAlreadyAdded) {
      throw new BadRequestException(
        `${friend.displayName} belum pernah ditambahkan sebagai teman dekat sebelumnya!`,
      );
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        closefriends: {
          disconnect: { id: friendId },
        },
      },
    });

    return {
      message: `${friend.displayName} berhasil dihapus dari teman dekat!`,
    };
  }
}
