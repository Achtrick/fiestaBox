import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePlanDto {
  @IsNotEmpty()
  @IsString()
  readonly type: string;

  @IsNumber()
  size: number;

  @IsNumber()
  price: number;
}
