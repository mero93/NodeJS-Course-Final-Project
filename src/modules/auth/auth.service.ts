import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../models/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { TokenUser } from '../../models/interfaces/user';
import { Response } from 'express';
import { RegisterUserDto } from '../../models/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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

  logout(response: Response) {
    response.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }

  private signTokens(user: TokenUser, response: Response): { accessToken: string } {
    const payload = { email: user.email, sub: user.id, name: user.name, lastName: user.lastName };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.getOrThrow<string>('ACCESS_EXPIRES_IN'),
    } as JwtSignOptions);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.getOrThrow<string>('REFRESH_EXPIRES_IN'),
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
