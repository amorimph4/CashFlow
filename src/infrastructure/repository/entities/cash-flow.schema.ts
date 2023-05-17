import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CashFlowDocument = CashFlow & Document;

@Schema()
export class CashFlow {
  @Prop({ unique: true, index: true })
  document: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  balance: number;
}

export const CashFlowSchema = SchemaFactory.createForClass(CashFlow);
