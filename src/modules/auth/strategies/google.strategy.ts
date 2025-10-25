import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { OAuthPRoviderInterface } from '../../../models/interfaces/OAuthProviderInterface.js';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('SSO_GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow('SSO_GOOGLE_CLIENT_SECRET'),
      // NEED TO UPDATE FOR DEPLOYED SITE
      callbackURL: '<http://localhost:3000/auth/google/callback>',
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
