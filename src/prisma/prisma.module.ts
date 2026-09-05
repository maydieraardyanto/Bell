import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Menjadikan modul ini global agar tidak perlu di-import berulang kali di modul lain
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}