import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  if (configService.getOrThrow('NODE_ENV') === 'development') {
    const config = new DocumentBuilder()
      .setTitle(configService.getOrThrow('APP_NAME'))
      .setDescription(configService.getOrThrow('APP_DESCRIPTION'))
      .setVersion('1.0')
      .addTag('vinyl')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  app.use(cookieParser(configService.getOrThrow('COOKIE_SECRET')));

  await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
