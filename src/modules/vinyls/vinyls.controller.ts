import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { VinylsService } from './vinyls.service.js';
import { CreateVinylDto, UpdateVinylDto } from '../../models/dtos/vinyl.dto.js';
import { AuthRequest } from '../../models/interfaces/user.interface.js';
import { AccessAuthGuard, OptionalAccessAuthGuard, RolesGuard } from '../auth/auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { Vinyl } from '../../models/entities/vinyl.entity.js';
import { VinylModel } from '../../models/interfaces/vinyl.interface.js';

@Controller('vinyls')
export class VinylsController {
  constructor(private readonly vinylService: VinylsService) {}

  @Get('')
  @UseGuards(OptionalAccessAuthGuard)
  async getAllVinyls(@Req() req: AuthRequest) {
    const userId = req.user?.id; // Safely access the user ID if it exists
    // This part should return all vinyls in database
    // Unavailable vinyls should be filtered out with query parameters.
    // Querying I will implement at the end, after setting up payments with stripe, etc.
    // Vinyl list should also display first review from another user(if logged in)
    // Need to check if user is logged in. Maybe implement dummy AuthGuard?
    // Response should be paginated

    const result = await this.vinylService.findAll(userId);
    return result;
  }

  @Post('create')
  @Roles('admin')
  @UseGuards(AccessAuthGuard, RolesGuard)
  async createVinyl(@Body() body: CreateVinylDto) {
    const result = await this.vinylService.createVinyl(body);
    return {
      message: 'Vinyl created successfully',
      vinyl: result,
    };
  }

  @Patch('update')
  @Roles('admin')
  @UseGuards(AccessAuthGuard, RolesGuard)
  async updateVinyl(@Body() body: UpdateVinylDto) {
    const result = await this.vinylService.updateVinyl(body);
    return {
      message: 'Vinyl updated successfully',
      vinyl: result,
    };
  }

  @Patch('delete/:vinylId')
  @Roles('admin')
  @UseGuards(AccessAuthGuard, RolesGuard)
  async deleteVinyl(@Param('vinylId') vinylId: number) {
    await this.vinylService.deleteVinyl(vinylId);
    return {
      message: 'Vinyl deleted successfully',
    };
  }
}
