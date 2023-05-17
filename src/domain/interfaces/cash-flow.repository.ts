import { CashFlow } from '@domain/cash-flow';

export interface CashFlowRepositoryInterface {
  findByDocument(document: string): Promise<CashFlow>;
  create(cashFlow: CashFlow): Promise<void>;
  update(cashFlow: CashFlow): Promise<void>;
}
