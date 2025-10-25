import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { AuthService } from '../auth.service.js';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      clientID: configService.getOrThrow('SSO_GITHUB_CLIENT_ID'),
      clientSecret: configService.getOrThrow('SSO_GITHUB_CLIENT_SECRET'),
      // NEED TO CHANGE LATER
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new UnauthorizedException('Github account required');
    }

    const receivedName = profile.displayName || profile.username;

    let name: string, lastName: string;

    if (receivedName) {
      const nameSeparated = receivedName.split(' ');
      name = nameSeparated[0];
      lastName = nameSeparated[nameSeparated.length - 1];
    } else {
      name = 'New';
      lastName = 'User';
    }

    const user = await this.authService.validateOAuthUser({
      provider: 'github',
      providerAccountId: profile.id,
      email,
      name: name,
      lastName: lastName,
      avatar: profile.photos?.[0]?.value,
    });

    return user;
  }
}
