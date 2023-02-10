import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { WardsService } from 'src/wards/wards.service';
import { WardsController } from 'src/wards/wards.controller';

describe('Wards', () => {
  let app: INestApplication;

  const mockWardsService = {
    getAll: () => [
      {
        id: 1,
        name: 'IT_Service',
        belongs_to: 'HDP',
        created_at: '2023-01-26T09:24:15.017Z',
        updated_at: '2023-01-26T09:24:15.017Z',
      },
      {
        id: 3,
        name: 'HDP_Medicina',
        belongs_to: 'HDP',
        created_at: '2023-01-26T09:27:54.580Z',
        updated_at: '2023-01-26T09:27:54.580Z',
      },
    ],
    create: () => {
      id: 1;
    },
    getAllVentilatorsInAPark: () => [],
  };

  describe('Test Routes with AuthGuard ON', () => {
    beforeAll(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
        controllers: [WardsController],
        providers: [WardsService],
      })
        .overrideGuard(AuthGuard())
        .useValue({ canActivate: () => false })
        .overrideProvider(WardsService)
        .useValue(mockWardsService)
        .compile();

      app = moduleRef.createNestApplication();
      app.setGlobalPrefix('api');
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    describe('POST /api/wards', () => {
      const url = '/api/wards/';
      it('should return 403 if no TOKEN in auth header', () => {
        return request(app.getHttpServer()).post(url).send({}).expect(403);
      });
      it('should return 403 if no VALID TOKEN in auth header', () => {
        return request(app.getHttpServer())
          .post(url)
          .set('Authorization', 'Bearer ksakslaSLK')
          .send({})
          .expect(403);
      });
    });

    describe('GET /api/wards', () => {
      const url = '/api/wards/';
      it('should return 403 if no TOKEN in auth header', () => {
        return request(app.getHttpServer()).get(url).expect(403);
      });
      it('should return 403 if no VALID TOKEN in auth header', () => {
        return request(app.getHttpServer())
          .get(url)
          .set('Authorization', 'Bearer ksakslaSLK')
          .expect(403);
      });
    });

    describe('GET /api/wards/:id/ventilators', () => {
      const url = '/api/wards/2/ventilators';
      it('should return 403 if no TOKEN in auth header', () => {
        return request(app.getHttpServer()).get(url).expect(403);
      });
      it('should return 403 if no VALID TOKEN in auth header', () => {
        return request(app.getHttpServer())
          .get(url)
          .set('Authorization', 'Bearer ksakslaSLK')
          .expect(403);
      });
    });
  });

  describe.only('Test Routes with AuthGuard OFF', () => {
    beforeAll(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
        controllers: [WardsController],
        providers: [WardsService],
      })
        .overrideGuard(AuthGuard())
        .useValue({ canActivate: () => true })
        .overrideProvider(WardsService)
        .useValue(mockWardsService)
        .compile();

      app = moduleRef.createNestApplication();
      app.setGlobalPrefix('api');
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    describe('POST /api/wards', () => {
      it('should return 400| BadRequest, if createDto without "name" prop', () => {
        return request(app.getHttpServer())
          .post('/api/wards/')
          .send({ belongs_to: 'HDP' })
          .expect(400)
          .expect(({ body }) => {
            console.log(body);
            expect(body.message).toBe('name must be a string');
            expect(body.statusCode).toBe(400);
            expect(body.error).toBe('BadRequest');
          });
      });

      it('should return 400| BadRequest, if createDto without "belongs_to" prop', () => {
        return request(app.getHttpServer())
          .post('/api/wards/')
          .send({ name: 'HDP_Medicina' })
          .expect(400)
          .expect(({ body }) => {
            console.log(body);
          });
      });

      it('should return 201| Created, if valid createDto', () => {
        return request(app.getHttpServer())
          .post('/api/wards/')
          .send({ name: 'HDP_Medicina', belongs_to: 'HDP' })
          .expect(201);
      });
    });

    describe('GET /api/wards', () => {
      const url = '/api/wards/';
      it('should get an Array with a list of wards, each one with this props: {id:int, name: str, belongs_to: str, created_at and updated_at timestamps}', () => {
        return request(app.getHttpServer()).get(url).expect(200);
      });
    });
    describe('GET /api/wards/:id/ventilators', () => {
      const url = '/api/wards/2/ventilators';
      it('should get an Array with a list of ventilators, from a specific ward', () => {
        return request(app.getHttpServer()).get(url).expect(200);
      });
    });
  });
});
