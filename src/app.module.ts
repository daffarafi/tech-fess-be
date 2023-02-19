import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PostingModule } from './posting/posting.module';
import { ClosefriendModule } from './closefriend/closefriend.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    PostingModule,
    ClosefriendModule,
  ],
})
export class AppModule {}
