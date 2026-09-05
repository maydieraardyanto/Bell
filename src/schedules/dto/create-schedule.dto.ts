import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsNumber()
  dayId!: number;

  @IsNotEmpty()
  @IsNumber()
  bellId!: number;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'Format startTime harus HH:mm:ss' })
  startTime!: string; // Format: 07:00:00

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'Format endTime harus HH:mm:ss' })
  endTime!: string; // Format: 07:45:00

  @IsNotEmpty()
  @IsNumber()
  order!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}