import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostingDto } from './dto';

@Injectable()
export class PostingService {
  constructor(private prisma: PrismaService) {}

  getPostings(userId: number | null) {
    const query = userId
      ? {
          where: {
            OR: [
              {
                isPrivate: false,
              },
              {
                isPrivate: true,
                user: {
                  closefriends: { some: { id: userId } },
                },
              },
              {
                isPrivate: true,
                userId,
              },
            ],
          },
        }
      : {
          where: {
            OR: [{ isPrivate: false }],
          },
        };

    return this.prisma.posting.findMany({
      ...query,
      orderBy: { createdAt: 'desc' },
      select: {
        content: true,
        createdAt: true,
        id: true,
        isPrivate: true,
        updatedAt: true,
        userId: true,
        user: {
          select: {
            displayName: true,
            username: true,
          },
        },
      },
    });
  }

  // getPostingById(userId: number, postingId: number) {
  //   return this.prisma.posting.findFirst({
  //     where: {
  //       id: postingId,
  //       userId,
  //     },
  //   });
  // }

  async createPosting(userId: number, dto: PostingDto) {
    const posting = await this.prisma.posting.create({
      data: {
        userId,
        ...dto,
      },
    });

    return posting;
  }

  async editPostingById(userId: number, postingId: number, dto: PostingDto) {
    const posting = await this.prisma.posting.findUnique({
      where: {
        id: postingId,
      },
    });

    if (!posting || posting.userId !== userId)
      throw new ForbiddenException('Akses ditolak!');

    if (posting.content === dto.content) {
      throw new BadRequestException('Tidak ada perubahan pada content!');
    }

    return this.prisma.posting.update({
      where: {
        id: postingId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deletePostingById(userId: number, postingId: number) {
    const posting = await this.prisma.posting.findUnique({
      where: {
        id: postingId,
      },
    });

    // check if user owns the posting
    if (!posting || posting.userId !== userId)
      throw new ForbiddenException('Akses ditolak!');

    await this.prisma.posting.delete({
      where: {
        id: postingId,
      },
    });

    return { message: 'Postingan berhasil dihapus!' };
  }
}
