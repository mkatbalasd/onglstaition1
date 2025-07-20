const request = require('supertest');
const app = require('../index');

describe('GET /nagl/', () => {
  it('responds with 200 OK', async () => {
    const res = await request(app).get('/nagl/');
    expect(res.statusCode).toBe(200);
  });
});

afterAll(async () => {
  await app.pool.end();
});
