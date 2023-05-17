import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CashFlow,
  CashFlowSchema,
} from '@infrastructure/repository/entities/cash-flow.schema';
import {
  CashFlowTransaction,
  CashFlowTransactionSchema,
} from '@infrastructure/repository/entities/cash-flow-transaction.schema';
import { CashFlowMongoRepository } from '@infrastructure/repository/cash-flow.mongo.repository';
import { CashFlowTransactionMongoRepository } from '@infrastructure/repository/cash-flow-transaction.repository';
import { AppController } from '@infrastructure/controller/app.controller';
import { JwtTokenStrategy } from '@infrastructure/token/jwt-token-strategy';
import { JwtTokenGenerator } from '@infrastructure/token/jwt-token-generator';
import { JwtLoginService } from '@application/jwt-login.service';
import { AppService } from '@application/app.service';
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URI),
    MongooseModule.forFeature([
      {
        name: CashFlow.name,
        schema: CashFlowSchema,
      },
      {
        name: CashFlowTransaction.name,
        schema: CashFlowTransactionSchema,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtLoginService,
    JwtTokenStrategy,
    {
      provide: 'CashFlowRepository',
      useClass: CashFlowMongoRepository,
    },
    {
      provide: 'CashFlowTransactionRepository',
      useClass: CashFlowTransactionMongoRepository,
    },
    {
      provide: 'TokenGenerator',
      useClass: JwtTokenGenerator,
    },
  ],
})
export class AppModule {}
