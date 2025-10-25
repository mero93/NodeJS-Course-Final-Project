import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevokedToken } from '../models/entities/revokedToken.entity.js';
import { TasksService } from './tasks.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([RevokedToken])],
  providers: [TasksService],
})
export class TasksModule {}
