import { Request } from 'express';

export interface TokenUser {
  id: number;
  name: string;
  lastName: string;
  email: string;
}

export interface Payload {
  sub: number;
  name: string;
  lastName: string;
  email: string;
}

export class AuthRequest extends Request {
  user: TokenUser;
}
