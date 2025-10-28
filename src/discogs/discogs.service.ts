import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiscogsClient, Release, SearchResponse } from '@lionralfs/discogs-client';

@Injectable()
export class DiscogsService {
  private readonly client: DiscogsClient;
  private readonly db: ReturnType<DiscogsClient['database']>;
  private readonly logger = new Logger(DiscogsService.name);

  constructor(private readonly configService: ConfigService) {
    this.client = new DiscogsClient({
      userAgent: 'CustomUserAgent/1.0',
      auth: { userToken: this.configService.getOrThrow<string>('DISCOGS_USER_TOKEN') },
    });

    this.db = this.client.database();
  }

  async getRelease(id: number) {
    return await this.db.getRelease(id);
  }

  async searchReleases(page?: number, perPage?: number): Promise<SearchResponse> {
    const response = await this.db.search({
      type: 'release',
      page,
      per_page: perPage,
    });
    return response.data;
  }
}
