import { 
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, 
  UseInterceptors, UploadedFile, HttpException, HttpStatus 
} from '@nestjs/common';
import { BellsService } from './bells.service';
import { CreateBellDto } from './dto/create-bell.dto';
import { UpdateBellDto } from './dto/update-bell.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(JwtAuthGuard)
@Controller('bells')
export class BellsController {
  constructor(private readonly bellsService: BellsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('sound', {
      storage: diskStorage({
        destination: './uploads/sounds',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `bell-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(mp3|wav|ogg)$/)) {
          return callback(new HttpException('Hanya file audio (.mp3, .wav, .ogg) yang diizinkan!', HttpStatus.BAD_REQUEST), false);
        }
        callback(null, true);
      },
    }),
  )
  create(
    @Body() createBellDto: CreateBellDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Gabungkan data dari DTO dengan nama file sound yang di-upload
    const bellData = {
      name: createBellDto.name,
      description: createBellDto.description,
      sound: file ? file.filename : null,
    };
    return this.bellsService.create(bellData);
  }

  @Get()
  findAll() {
    return this.bellsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bellsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('sound', {
      storage: diskStorage({
        destination: './uploads/sounds',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `bell-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBellDto: UpdateBellDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updateData: any = { ...updateBellDto };
    if (file) {
      updateData.sound = file.filename;
    }
    return this.bellsService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bellsService.remove(id);
  }
}