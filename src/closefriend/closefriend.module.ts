import { Module } from '@nestjs/common';
import { ClosefriendService } from './closefriend.service';
import { ClosefriendController } from './closefriend.controller';

@Module({
  controllers: [ClosefriendController],
  providers: [ClosefriendService],
})
export class ClosefriendModule {}
