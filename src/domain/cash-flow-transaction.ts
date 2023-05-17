import { TransactionTypeEnum } from '@domain/enums/transaction-type.enum';

export class CashFlowTransaction {
  constructor(
    private cashFlowDocument: string,
    private type: TransactionTypeEnum,
    private value: number,
    private date: Date,
  ) {}

  public getCashFlowDocument(): string {
    return this.cashFlowDocument;
  }

  public getType(): string {
    return this.type;
  }

  public getValue(): number {
    return this.value;
  }

  public getDate(): Date {
    return this.date;
  }
}
