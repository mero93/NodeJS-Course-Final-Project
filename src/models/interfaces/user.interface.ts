import { Request } from 'express';
import { UserRole } from '../entities/user.entity.js';

export interface TokenUser {
  id: number;
  name: string;
  lastName: string;
  email: string;
  roles: string[];
}

export interface InfoUser extends Omit<TokenUser, 'roles'> {
  birthDate?: Date;
  avatar?: string;
}

// For Seeder only
export interface FullInfoUser extends Omit<InfoUser, 'id'> {
  roles: UserRole[];
  password: string;
}

export interface OAuthUser extends Omit<TokenUser, 'id' | 'roles'> {
  provider: string;
  providerAccountId: string;
  avatar?: string;
}

export interface Payload {
  sub: number;
  name: string;
  lastName: string;
  email: string;
  roles: string[];
}

export interface FullPayload extends Payload {
  jti: string;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: TokenUser;
}

export interface RefreshRequest extends Request {
  fullToken: FullPayload;
}
