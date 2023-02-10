import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { WardsService } from 'src/wards/wards.service';
import { WardsController } from 'src/wards/wards.controller';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';

describe('Wards', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideGuard(AuthGuard())
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/users', () => {
    it('should get an Array with a list of wards, each one with this props: {id:int, name: str, belongs_to: str, created_at and updated_at timestamps}', () => {
      // return request(app.getHttpServer())
      //   .get('/api/wards/')
      //   .expect(200)
      //   .expect(({ body }) => {
      //     expect(body).toBeInstanceOf(Array);
      //     expect(body).toHaveLength(2);
      //     expect(body[0]).toHaveProperty('id');
      //     expect(body[0].id).toBe(1);
      //     expect(body[0]).toHaveProperty('name');
      //     expect(body[0]).toHaveProperty('belongs_to');
      //     expect(body[0]).toHaveProperty('created_at');
      //     expect(body[0]).toHaveProperty('updated_at');
      //   });
    });
  });
});
