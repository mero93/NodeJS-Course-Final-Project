import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { AuthRequest } from '../../models/interfaces/user';
import { Response } from 'express';
import { RegisterUserDto } from '../../models/dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Req() res: Response, @Body() user: RegisterUserDto) {
    return await this.authService.register(user, res);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() req: AuthRequest, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @HttpCode(204)
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @Post('profile')
  @UseGuards(LocalAuthGuard)
  getProfile(@Req() req: AuthRequest) {
    return req.user;
  }
}
