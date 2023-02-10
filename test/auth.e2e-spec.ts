import * as request from 'supertest';

const app = 'http://localhost:3002/api';

beforeAll(() => {
  // place a test user on DB
});

afterAll(() => {
  // remove the test user from DB
});

describe('Auth', () => {
  describe('POST /auth/login', () => {
    it(`should return 401|Unauthorized if username not existent`, () => {
      return request(app)
        .post('/auth/login')
        .send({
          username: 'userNotOnDB',
          password: 'fake',
        })
        .expect(401);
    });

    it(`should return 401|Unauthorized if username can not be converted to integer number, since user.mec is a number`, () => {
      return request(app)
        .post('/auth/login')
        .send({
          username: 'notAnumber',
          password: 'fake',
        })
        .expect(401);
    });

    it(`should return 401|Unauthorized if username is valid, but password not`, () => {
      return request(app)
        .post('/auth/login')
        .send({
          username: '3428',
          password: 'fake',
        })
        .expect(401);
    });

    it(`should return 200|Ok if username is valid, and password also valid. 
      The response must be an object with 3 properties: 
      user: { id, mec, name, role, workplace,, workplace_id}, 
      accessToken: jwt, 
      refreshToken: jwt`, () => {
      return request(app)
        .post('/auth/login')
        .send({
          username: '3428',
          password: 'gabriel',
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty('accessToken');
          expect(body).toHaveProperty('refreshToken');
          expect(body).toHaveProperty('user');
          expect(body.user).toHaveProperty('id');
          expect(body.user).toHaveProperty('mec');
          expect(body.user).toHaveProperty('name');
          expect(body.user).toHaveProperty('role');
          expect(body.user).toHaveProperty('workplace');
          expect(body.user).toHaveProperty('workplace_id');
        });
    });
  });
});
