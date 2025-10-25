import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { OAuthPRoviderInterface } from '../../../models/interfaces/OAuthProviderInterface.js';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('SSO_GITHUB_CLIENT_ID'),
      clientSecret: configService.getOrThrow('SSO_GITHUB_CLIENT_SECRET'),
      // NEED TO UPDATE FOR DEPLOYED SITE
      callbackURL: '<http://localhost:3000/auth/github/callback>',
      scope: ['user:email'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: OAuthPRoviderInterface) {
    console.log(accessToken, refreshToken, profile);
    return {
      accessToken,
      refreshToken,
      profile,
    };
  }
}
