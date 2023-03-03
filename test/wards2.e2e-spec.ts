import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { AppModule } from 'src/app.module';

import { truncateTable } from './helpers/test.helper';

import { Ward } from 'src/wards/entities/ward.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createWardStub } from './stubs/create-ward.stub';

describe('Wards Endpoints (e2e)', () => {
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

    // wardsRepo = moduleRef.get(WardsRepository);
    wardsRepo = moduleRef.get(getRepositoryToken(Ward));
    // console.log(wardsRepo.conf)
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
      // clearDB('t_wards');
      await truncateTable('t_wards', wardsRepo);
      ward = await wardsRepo.create(createWardStub());
    });

    // afterAll(async () => {
    //   await wardsRepo.clearTable(ward.id, 'test'); // id + NODE_ENV
    // });

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
  });
});
