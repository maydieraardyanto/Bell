import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDayDto {
  @IsNotEmpty()
  @IsString()
  name!: string; // Senin, Selasa, dll

  @IsNotEmpty()
  @IsString()
  code!: string; // SEN, SEL, dll
}