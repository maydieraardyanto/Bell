import { IsBoolean, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateScheduleDto {
  @IsOptional()
  @IsNumber()
  dayId?: number;

  @IsOptional()
  @IsNumber()
  bellId?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'Format startTime harus HH:mm:ss' })
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'Format endTime harus HH:mm:ss' })
  endTime?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}