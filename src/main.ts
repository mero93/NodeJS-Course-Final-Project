import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle(configService.getOrThrow('APP_TITLE'))
    .setDescription(configService.getOrThrow('APP_DESCRIPTION'))
    .setVersion('1.0')
    .addTag('vinyl')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.use(cookieParser(configService.getOrThrow('COOKIE_SECRET')));

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(configService.getOrThrow('PORT'));
}
await bootstrap();
