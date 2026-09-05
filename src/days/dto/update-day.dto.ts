import { IsOptional, IsString } from 'class-validator';

export class UpdateDayDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;
}