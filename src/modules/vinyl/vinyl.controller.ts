import { Controller } from '@nestjs/common';
import { VinylService } from './vinyl.service.js';

@Controller('vinyl')
export class VinylController {
  constructor(private readonly vinylService: VinylService) {}
}
