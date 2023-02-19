import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { SignupAuthDto, LoginAuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: SignupAuthDto) {
    const { displayName, username, birthdate, email, password } = dto;
    const hashedPassword = await argon.hash(password);

    try {
      const user = await this.prisma.user.create({
        data: {
          displayName,
          username,
          birthdate,
          email,
          password: hashedPassword,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Username atau Email sudah terdaftar!');
        }
      }
      throw err;
    }
  }

  async login(dto: LoginAuthDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ForbiddenException('Email tidak ditemukan!');
    }

    const pwMatches = await argon.verify(user.password, password);

    if (!pwMatches) {
      throw new ForbiddenException('Password salah!');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string): Promise<object> {
    const payload = {
      userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
