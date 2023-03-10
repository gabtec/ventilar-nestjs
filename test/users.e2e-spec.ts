import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { AppModule } from 'src/app.module';
import { UsersService } from 'src/users/users.service';
import { createUserStub } from './stubs/create-user.stub';

import * as dotenv from 'dotenv';
dotenv.config();

const testUser = {
  name: 'Gabriel Martins',
  mec: 1000,
  password: 'gabriel',
  password_confirm: 'gabriel',
  role: 'dispatcher',
  workplace_id: 1,
};

describe('Users Endpoints (e2e)', () => {
  let app: INestApplication;
  let api: any;
  let usersService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard())
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();

    usersService = moduleRef.get(UsersService);

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    api = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    // let user;

    // beforeAll(async () => {
    //   user = await usersService.create(createUserStub());
    // });

    // afterAll(async () => {
    //   // delete user
    //   await usersService.clearTable(user.id, 'test'); // id + NODE_ENV
    // });

    it('should fail to create a new user if no "name" provided', () => {
      const userCopy = { ...testUser };
      delete userCopy.name;

      return request(api).post('/api/users').send(userCopy).expect(400);
    });

    it('should fail with 400 if no "mec" provided', () => {
      const userCopy = { ...testUser };
      delete userCopy.mec;

      return request(api).post('/api/users').send(userCopy).expect(400);
    });

    it('should fail with 400 if "mec" NOT a number ', () => {
      const userCopy = { ...testUser };
      userCopy.mec = 'oito' as any;

      return request(api).post('/api/users').send(userCopy).expect(400);
    });

    it('should fail with 400 if "password" NOT provided ', () => {
      const userCopy = { ...testUser };
      delete userCopy.password;

      return request(api).post('/api/users').send(userCopy).expect(400);
    });

    it('should fail with 400 if "password_confirm" NOT provided ', () => {
      const userCopy = { ...testUser };
      delete userCopy.password_confirm;

      return request(api).post('/api/users').send(userCopy).expect(400);
    });

    it('should fail with 400 if "password" diferent from "password_confirm" ', () => {
      const userCopy = { ...testUser };
      userCopy.password_confirm = 'notEqualToPassword';

      return request(api).post('/api/users').send(userCopy).expect(400);
    });

    it('should accept no "role" and set it as default = "consumer" ', () => {
      const userCopy = { ...testUser };
      delete userCopy.role;

      return request(api)
        .post('/api/users')
        .send(userCopy)
        .expect(201)
        .expect((resp) => {
          expect(resp.body).toHaveProperty('role');
          expect(resp.body.role).toBe('consumer');
        });
    });

    it('should accept nullable workplace ', () => {
      const userCopy = { ...testUser };
      delete userCopy.workplace_id;

      return request(api)
        .post('/api/users')
        .send(userCopy)
        .expect(201)
        .expect((resp) => {
          expect(resp.body).toHaveProperty('workplace_id');
          expect(resp.body.workplace_id).toBeFalsy();
        });
    });

    it('should create a user and return { id, name, role, workplace }. Password omitted.', () => {
      return request(api)
        .post('/api/users')
        .send(testUser)
        .expect(201)
        .expect((resp) => {
          expect(resp.body).not.toHaveProperty('password_hash');
          expect(resp.body).toHaveProperty('id');
          expect(resp.body).toHaveProperty('name');
          expect(resp.body).toHaveProperty('role');
          expect(resp.body).toHaveProperty('workplace');
          expect(resp.body).toHaveProperty('workplace_id');

          // expect(resp.body.id).toBe(testUser.id);
          expect(resp.body.name).toBe(testUser.name);
          expect(resp.body.role).toBe(testUser.role);
          expect(resp.body.workspace).toBeFalsy();
          expect(resp.body.workspace_id).toBeFalsy();
        });
    });
  });
});
