import { IsOptional, IsString } from 'class-validator';

export class UpdateBellDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sound?: string;
}