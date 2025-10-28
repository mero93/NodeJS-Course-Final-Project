import { Body, Controller, Delete, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { AccessAuthGuard } from '../auth/auth.guard.js';
import { AuthRequest } from '../../models/interfaces/user.interface.js';
import { UpdateAvatarDto, UpdateUserDto } from '../../models/dtos/user.dto.js';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('user-info')
  @UseGuards(AccessAuthGuard)
  async getUserInfo(@Req() req: AuthRequest) {
    return await this.userService.userInfo(req.user!.id);
  }

  @Patch('update-info')
  @UseGuards(AccessAuthGuard)
  async updateUserInfo(@Req() req: AuthRequest, @Res() res: Response, @Body() body: UpdateUserDto) {
    return await this.userService.updateUser(req.user!.id, body, res);
  }

  @Patch('update-avatar')
  @UseGuards(AccessAuthGuard)
  async updateAvatar(@Req() req: AuthRequest, @Body() body: UpdateAvatarDto) {
    // Maybe if I have time I'll setup cloudinary API

    return await this.userService.updateUserAvatar(req.user!.id, body.imgUrl);
  }

  @Delete('delete-account/:userId')
  @UseGuards(AccessAuthGuard)
  async deleteAccount(@Req() req: AuthRequest) {
    await this.userService.deleteAccount(req.user!.id);
  }
}
