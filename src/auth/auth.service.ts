import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import md5 = require('md5');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
  // 1. Cek apakah email sudah terdaftar
  const existingUser = await this.usersService.findOneForAuth(registerDto.email);
  if (existingUser) {
    throw new HttpException(
      { success: false, message: 'Email sudah terdaftar' },
      HttpStatus.BAD_REQUEST,
    );
  }

  // Di auth.service.ts, TIDAK PERLU di-hash lagi:
const newUser = await this.usersService.create({
  name: registerDto.name,
  email: registerDto.email,
  password: registerDto.password, // kirim password biasa
});

  // 3. Akses properti dari newUser.data
  return {
    success: true,
    message: 'User berhasil didaftarkan',
    data: {
      id: newUser.data.id,
      name: newUser.data.name,
      email: newUser.data.email,
    },
  };
}

  async login(loginDto: LoginDto) {
    // 1. Cari user berdasarkan email
    const user = await this.usersService.findOneForAuth(loginDto.email);
    
    // 2. Jika user tidak ada atau hash MD5 dari input tidak cocok dengan DB
    if (!user || user.password !== md5(loginDto.password)) {
      throw new HttpException(
        { success: false, message: 'Email atau password salah' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // 3. Generate JWT Token
    const payload = { sub: user.id, email: user.email, name: user.name };
    const access_token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Login berhasil',
      data: {
        access_token: access_token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    };
  }
}