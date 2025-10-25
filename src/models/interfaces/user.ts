import { Request } from 'express';

export interface TokenUser {
  id: number;
  name: string;
  lastName: string;
  email: string;
}

export interface OAuthUser extends Omit<TokenUser, 'id'> {
  provider: string;
  providerAccountId: string;
  avatar?: string;
}

export interface Payload {
  sub: number;
  name: string;
  lastName: string;
  email: string;
}

export interface FullPayload extends Payload {
  jti: string;
  exp?: number;
}

export interface AuthRequest extends Request {
  user: TokenUser;
}

export interface RefreshRequest extends Request {
  fullToken: FullPayload;
}
