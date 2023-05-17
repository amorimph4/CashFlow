import { CashFlowTransaction } from '@domain/cash-flow-transaction';

export interface CashFlowTransactionRepositoryInterface {
  findByDocument(document: string): Promise<CashFlowTransaction[]>;
  create(cashFlowTransaction: CashFlowTransaction): Promise<void>;
}
