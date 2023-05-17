import { Inject, Injectable } from '@nestjs/common';
import { CashFlow } from '@domain/cash-flow';
import { CashFlowTransaction } from '@domain/cash-flow-transaction';
import { CashFlowRepositoryInterface } from '@domain/interfaces/cash-flow.repository';
import { CashFlowTransactionRepositoryInterface } from '@domain/interfaces/cash-flow-transaction.repository';
import { GetCashFlowOutputDto } from '@application/dto/get-cash-flow.output.dto';
import { CreateCashFlowDto } from '@application/dto/create-cash-flow.dto';
import { CashFlowTransactionDto } from '@application/dto/cash-flow-transaction.dto';
import { DomainException } from '@domain/exception/domain.exception';
import { TransactionTypeEnum } from '@domain/enums/transaction-type.enum';

@Injectable()
export class AppService {
  constructor(
    @Inject('CashFlowRepository')
    private readonly cashFlowRepository: CashFlowRepositoryInterface,
    @Inject('CashFlowTransactionRepository')
    private readonly transactionRepository: CashFlowTransactionRepositoryInterface,
  ) {}

  public async getCashFlow(document: string): Promise<GetCashFlowOutputDto> {
    const cashFlow = await this.cashFlowRepository.findByDocument(document);

    if (!cashFlow) {
      throw new DomainException('document not found');
    }

    return new GetCashFlowOutputDto(
      cashFlow.getDocument(),
      cashFlow.getPassword(),
      cashFlow.getName(),
      cashFlow.getBalance(),
    );
  }

  public async getTransactionsByDocument(
    document: string,
  ): Promise<CashFlowTransaction[]> {
    const cashFlow = await this.cashFlowRepository.findByDocument(document);

    if (!cashFlow) {
      throw new DomainException('document not found');
    }

    const transactions = await this.transactionRepository.findByDocument(
      document,
    );

    return transactions;
  }

  public async createCashFlow(data: CreateCashFlowDto): Promise<void> {
    try {
      await this.cashFlowRepository.create(
        new CashFlow(data.document, data.password, data.name, data.balance),
      );
    } catch (error) {
      throw new DomainException('Document already exists');
    }
  }

  public async processTransaction(
    data: CashFlowTransactionDto,
    document: string,
  ): Promise<void> {
    const cashFlow = await this.cashFlowRepository.findByDocument(document);

    if (!cashFlow) {
      throw new DomainException('document not found');
    }

    await this.transactionRepository.create(
      new CashFlowTransaction(
        cashFlow.getDocument(),
        TransactionTypeEnum[data.type],
        data.value,
        new Date(),
      ),
    );

    if (data.type === TransactionTypeEnum.debit) {
      cashFlow.debitValue(data.value);
    } else {
      cashFlow.creditValue(data.value);
    }

    await this.cashFlowRepository.update(cashFlow);
  }
}
