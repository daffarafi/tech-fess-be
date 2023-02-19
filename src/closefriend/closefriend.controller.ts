import { Controller, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { ClosefriendService } from './closefriend.service';
import { Delete, Post, Param } from '@nestjs/common/decorators';
import { GetUser } from '../auth/decorator';
import { ParseIntPipe } from '@nestjs/common/pipes';

@UseGuards(JwtGuard)
@Controller('closefriends')
export class ClosefriendController {
  constructor(private readonly closefriendService: ClosefriendService) {}

  @Post(':friendId')
  postCloseFriend(
    @Param('friendId', ParseIntPipe) friendId: number,
    @GetUser('id') userId: number,
  ) {
    return this.closefriendService.addCloseFriend(friendId, userId);
  }

  @Delete(':friendId')
  deleteCloseFriend(
    @Param('friendId', ParseIntPipe) friendId: number,
    @GetUser('id') userId: number,
  ) {
    return this.closefriendService.removeCloseFriend(friendId, userId);
  }
}
