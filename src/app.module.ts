import { Module } from '@nestjs/common';
import { DataModule } from './data/data.module';
import { UserModule } from './modules/user/user.module';
import { VinylModule } from './modules/vinyl/vinyl.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './modules/order/order.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    DataModule,
    UserModule,
    VinylModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    OrderModule,
    TasksModule,
  ],
})
export class AppModule {}
