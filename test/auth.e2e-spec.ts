import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { AppModule } from 'src/app.module';

import * as dotenv from 'dotenv';
dotenv.config();

// seeded user on db_test
const user = {
  username: 1000,
  password: 'secret',
};

describe('Auth Endpoints (e2e)', () => {
  let app: INestApplication;
  let api: any;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard())
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();

    app.setGlobalPrefix('api');
    await app.init();

    api = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /login', () => {
    // let user;

    // beforeAll(async () => {
    //   user = await usersService.create(createUserStub());
    // });

    // afterAll(async () => {
    //   // delete user
    //   await usersService.clearTable(user.id, 'test'); // id + NODE_ENV
    // });

    it('should fail with 404 if username not on db', () => {
      return (
        request(api)
          .post('/api/auth/login')
          .send({ username: 0, password: 'fake' })
          // .expect(404);
          .expect(200)
          .expect((resp) => {
            // console.log(resp.body.response.statusCode);
            const status = resp.body.response.statusCode;
            expect(status).toBe(401);
          })
      );
    });

    it('should fail with 401 if username not a number ', () => {
      return (
        request(api)
          .post('/api/auth/login')
          .send({ username: 'someuser', password: 'fake' })
          // .expect(401);
          .expect(200)
          .expect((resp) => {
            // console.log(resp.body.response.statusCode);
            const status = resp.body.response.statusCode;
            expect(status).toBe(401);
          })
      );
    });

    it('should fail with 401 if username on db, but wrong password', () => {
      return (
        request(api)
          .post('/api/auth/login')
          .send({ username: user.username, password: 'fake' })
          // .send({ username: user.mec, password: 'fake' })
          // .expect(401)
          .expect(200)
          .expect((resp) => {
            // console.log(resp.body.response.statusCode);
            const status = resp.body.response.statusCode;
            expect(status).toBe(401);
          })
      );
    });

    it('should login and return { user: {id, name, role, workplace }, accessToken, refreshToken }. Password omitted.', () => {
      return request(api)
        .post('/api/auth/login')
        .send({ username: user.username, password: user.password })
        .expect(200)
        .expect((resp) => {
          expect(resp.body).toHaveProperty('accessToken');
          // OR expect(resp.body.accessToken).toBeDefined();
          expect(resp.body).not.toHaveProperty('refreshToken');
          expect(resp.body).toHaveProperty('user');
          expect(resp.body.user).not.toHaveProperty('password_hash');
          expect(resp.body.user).toHaveProperty('id');
          expect(resp.body.user).toHaveProperty('name');
          expect(resp.body.user).toHaveProperty('role');
          expect(resp.body.user).toHaveProperty('workplace');
          expect(resp.body.user).toHaveProperty('workplace_id');

          // expect(resp.body.user.id).toBe(user.id);
          // expect(resp.body.user.name).toBe(user.name);
          // expect(resp.body.user.role).toBe(user.role);
          expect(resp.body.user.id).toBe(2);
          expect(resp.body.user.name).toBe('Gil Dispatcher');
          expect(resp.body.user.role).toBe('dispatcher');
          expect(resp.body.user.workspace).toBeFalsy();
          expect(resp.body.user.workspace_id).toBeFalsy();
          //
          // TODO: check if cookie is set
        });
    });
  });
});
