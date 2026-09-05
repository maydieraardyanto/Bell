import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBellDto } from './dto/create-bell.dto';
import { UpdateBellDto } from './dto/update-bell.dto';

@Injectable()
export class BellsService {
  constructor(private prisma: PrismaService) {}

  async create(createBellDto: { name: string; description?: string; sound?: string | null }) {
    const bell = await this.prisma.bell.create({
      data: createBellDto,
    });
    return { success: true, message: 'Bell berhasil dibuat', data: bell };
  }

  async findAll() {
    const bells = await this.prisma.bell.findMany();
    return { success: true, message: 'Data berhasil ditemukan', data: bells };
  }

  async findOne(id: number) {
    const bell = await this.prisma.bell.findUnique({ where: { id } });
    if (!bell) {
      throw new HttpException({ success: false, message: 'Data tidak ditemukan' }, HttpStatus.NOT_FOUND);
    }
    return { success: true, message: 'Data berhasil ditemukan', data: bell };
  }

  async update(id: number, updateBellDto: UpdateBellDto) {
    const bellExists = await this.prisma.bell.findUnique({ where: { id } });
    if (!bellExists) {
      throw new HttpException({ success: false, message: 'Data tidak ditemukan' }, HttpStatus.NOT_FOUND);
    }

    const bell = await this.prisma.bell.update({
      where: { id },
      data: updateBellDto,
    });
    return { success: true, message: 'Bell berhasil diupdate', data: bell };
  }

  async remove(id: number) {
    const bellExists = await this.prisma.bell.findUnique({ where: { id } });
    if (!bellExists) {
      throw new HttpException({ success: false, message: 'Data tidak ditemukan' }, HttpStatus.NOT_FOUND);
    }

    await this.prisma.bell.delete({ where: { id } });
    return { success: true, message: 'Bell berhasil dihapus' };
  }
}