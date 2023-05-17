import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CashFlowTransactionDocument = CashFlowTransaction & Document;

@Schema()
export class CashFlowTransaction {
  @Prop()
  cash_flow_document: string;

  @Prop()
  type: string;

  @Prop()
  value: number;

  @Prop()
  date: Date;
}

export const CashFlowTransactionSchema =
  SchemaFactory.createForClass(CashFlowTransaction);
