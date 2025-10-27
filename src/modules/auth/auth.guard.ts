import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { TokenUser } from '../../models/interfaces/user.interface.js';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator.js';

// Auth Guards

@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh') {}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

@Injectable()
export class AccessAuthGuard extends AuthGuard('access') {}

// This Guard should always evaluate to true and if possible return User
@Injectable()
export class OptionalAccessAuthGuard extends AuthGuard('access') implements IAuthGuard {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleRequest<TUser = TokenUser | undefined>(err: any, user: any): TUser {
    return user as TUser;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{ user: TokenUser }>();

    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}

// OAuth Guards
@Injectable()
export class GitHubAuthGuard extends AuthGuard('github') {}

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}
