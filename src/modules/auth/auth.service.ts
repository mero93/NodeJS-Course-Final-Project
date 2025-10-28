import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../models/entities/user.entity.js';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
  FullPayload,
  OAuthUser,
  Payload,
  TokenUser,
} from '../../models/interfaces/user.interface.js';
import { Response } from 'express';
import { RegisterUserDto } from '../../models/dtos/user.dto.js';
import { RevokedToken } from '../../models/entities/revokedToken.entity.js';
import { randomUUID } from 'crypto';
import { OAuthAccount } from '../../models/entities/oAuthAccount.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(RevokedToken)
    private readonly revokedTokensRepository: Repository<RevokedToken>,
    @InjectRepository(OAuthAccount)
    private readonly oauthAccountsRepository: Repository<OAuthAccount>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateUser(email: string, password: string): Promise<TokenUser> {
    const user = await this.usersRepository.findOne({ where: { email }, relations: ['roles'] });
    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles.map((r) => r.role),
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async register(user: RegisterUserDto, response: Response, roles: string[] = ['user']) {
    if (await this.usersRepository.findOneBy({ email: user.email })) {
      throw new UnauthorizedException('User already exists');
    }

    const newUser = this.usersRepository.create({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    });

    const userRoles: UserRole[] = roles.map((role) => ({ role }) as UserRole);

    newUser.roles = userRoles;

    await this.usersRepository.save(newUser);

    return this.signTokens(
      {
        id: newUser.id,
        name: newUser.name,
        lastName: newUser.lastName,
        email: newUser.email,
        roles,
      },
      response
    );
  }

  login(user: TokenUser, response: Response): string {
    return this.signTokens(user, response);
  }

  async logout(fullToken: FullPayload, response: Response) {
    try {
      await this.revokedTokensRepository.save({
        jti: fullToken.jti,
        expiresAt: fullToken.exp ? new Date(fullToken.exp * 1000) : undefined,
      });
    } catch {
      // should add logic for handling token already being revoked
    }

    response.clearCookie('refreshToken');

    return { message: 'Logged out successfully' };
  }

  async validateOAuthUser(oauthUser: OAuthUser): Promise<TokenUser> {
    const { provider, providerAccountId, ...userData } = oauthUser;

    const existingOAuthAccount = await this.oauthAccountsRepository.findOne({
      where: { provider, providerAccountId },
      relations: ['user', 'user.roles'],
    });

    if (existingOAuthAccount) {
      return {
        id: existingOAuthAccount.user.id,
        name: existingOAuthAccount.user.name,
        lastName: existingOAuthAccount.user.lastName,
        email: existingOAuthAccount.user.email,
        roles: existingOAuthAccount.user.roles.map((r) => r.role),
      };
    }

    let user = await this.usersRepository.findOneBy({ email: userData.email });

    if (!user) {
      user = await this.usersRepository.save({
        ...userData,
        isOAuthUser: true,
        roles: [{ role: 'user' }],
      });
    }

    await this.oauthAccountsRepository.save({
      provider,
      providerAccountId,
      user,
    });

    if (!user.isOAuthUser) {
      user.isOAuthUser = true;
      await this.usersRepository.save(user);
    }

    const roles = user ? user.roles.map((r) => r.role) : ['user'];

    return { id: user.id, name: user.name, lastName: user.lastName, email: user.email, roles };
  }

  async refresh(fullToken: FullPayload, response: Response) {
    const isRevoked = await this.revokedTokensRepository.findOneBy({ jti: fullToken.jti });
    if (isRevoked) {
      throw new UnauthorizedException('Refresh token has already been used');
    }

    try {
      await this.revokedTokensRepository.save({
        jti: fullToken.jti,
        expiresAt: fullToken.exp ? new Date(fullToken.exp * 1000) : undefined,
      });
    } catch (error) {
      // In case of concurrent request
      throw new UnauthorizedException('Refresh token has already been used');
    }

    return this.signTokens(
      {
        id: fullToken.sub,
        name: fullToken.name,
        lastName: fullToken.lastName,
        email: fullToken.email,
        roles: fullToken.roles,
      },
      response
    );
  }

  async addRole(userId: number, role: string, response: Response) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If user already has the role, do nothing.
    if (user.roles.some((r) => r.role === role)) {
      return;
    }

    user.roles.push({ role } as UserRole);

    await this.usersRepository.save(user);

    return this.signTokens(
      {
        ...user,
        roles: user.roles.map((r) => r.role),
      },
      response
    );
  }

  async removeRole(userId: number, role: string, response: Response) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If user doesn't have the role, do nothing.)
    if (!user.roles.some((r) => r.role === role)) {
      return;
    }

    user.roles = user.roles.filter((r) => r.role !== role);

    await this.usersRepository.save(user);

    return this.signTokens(
      {
        ...user,
        roles: user.roles.map((r) => r.role),
      },
      response
    );
  }

  signTokens(user: TokenUser, response: Response): string {
    const payload: Payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      roles: user.roles,
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

    return accessToken;
  }
}
