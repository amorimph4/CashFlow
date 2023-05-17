import { Token } from '@domain/token';
import { CashFlow } from '@domain/cash-flow';

export interface TokenGeneratorInterface {
  generate(cashFlow: CashFlow): Token;
}
