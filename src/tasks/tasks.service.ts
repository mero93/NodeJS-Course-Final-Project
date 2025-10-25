import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, Repository } from 'typeorm';
import { RevokedToken } from '../models/entities/revokedToken.entity';
import { ConfigService } from '@nestjs/config';
import { parseJwtDurationToMilliseconds } from '../helpers/parseJwtDurationToMilSec';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(RevokedToken)
    private readonly revokedTokensRepository: Repository<RevokedToken>,
    private readonly configService: ConfigService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.cleanUpRevokedTokens();
  }

  async cleanUpRevokedTokens() {
    const expiresInStr = this.configService.getOrThrow<string>('REFRESH_EXPIRES_IN');
    const olderThan = new Date(Date.now() - parseJwtDurationToMilliseconds(expiresInStr));
    const result = await this.revokedTokensRepository.delete([
      { expiresAt: LessThan(new Date()) },
      { expiresAt: IsNull(), createdAt: LessThan(olderThan) },
    ]);

    this.logger.log(`Deleted ${result.affected ?? 0} expired revoked tokens.`);
  }
}
