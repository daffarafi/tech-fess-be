import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtCheck, JwtGuard } from '../auth/guard';
import { PostingService } from './posting.service';
import { PostingDto } from './dto';

@Controller('postings')
export class PostingController {
  constructor(private postingService: PostingService) {}

  @UseGuards(JwtCheck)
  @Get()
  getPostings(@GetUser('id') userId: number) {
    return this.postingService.getPostings(userId);
  }

  // @Get(':id')
  // getPostingById(
  //   @GetUser('id') userId: number,
  //   @Param('id', ParseIntPipe) postingId: number,
  // ) {
  //   return this.postingService.getPostingById(userId, postingId);
  // }

  @UseGuards(JwtGuard)
  @Post()
  createPosting(@GetUser('id') userId: number, @Body() dto: PostingDto) {
    return this.postingService.createPosting(userId, dto);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  editPostingById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) postingId: number,
    @Body() dto: PostingDto,
  ) {
    return this.postingService.editPostingById(userId, postingId, dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deletePostingById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) postingId: number,
  ) {
    return this.postingService.deletePostingById(userId, postingId);
  }
}
