import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { CashFlowTransactionDto } from '@application/dto/cash-flow-transaction.dto';
import { TransactionTypeEnum } from '@domain/enums/transaction-type.enum';

export class CashFlowTransactionRequest {
  @IsNotEmpty()
  @IsEnum(TransactionTypeEnum)
  type!: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  value: number;

  toDTO(): CashFlowTransactionDto {
    return new CashFlowTransactionDto(this.type, this.value);
  }
}
