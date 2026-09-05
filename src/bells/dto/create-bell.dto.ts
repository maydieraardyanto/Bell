import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBellDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}