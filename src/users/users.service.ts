import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import md5 = require('md5');

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new HttpException(
        { success: false, message: 'Email sudah terdaftar' },
        HttpStatus.CONFLICT,
      );
    }

    const user = await this.prisma.users.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: md5(createUserDto.password), // Hashing dengan MD5
      },
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    });

    return { success: true, message: 'User berhasil dibuat', data: user };
  }

  async findAll() {
    const users = await this.prisma.users.findMany({
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    });
    return { success: true, message: 'Data berhasil ditemukan', data: users };
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    });

    if (!user) {
      throw new HttpException({ success: false, message: 'Data tidak ditemukan' }, HttpStatus.NOT_FOUND);
    }
    return { success: true, message: 'Data berhasil ditemukan', data: user };
  }

  // Digunakan khusus internal oleh AuthService untuk verifikasi login (termasuk nge-return password hash)
  async findOneForAuth(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userExists = await this.prisma.users.findUnique({ where: { id } });
    if (!userExists) {
      throw new HttpException({ success: false, message: 'Data tidak ditemukan' }, HttpStatus.NOT_FOUND);
    }

    const updateData: any = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = md5(updateUserDto.password); // Hashing jika password diupdate
    }

    const user = await this.prisma.users.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    });

    return { success: true, message: 'User berhasil diupdate', data: user };
  }

  async remove(id: number) {
    const userExists = await this.prisma.users.findUnique({ where: { id } });
    if (!userExists) {
      throw new HttpException({ success: false, message: 'Data tidak ditemukan' }, HttpStatus.NOT_FOUND);
    }

    await this.prisma.users.delete({ where: { id } });
    return { success: true, message: 'User berhasil dihapus' };
  }
}