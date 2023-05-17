import { Inject, Injectable } from '@nestjs/common';
import { TokenGeneratorInterface } from '@domain/interfaces/token-generator.interface';
import { CashFlowRepositoryInterface } from '@domain/interfaces/cash-flow.repository';
import { DomainException } from '@domain/exception/domain.exception';

@Injectable()
export class JwtLoginService {
  constructor(
    @Inject('TokenGenerator')
    private readonly tokenGenerator: TokenGeneratorInterface,
    @Inject('CashFlowRepository')
    private readonly cashFlowRepository: CashFlowRepositoryInterface,
  ) {}

  public async login(document: string, password: string): Promise<string> {
    const cashFlow = await this.cashFlowRepository.findByDocument(document);

    if (!cashFlow) {
      throw new DomainException('document not found');
    }

    if (!cashFlow.passwordIsValid(password)) {
      throw new DomainException('password or document is not found');
    }

    const token = this.tokenGenerator.generate(cashFlow);

    return token.value;
  }
}
