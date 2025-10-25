import { Test, TestingModule } from '@nestjs/testing';
import { AuthGithubController } from './oauth.controller.js';

describe('AuthGithubController', () => {
  let controller: AuthGithubController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthGithubController],
    }).compile();

    controller = module.get<AuthGithubController>(AuthGithubController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
