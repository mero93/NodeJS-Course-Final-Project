import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthRequest, RefreshRequest } from '../../models/interfaces/user.interface.js';
import { Response } from 'express';
import { RegisterUserDto } from '../../models/dtos/user.dto.js';
import { AccessAuthGuard, LocalAuthGuard, RefreshAuthGuard, RolesGuard } from './auth.guard.js';
import { Roles } from './roles.decorator.js';
import { access } from 'fs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Res({ passthrough: true }) res: Response, @Body() user: RegisterUserDto) {
    const result = await this.authService.register(user, res);
    return {
      message: 'User registered successfully',
      accessToken: result,
    };
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) {
    const result = this.authService.login(req.user!, res);
    return {
      message: 'User logged in successfully',
      accessToken: result,
    };
  }

  @HttpCode(200)
  @UseGuards(RefreshAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response, @Req() req: RefreshRequest) {
    return this.authService.logout(req.fullToken, res);
  }

  @HttpCode(200)
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refresh(@Req() req: RefreshRequest, @Res({ passthrough: true }) res: Response) {
    const result = this.authService.refresh(req.fullToken, res);
    return {
      message: 'Token refreshed successfully',
      accessToken: result,
    };
  }

  @HttpCode(200)
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('register-admin')
  async registerAdmin(@Body() admin: RegisterUserDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(admin, res, ['admin', 'user']);
    return {
      message: 'Admin registered successfully',
      accessToken: result,
    };
  }

  @HttpCode(200)
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('grant-admin/:userId')
  async grantAdminPrivileges(@Param('userId') userId: number, @Res() res: Response) {
    const result = await this.authService.addRole(userId, 'admin', res);
    if (result) {
      return {
        message: 'Admin privileges granted successfully',
        accessToken: result,
      };
    } else {
      return {
        message: 'Admin privileges already granted',
      };
    }
  }

  @HttpCode(200)
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('remove-admin/:userId')
  async revokeAdminPrivileges(@Param('userId') userId: number, @Res() res: Response) {
    const result = await this.authService.removeRole(userId, 'admin', res);
    if (result) {
      return {
        message: 'Admin privileges granted successfully',
        accessToken: result,
      };
    } else {
      return {
        message: 'User is not an admin',
      };
    }
  }

  // OPTIONAL: endpoint for setUpPassword: so OAuth users can set up password and login normally. Must provide password, confirmPassword.
  // OPTIONAL: endpoint for updatePassword: to change password. Must provide oldPassword, newPassword, confirmPassword.
}
