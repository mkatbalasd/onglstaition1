const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../index');

const distDir = path.join(__dirname, '../frontend/dist');
const indexFile = path.join(distDir, 'index.html');

beforeAll(() => {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  if (!fs.existsSync(indexFile)) {
    fs.writeFileSync(indexFile, '<html><body>test</body></html>');
  }
});

describe('GET /nagl/app/', () => {
  it('responds with 200 OK', async () => {
    const res = await request(app).get('/nagl/app/');
    expect(res.statusCode).toBe(200);
  });
});
