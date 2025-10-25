import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../models/entities/user.entity.js';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { FullPayload, Payload, TokenUser } from '../../models/interfaces/user.js';
import { Response } from 'express';
import { RegisterUserDto } from '../../models/dtos/user.dto.js';
import { RevokedToken } from '../../models/entities/revokedToken.entity.js';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(RevokedToken)
    private readonly revokedTokensRepository: Repository<RevokedToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateUser(email: string, password: string): Promise<TokenUser> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return { id: user.id, name: user.name, lastName: user.lastName, email: user.email };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async register(user: RegisterUserDto, response: Response) {
    const newUser = await this.usersRepository.save({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    });

    return this.signTokens(
      { id: newUser.id, name: newUser.name, lastName: newUser.lastName, email: newUser.email },
      response
    );
  }

  login(user: TokenUser, response: Response): { accessToken: string } {
    return this.signTokens(user, response);
  }

  async logout(fullToken: FullPayload, response: Response) {
    try {
      await this.revokedTokensRepository.save({
        jti: fullToken.jti,
        expiresAt: fullToken.exp ? new Date(fullToken.exp * 1000) : null,
      });
    } catch {
      // should add logic for handling token already being revoked
    }

    response.clearCookie('refreshToken');

    return { message: 'Logged out successfully' };
  }

  async refresh(fullToken: FullPayload, response: Response) {
    const isRevoked = await this.revokedTokensRepository.findOneBy({ jti: fullToken.jti });
    if (isRevoked) {
      throw new UnauthorizedException('Refresh token has already been used');
    }

    await this.revokedTokensRepository.save({
      jti: fullToken.jti,
      expiresAt: new Date(fullToken.exp * 1000),
    });

    return this.signTokens(
      {
        id: fullToken.sub,
        name: fullToken.name,
        lastName: fullToken.lastName,
        email: fullToken.email,
      },
      response
    );
  }

  private signTokens(user: TokenUser, response: Response): { accessToken: string } {
    const payload: Payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.getOrThrow<string>('ACCESS_EXPIRES_IN'),
    } as JwtSignOptions);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.getOrThrow<string>('REFRESH_EXPIRES_IN'),
      jwtid: randomUUID(),
    } as JwtSignOptions);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });

    return { accessToken };
  }
}
