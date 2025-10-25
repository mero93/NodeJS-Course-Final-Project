import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service.js';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      clientID: configService.getOrThrow('SSO_GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow('SSO_GOOGLE_CLIENT_SECRET'),
      // NEED TO CHANGE LATER
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new UnauthorizedException('Google account email is required');
    }

    const user = await this.authService.validateOAuthUser({
      provider: 'google',
      providerAccountId: profile.id,
      email,
      name: profile.name?.givenName || 'New',
      lastName: profile.name?.familyName || 'User',
      avatar: profile.photos?.[0]?.value,
    });

    return user;
  }
}
