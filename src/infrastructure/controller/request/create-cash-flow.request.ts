import {
  IsString,
  Length,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CreateCashFlowDto } from '@application/dto/create-cash-flow.dto';

export class CreateCashFlowRequest {
  @Length(11, 14)
  @IsNumberString()
  document: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  balance?: number;

  toDTO(): CreateCashFlowDto {
    return new CreateCashFlowDto(
      this.document,
      this.password,
      this.name,
      this.balance,
    );
  }
}
