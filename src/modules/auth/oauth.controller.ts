import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { TokenUser } from '../../models/interfaces/user.js';
import { AuthService } from './auth.service.js';
import { GitHubAuthGuard } from './auth.guard.js';

@Controller('auth')
export class AuthGithubController {
  constructor(private readonly authService: AuthService) {}

  @Get('github/login')
  @UseGuards(GitHubAuthGuard)
  loginGithub() {}

  @Get('github/callback')
  @UseGuards(GitHubAuthGuard)
  callbackGithub(@Req() req: { user: TokenUser }, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user, res);
  }

  @Get('google/login')
  @UseGuards(GitHubAuthGuard)
  loginGoogle() {}

  @Get('google/callback')
  @UseGuards(GitHubAuthGuard)
  callbackGoogle(@Req() req: { user: TokenUser }, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user, res);
  }
}
