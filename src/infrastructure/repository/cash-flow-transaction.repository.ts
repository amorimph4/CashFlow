import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionTypeEnum } from '@domain/enums/transaction-type.enum';
import { CashFlowTransactionRepositoryInterface } from '@domain/interfaces/cash-flow-transaction.repository';
import { CashFlowTransaction } from '@domain/cash-flow-transaction';
import {
  CashFlowTransaction as CashFlowTransactionTableEntity,
  CashFlowTransactionDocument,
} from './entities/cash-flow-transaction.schema';

@Injectable()
export class CashFlowTransactionMongoRepository
  implements CashFlowTransactionRepositoryInterface
{
  constructor(
    @InjectModel(CashFlowTransactionTableEntity.name)
    private readonly cashFlowTransactionModel: Model<CashFlowTransactionDocument>,
  ) {}

  public async findByDocument(
    document: string,
  ): Promise<CashFlowTransaction[]> {
    const entitys = await this.cashFlowTransactionModel
      .find({ cash_flow_document: document })
      .exec();

    if (!entitys) {
      return;
    }

    return this.fromTableEntityToDomain(entitys);
  }

  public async create(cashFlowTransaction: CashFlowTransaction): Promise<void> {
    const createdcashFlow = new this.cashFlowTransactionModel({
      cash_flow_document: cashFlowTransaction.getCashFlowDocument(),
      type: cashFlowTransaction.getType(),
      value: cashFlowTransaction.getValue(),
      date: cashFlowTransaction.getDate(),
    });

    try {
      await this.cashFlowTransactionModel.create(createdcashFlow);
    } catch (e) {
      throw e;
    }
  }

  private fromTableEntityToDomain(
    entitys: CashFlowTransactionTableEntity[],
  ): CashFlowTransaction[] {
    return entitys.map((entity: CashFlowTransactionTableEntity) => {
      return new CashFlowTransaction(
        entity.cash_flow_document,
        TransactionTypeEnum[entity.type],
        entity.value,
        entity.date,
      );
    });
  }
}
