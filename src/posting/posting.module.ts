import { Module } from '@nestjs/common';
import { PostingController } from './posting.controller';
import { PostingService } from './posting.service';

@Module({
  controllers: [PostingController],
  providers: [PostingService],
})
export class PostingModule {}
