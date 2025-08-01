const request = require('supertest');
const app = require('../index');
const { expect } = require('chai');

describe('GET /nagl', () => {
  it('responds with 200 OK', async () => {
    await request(app)
      .get('/nagl/')
      .expect(200);
  });
});

describe('GET /nonexistent', () => {
  it('responds with 404 for unknown route', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.status).to.equal(404);
  });
});
