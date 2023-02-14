import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { AppModule } from 'src/app.module';
import { createWardStub } from './stubs/create-ward.stub';
import { WardsRepository } from 'src/wards/wards.repository';

describe('Wards Controller (e2e)', () => {
  let app: INestApplication;
  let api: any;
  let wardsRepo;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard())
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();

    wardsRepo = moduleRef.get(WardsRepository);

    app.setGlobalPrefix('api');
    await app.init();

    api = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET ward(s)', () => {
    let ward;

    beforeAll(async () => {
      ward = await wardsRepo.create(createWardStub());
    });

    afterAll(async () => {
      await wardsRepo.clearTable(ward.id, 'test'); // id + NODE_ENV
    });

    it('should get the full list of all wards if no limit/offset provided', () => {
      return request(api)
        .get('/api/wards')
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(1);
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0].name).toBe(ward.name);
        });
    });

    it('should get only one wards by its :id', () => {
      const url = `/api/wards/${ward.id}`;

      return request(api)
        .get(url)
        .expect(200)
        .expect((res) => {
          expect(res.body).not.toBeInstanceOf(Array);
          expect(res.body).toHaveProperty('name');
          expect(res.body.name).toBe(ward.name);
        });
    });
  });

  describe('POST ward', () => {
    let ward;

    afterAll(async () => {
      await wardsRepo.clearTable(ward.id, 'test'); // id + NODE_ENV
    });

    it('should create a new ward', () => {
      return request(app.getHttpServer())
        .post('/api/wards/')
        .send({
          name: 'TST_Training',
          institution: 'TST',
        })
        .expect(201)
        .expect((res) => {
          ward = res.body;
          expect(res.body).not.toBeInstanceOf(Array);
          expect(res.body).toHaveProperty('name');
          expect(res.body.name).toBe('TST_Training');
        });
    });
  });
});
