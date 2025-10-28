import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../models/entities/user.entity.js';
import { UpdateUserDto } from '../../models/dtos/user.dto.js';
import { InfoUser } from '../../models/interfaces/user.interface.js';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service.js';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly authService: AuthService
  ) {}

  async userInfo(userId: number): Promise<InfoUser> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      birthDate: user.birthDate,
      avatar: user.avatar,
    };
  }

  async updateUser(userId: number, updateDto: UpdateUserDto, response: Response) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.name === updateDto.name && user.lastName === updateDto.lastName) {
      if (user.birthDate === updateDto.birthDate) {
        return {
          message: 'No changes were made',
        };
      } else if (updateDto.birthDate) {
        user.birthDate = updateDto.birthDate;
        await this.usersRepository.save(user);
        return {
          message: 'User updated successfully',
        };
      }
    }

    user.name = updateDto.name || user.name;
    user.lastName = updateDto.lastName || user.lastName;
    user.birthDate = updateDto.birthDate || user.birthDate;

    await this.usersRepository.save(user);

    const accessToken = this.authService.signTokens(
      {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        id: user.id,
        roles: user.roles.map((r) => r.role),
      },
      response
    );

    return {
      message: 'User updated successfully',
      accessToken: accessToken,
    };
  }

  async updateUserAvatar(userId: number, avatarUrl: string) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.avatar = avatarUrl;

    await this.usersRepository.save(user);

    return {
      message: 'Avatar updated successfully',
    };
  }

  async deleteAccount(userId: number) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.remove(user);
  }
}
