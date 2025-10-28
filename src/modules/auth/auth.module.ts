import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/entities/user.entity.js';
import { OAuthAccount } from '../../models/entities/oAuthAccount.entity.js';
import { RevokedToken } from '../../models/entities/revokedToken.entity.js';
import { LocalStrategy } from './strategies/local.strategy.js';
import { AuthGithubController } from './oauth.controller.js';
import { GithubStrategy } from './strategies/github.strategy.js';
import { AccessJwtStrategy } from './strategies/access.strategy.js';
import { RefreshJwtStrategy } from './strategies/refresh.strategy.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RevokedToken, OAuthAccount]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController, AuthGithubController],
  providers: [AuthService, LocalStrategy, GithubStrategy, AccessJwtStrategy, RefreshJwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
