import { Module } from '@nestjs/common';
import { MailService } from './mail.service.js';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  providers: [MailService],
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.getOrThrow('GOOGLE_USERNAME'),
            pass: configService.getOrThrow('GOOGLE_APP_PASSWORD'),
          },
        },
      }),
    }),
  ],
  exports: [MailService],
})
export class MailModule {}
