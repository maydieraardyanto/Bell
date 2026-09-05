import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  // Helper untuk mendapatkan waktu saat ini dengan timezone Asia/Jakarta
  private getCurrentJakartaTime() {
    const now = new Date();
    // Konversi string ke zona waktu Asia/Jakarta
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const timeString = formatter.format(now); // Format: HH:mm:ss

    // Mendapatkan nama hari dalam bahasa Indonesia untuk pencocokan otomatis
    const dayFormatter = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      weekday: 'long',
    });
    const currentDayName = dayFormatter.format(now); // Contoh: "Senin", "Selasa"

    return { currentTime: timeString, currentDayName };
  }

  async create(createScheduleDto: CreateScheduleDto) {
    const schedule = await this.prisma.schedule.create({
      data: createScheduleDto,
      include: { day: true, bell: true },
    });
    return { success: true, message: 'Schedule berhasil dibuat', data: schedule };
  }

  async findAll() {
    const schedules = await this.prisma.schedule.findMany({
      include: { day: true, bell: true },
      orderBy: [{ dayId: 'asc' }, { order: 'asc' }],
    });
    return { success: true, message: 'Data berhasil ditemukan', data: schedules };
  }

  async findOne(id: number) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: { day: true, bell: true },
    });
    if (!schedule) {
      throw new HttpException({ success: false, message: 'Data tidak ditemukan' }, HttpStatus.NOT_FOUND);
    }
    return { success: true, message: 'Data berhasil ditemukan', data: schedule };
  }

  async findByDay(dayId: number) {
    const schedules = await this.prisma.schedule.findMany({
      where: { dayId },
      include: { day: true, bell: true },
      orderBy: { order: 'asc' },
    });
    return { success: true, message: 'Data berhasil ditemukan', data: schedules };
  }

  // Logic: Mendapatkan jadwal yang sedang aktif saat ini berdasarkan waktu server (Asia/Jakarta)
  async getActiveSchedule() {
    const { currentTime, currentDayName } = this.getCurrentJakartaTime();

    // Cari hari di database yang namanya cocok dengan hari ini
    const dayData = await this.prisma.day.findFirst({
      where: { name: { equals: currentDayName } },
    });

    if (!dayData) {
      return { success: true, message: 'Tidak ada jadwal aktif untuk hari ini', data: null };
    }

    // Cari jadwal di mana waktu sekarang berada di antara startTime dan endTime dan status isActive = true
    const activeSchedule = await this.prisma.schedule.findFirst({
      where: {
        dayId: dayData.id,
        isActive: true,
        startTime: { lte: currentTime },
        endTime: { gte: currentTime },
      },
      include: { day: true, bell: true },
    });

    return {
      success: true,
      message: activeSchedule ? 'Jadwal aktif ditemukan' : 'Tidak ada bel yang sedang aktif saat ini',
      data: activeSchedule || null,
    };
  }

  // Logic: Mendapatkan jadwal bel berikutnya hari ini
  async getNextSchedule() {
    const { currentTime, currentDayName } = this.getCurrentJakartaTime();

    const dayData = await this.prisma.day.findFirst({
      where: { name: { equals: currentDayName } },
    });

    if (!dayData) {
      return { success: true, message: 'Tidak ada jadwal berikutnya', data: null };
    }

    // Cari jadwal hari ini yang startTime-nya lebih besar dari waktu sekarang
    const nextSchedule = await this.prisma.schedule.findFirst({
      where: {
        dayId: dayData.id,
        isActive: true,
        startTime: { gt: currentTime },
      },
      orderBy: { startTime: 'asc' },
      include: { day: true, bell: true },
    });

    return {
      success: true,
      message: nextSchedule ? 'Jadwal berikutnya ditemukan' : 'Tidak ada jadwal bel lagi hari ini',
      data: nextSchedule || null,
    };
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    const exists = await this.prisma.schedule.findUnique({ where: { id } });
    if (!exists) {
      throw new HttpException({ success: false, message: 'Data tidak ditemukan' }, HttpStatus.NOT_FOUND);
    }

    const schedule = await this.prisma.schedule.update({
      where: { id },
      data: updateScheduleDto,
      include: { day: true, bell: true },
    });
    return { success: true, message: 'Schedule berhasil diupdate', data: schedule };
  }

  async remove(id: number) {
    const exists = await this.prisma.schedule.findUnique({ where: { id } });
    if (!exists) {
      throw new HttpException({ success: false, message: 'Data tidak ditemukan' }, HttpStatus.NOT_FOUND);
    }

    await this.prisma.schedule.delete({ where: { id } });
    return { success: true, message: 'Schedule berhasil dihapus' };
  }
}