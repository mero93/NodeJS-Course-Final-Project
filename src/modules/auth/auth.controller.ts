import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { AuthRequest, RefreshRequest } from '../../models/interfaces/user';
import { Response } from 'express';
import { RegisterUserDto } from '../../models/dtos/user.dto';
import { RefreshAuthGuard } from './guards/refresh.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Res({ passthrough: true }) response: Response, @Body() user: RegisterUserDto) {
    return await this.authService.register(user, response);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user, res);
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
  refresh(@Req() req: RefreshRequest, @Res({ passthrough: true }) response: Response) {
    return this.authService.refresh(req.fullToken, response);
  }

  @Post('profile')
  @UseGuards(LocalAuthGuard)
  getProfile(@Req() req: AuthRequest) {
    return req.user;
  }
}
