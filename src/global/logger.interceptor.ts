import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { winstonLogger } from '../helpers/logger.js';
import { Request, Response } from 'express';

@Injectable()
export class LoggerInterceptor<T> implements NestInterceptor<T, T> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const now = Date.now();
    const req: Request = context.switchToHttp().getRequest();
    const { method, url, query } = req;
    const body = (req.body as unknown) ?? {};
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap(
        (data) => {
          const { statusCode } = res;
          const responseTime = Date.now() - now;

          winstonLogger.log({
            method,
            url,
            statusCode,
            query,
            body,
            response: data,
            responseTime: `${responseTime}ms`,
          });
        },
        (error) => {
          const statusCode =
            error instanceof HttpException ? error.getStatus() : res.statusCode || 500;
          const responseTime = Date.now() - now;
          const errorMessage = error instanceof Error ? error.message : 'Internal server error';
          const stack = error instanceof Error ? error.stack : undefined;

          winstonLogger.error({
            method,
            url,
            statusCode,
            query,
            body,
            error: errorMessage,
            stack,
            responseTime: `${responseTime}ms`,
          });
        }
      )
    );
  }
}
