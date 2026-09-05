import { Module } from '@nestjs/common';
import { BellsService } from './bells.service';
import { BellsController } from './bells.controller';

@Module({
  controllers: [BellsController],
  providers: [BellsService],
  exports: [BellsService],
})
export class BellsModule {}