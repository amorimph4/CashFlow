import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from '@application/app.service';
import { JwtLoginService } from '@application/jwt-login.service';
import { JwtTokenGuard } from '@infrastructure/token/jwt-token-guard';
import { CreateCashFlowRequest } from '@infrastructure/controller/request/create-cash-flow.request';
import { CashFlowTransactionRequest } from '@infrastructure/controller/request/cash-flow-transaction.request';
import { LoginRequest } from '@infrastructure/controller/request/login.request';
import { CurretDocument } from '@infrastructure/token/current-document-token-provider';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private jwtLoginService: JwtLoginService,
  ) {}

  @Post('/login')
  public async login(@Body() body: LoginRequest, @Res() response: Response) {
    const acessToken = await this.jwtLoginService.login(
      body.document,
      body.password,
    );

    return response.status(HttpStatus.OK).send({ token: acessToken });
  }

  @Post('/cash-flow')
  async create(
    @Body() body: CreateCashFlowRequest,
    @Res() response: Response,
  ): Promise<Response> {
    await this.appService.createCashFlow(body.toDTO());
    return response.status(HttpStatus.CREATED).send();
  }

  @UseGuards(JwtTokenGuard)
  @Get('/cash-flow/get-balance')
  async getBalance(
    @Res() response: Response,
    @CurretDocument() document: string,
  ): Promise<Response> {
    const output = await this.appService.getCashFlow(document);
    return response.status(HttpStatus.OK).send(output);
  }

  @UseGuards(JwtTokenGuard)
  @Get('/cash-flow/list-transactions')
  async listTransactions(
    @Res() response: Response,
    @CurretDocument() document: string,
  ): Promise<Response> {
    const output = await this.appService.getTransactionsByDocument(document);
    return response.status(HttpStatus.OK).send(output);
  }

  @UseGuards(JwtTokenGuard)
  @Post('/cash-flow/transaction')
  async transaction(
    @Body() body: CashFlowTransactionRequest,
    @Res() response: Response,
    @CurretDocument() document: string,
  ): Promise<Response> {
    const output = await this.appService.processTransaction(
      body.toDTO(),
      document,
    );

    return response.status(HttpStatus.CREATED).send(output);
  }
}
