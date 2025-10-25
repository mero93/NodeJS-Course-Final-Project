import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh') {}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

@Injectable()
export class AccessAuthGuard extends AuthGuard('access') {}

@Injectable()
export class GitHubAuthGuard extends AuthGuard('github') {}

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}
