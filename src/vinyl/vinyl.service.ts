import { Injectable } from '@nestjs/common';
import { CreateVinylDto, UpdateVinylDto } from '../models/dtos/vinyl.dto';

@Injectable()
export class VinylService {
  create(createVinylDto: CreateVinylDto) {
    return 'This action adds a new vinyl';
  }

  findAll() {
    return `This action returns all vinyl`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vinyl`;
  }

  update(id: number, updateVinylDto: UpdateVinylDto) {
    return `This action updates a #${id} vinyl`;
  }

  remove(id: number) {
    return `This action removes a #${id} vinyl`;
  }
}
