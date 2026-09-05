import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDayDto } from './dto/create-day.dto';
import { UpdateDayDto } from './dto/update-day.dto';

@Injectable()
export class DaysService {
  constructor(private prisma: PrismaService) {}

  async create(createDayDto: CreateDayDto) {
    const existingCode = await this.prisma.day.findUnique({
      where: { code: createDayDto.code },
    });

    if (existingCode) {
      throw new HttpException(
        { success: false, message: 'Kode hari sudah terdaftar' },
        HttpStatus.CONFLICT,
      );
    }

    const day = await this.prisma.day.create({
      data: createDayDto,
    });

    return { success: true, message: 'Day berhasil dibuat', data: day };
  }

  async findAll() {
    const days = await this.prisma.day.findMany({
      include: { schedules: true },
    });
    return { success: true, message: 'Data berhasil ditemukan', data: days };
  }

  async findOne(id: number) {
    const day = await this.prisma.day.findUnique({
      where: { id },
      include: { schedules: true },
    });

    if (!day) {
      throw new HttpException({ success: false, message: 'Data tidak ditemukan' }, HttpStatus.NOT_FOUND);
    }
    return { success: true, message: 'Data berhasil ditemukan', data: day };
  }

  async update(id: number, updateDayDto: UpdateDayDto) {
    const dayExists = await this.prisma.day.findUnique({ where: { id } });
    if (!dayExists) {
      throw new HttpException({ success: false, message: 'Data tidak ditemukan' }, HttpStatus.NOT_FOUND);
    }

    const day = await this.prisma.day.update({
      where: { id },
      data: updateDayDto,
    });

    return { success: true, message: 'Day berhasil diupdate', data: day };
  }

  async remove(id: number) {
    const dayExists = await this.prisma.day.findUnique({ where: { id } });
    if (!dayExists) {
      throw new HttpException({ success: false, message: 'Data tidak ditemukan' }, HttpStatus.NOT_FOUND);
    }

    await this.prisma.day.delete({ where: { id } });
    return { success: true, message: 'Day berhasil dihapus' };
  }
}