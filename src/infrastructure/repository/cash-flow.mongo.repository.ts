import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CashFlowRepositoryInterface } from '@domain/interfaces/cash-flow.repository';
import { CashFlow } from '@domain/cash-flow';
import {
  CashFlow as CashFlowTableEntity,
  CashFlowDocument,
} from './entities/cash-flow.schema';

@Injectable()
export class CashFlowMongoRepository implements CashFlowRepositoryInterface {
  constructor(
    @InjectModel(CashFlowTableEntity.name)
    private readonly cashFlowModel: Model<CashFlowDocument>,
  ) {}

  public async findByDocument(document: string): Promise<CashFlow> {
    const entity = await this.cashFlowModel.findOne({
      document: document,
    });

    if (!entity) {
      return;
    }

    return this.fromTableEntityToDomain(entity);
  }

  public async create(cashFlow: CashFlow): Promise<void> {
    const createdcashFlow = new this.cashFlowModel({
      document: cashFlow.getDocument(),
      password: cashFlow.getPassword(),
      name: cashFlow.getName(),
      balance: cashFlow.getBalance(),
    });

    try {
      await this.cashFlowModel.create(createdcashFlow);
    } catch (e) {
      throw e;
    }
  }

  public async update(cashFlow: CashFlow): Promise<void> {
    const entity = {
      document: cashFlow.getDocument(),
      password: cashFlow.getPassword(),
      name: cashFlow.getName(),
      balance: cashFlow.getBalance(),
    };

    try {
      await this.cashFlowModel.findOneAndUpdate(
        {
          document: cashFlow.getDocument(),
        },
        entity,
        {
          rawResult: true,
        },
      );
    } catch (error) {
      throw error;
    }
  }

  private fromTableEntityToDomain(entity: CashFlowTableEntity): CashFlow {
    return new CashFlow(
      entity.document,
      entity.password,
      entity.name,
      entity.balance,
    );
  }
}
