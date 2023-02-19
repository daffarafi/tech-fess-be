import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Param, Res } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import * as fs from 'fs';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { GetUser } from '../auth/decorator';
import { JwtCheck, JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { ParseIntPipe } from '@nestjs/common/pipes';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.getUserById(userId);
  }

  @UseGuards(JwtCheck)
  @Get(':id/postings')
  getUserPostingsByUserId(
    @Param('id', ParseIntPipe) userId: number,
    @GetUser('id') currentUserId: number | null,
  ) {
    return this.userService.getUserPostingsByUserId(currentUserId, userId);
  }

  @UseGuards(JwtGuard)
  @Put()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @UseGuards(JwtGuard)
  @Post('banner')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profilebanners',
        filename: (req, file, callback) => {
          const { id } = req.user as User;
          callback(null, `banner-${id}.jpg`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException(
              'Gambar hanya dapat berupa jpg, jpeg, atau png!',
            ),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  uploadBanner(@UploadedFiles() file: Express.Multer.File) {
    return { message: 'Banner berhasil diupload!' };
  }

  @Get('banner/:id')
  getProfileBannerByUserId(
    @Param('id', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    const imagePath = `./uploads/profilebanners/banner-${userId}.jpg`;

    if (!fs.existsSync(imagePath)) {
      return res.send({
        message: 'Gambar tidak ditemukan!',
        content: null,
      });
    }

    res.setHeader('Content-Type', 'image/jpeg');
    fs.createReadStream(imagePath).pipe(res);
  }

  @UseGuards(JwtGuard)
  @Post('photo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profileimages',
        filename: (req, file, callback) => {
          const { id } = req.user as User;
          callback(null, `profile-${id}.jpg`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException(
              'Gambar hanya dapat berupa jpg, jpeg, atau png!',
            ),
            false,
          );
        }

        callback(null, true);
      },
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  uploadPhoto(@UploadedFiles() file: Express.Multer.File) {
    return { message: 'Foto Profile berhasil diupload!' };
  }

  @Get('photo/:id')
  getProfileImageByUserId(@Param('id') userId: number, @Res() res: Response) {
    const imagePath = `./uploads/profileimages/profile-${userId}.jpg`;

    if (!fs.existsSync(imagePath)) {
      return res.send({
        message: 'Gambar tidak ditemukan!',
        content: null,
      });
    }

    res.setHeader('Content-Type', 'image/jpeg');
    fs.createReadStream(imagePath).pipe(res);
  }
}
