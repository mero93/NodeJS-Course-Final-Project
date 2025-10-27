import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { AccessAuthGuard } from '../auth/auth.guard.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('user-info')
  @UseGuards(AccessAuthGuard)
  userInfo() {
    // This part should return most information on user, including sensitive info
  }

  @Patch('update-info')
  @UseGuards(AccessAuthGuard)
  updateInfo(@Body() body: { name?: string; lastName?: string; birthDate?: Date }) {
    // This part should update user info, excluding avatar
    //
  }

  @Patch('update-avatar')
  @UseGuards(AccessAuthGuard)
  updateAvatar(@Body() imgUrl: string) {
    // This part should update user avatar
    // Don't know yet how will I implement it.
    // Image hosting isn't mentioned, but I could cloudinary API
  }

  @Delete('delete-account/:userId')
  @UseGuards(AccessAuthGuard)
  deleteAccount() {
    // This part should delete user account
    // Logic should work on OAuth users too np
  }
}
