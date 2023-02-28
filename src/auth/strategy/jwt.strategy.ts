import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { userId: number; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        biodata: true,
        birthdate: true,
        createdAt: true,
        displayName: true,
        email: true,
        id: true,
        updatedAt: true,
        username: true,
        closefriends: {
          select: {
            id: true,
            username: true,
            displayName: true,
            biodata: true,
          },
        },
      },
    });

    return user;
  }
}
