import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { VinylsService } from './vinyls.service.js';
import { CreateVinylDto, UpdateVinylDto } from '../../models/dtos/vinyl.dto.js';
import { AuthRequest } from '../../models/interfaces/user.interface.js';
import { OptionalAccessAuthGuard } from '../auth/auth.guard.js';

@Controller('vinyls')
export class VinylController {
  constructor(private readonly vinylService: VinylsService) {}

  @Get('')
  @UseGuards(OptionalAccessAuthGuard)
  getAllVinyls(@Req() req: AuthRequest) {
    const userId = req.user?.id; // Safely access the user ID if it exists
    // This part should return all vinyls in database
    // Unavailable vinyls should be filtered out with query parameters.
    // Querying I will implement at the end, after setting up payments with stripe, etc.
    // Vinyl list should also display first review from another user(if logged in)
    // Need to check if user is logged in. Maybe implement dummy AuthGuard?
    // Response should be paginated
  }

  @Post('create')
  // Should implement AdminGuard
  createVinyl(@Body() body: CreateVinylDto) {
    // This part should create new vinyl
  }

  @Patch('update')
  // Should implement AdminGuard
  updateVinyl(@Body() body: UpdateVinylDto) {
    // This part should create new vinyl
  }

  @Patch('delete/:vinylId')
  // Should implement AdminGuard
  deleteVinyl() {
    // This part should delete vinyl
  }
}
