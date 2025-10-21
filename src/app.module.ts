import { Module } from '@nestjs/common';
import { DataModule } from './data/data.module';
import { UserModule } from './user/user.module';
import { VinylModule } from './vinyl/vinyl.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DataModule,
    UserModule,
    VinylModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
