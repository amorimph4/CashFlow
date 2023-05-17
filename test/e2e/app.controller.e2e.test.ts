import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '@infrastructure/module/app.module';
import { DomainErrorsInterceptor } from '@infrastructure/error/interceptors/domain-errors.interceptor';
import {
  CashFlow,
  CashFlowDocument,
} from '@infrastructure/repository/entities/cash-flow.schema';
import {
  CashFlowTransaction,
  CashFlowTransactionDocument,
} from '@infrastructure/repository/entities/cash-flow-transaction.schema';

describe('AppController', () => {
  let app: INestApplication;
  let cashFlowModel: Model<CashFlowDocument>;
  let cashFlowTransactionModel: Model<CashFlowTransaction>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    cashFlowModel = moduleFixture.get<Model<CashFlowDocument>>(
      getModelToken(CashFlow.name),
    );

    cashFlowTransactionModel = moduleFixture.get<
      Model<CashFlowTransactionDocument>
    >(getModelToken(CashFlowTransaction.name));

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(new DomainErrorsInterceptor());

    app.useLogger(false);
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await cashFlowModel.deleteMany({});
    await cashFlowTransactionModel.deleteMany({});
    await app.close();
  });

  describe('POST /cash-flow', () => {
    it('should return 201 when create cash flow', async () => {
      const body = {
        name: 'Adega Teste',
        document: '41064371000114',
        password: '123456',
        balance: 1000,
      };

      await request(app.getHttpServer())
        .post('/cash-flow')
        .send(body)
        .expect(201);
    });

    it('should return 400 when create cash flow on document already exists', async () => {
      const body = {
        name: 'Adega Teste',
        document: '41064371000114',
        password: '123456',
        balance: 1000,
      };

      await request(app.getHttpServer())
        .post('/cash-flow')
        .send(body)
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'Document already exists',
          error: 'Bad Request',
        });
    });

    it('should return 400 when cash flow creating with incorrect body', async () => {
      const body = {
        name: 'Adega Teste',
        document: '41064371000114',
        balance: 1000,
      };

      await request(app.getHttpServer())
        .post('/cash-flow')
        .send(body)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['password must be a string'],
          error: 'Bad Request',
        });
    });
  });

  describe('POST /cash-flow/transaction', () => {
    const bodyForToken = {
      document: '41064371000114',
      password: '123456',
    };

    it('should return 201 when store transaction cash flow', async () => {
      const body = {
        type: 'credit',
        value: 1000,
      };

      const res = await request(app.getHttpServer())
        .post('/login')
        .send(bodyForToken)
        .expect(200);

      const acessToken = res.body.token;

      await request(app.getHttpServer())
        .post('/cash-flow/transaction')
        .set('Authorization', `Bearer ${acessToken}`)
        .send(body)
        .expect(201);
    });

    it('should return 400 when store transaction cash flow on incorrect body', async () => {
      const body = {
        type: '',
        value: 1000,
      };

      const res = await request(app.getHttpServer())
        .post('/login')
        .send(bodyForToken)
        .expect(200);

      const acessToken = res.body.token;

      await request(app.getHttpServer())
        .post('/cash-flow/transaction')
        .set('Authorization', `Bearer ${acessToken}`)
        .send(body)
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'type must be one of the following values: debit, credit',
            'type should not be empty',
          ],
          error: 'Bad Request',
        });
    });

    it('should return 401 when store transaction cash flow on invalid token', async () => {
      const body = {
        type: 'debit',
        value: 1000,
      };

      await request(app.getHttpServer())
        .post('/cash-flow/transaction')
        .set('Authorization', `Bearer ${''}`)
        .send(body)
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });
  });

  describe('GET /cash-flow/get-balance', () => {
    const bodyForToken = {
      document: '41064371000114',
      password: '123456',
    };

    it('should return 200 when get cash flow', async () => {
      const res = await request(app.getHttpServer())
        .post('/login')
        .send(bodyForToken)
        .expect(200);

      const acessToken = res.body.token;

      const dataCashFlow = await cashFlowModel.findOne({
        document: bodyForToken.document,
      });

      const response = await request(app.getHttpServer())
        .get('/cash-flow/get-balance')
        .set('Authorization', `Bearer ${acessToken}`)
        .expect(200);

      expect(response.body.document).toEqual(dataCashFlow.document);
      expect(response.body.password).toEqual(dataCashFlow.password);
      expect(response.body.name).toEqual(dataCashFlow.name);
      expect(response.body.balance).toEqual(dataCashFlow.balance);
    });

    it('should return 401 when get cash flow on invalid token', async () => {
      await request(app.getHttpServer())
        .get('/cash-flow/get-balance')
        .set('Authorization', `Bearer ${''}`)
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });
  });

  describe('GET /cash-flow/list-transactions', () => {
    const bodyForToken = {
      document: '41064371000114',
      password: '123456',
    };

    it('should return 200 when get cash flow', async () => {
      const res = await request(app.getHttpServer())
        .post('/login')
        .send(bodyForToken)
        .expect(200);

      const acessToken = res.body.token;

      await request(app.getHttpServer())
        .get('/cash-flow/list-transactions')
        .set('Authorization', `Bearer ${acessToken}`)
        .expect(200);
    });

    it('should return 401 when list transactions by cash flow on invalid token', async () => {
      await request(app.getHttpServer())
        .get('/cash-flow/list-transactions')
        .set('Authorization', `Bearer ${''}`)
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });
  });
});
