const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../index');

const distDir = path.join(__dirname, '../frontend/dist');
const indexFile = path.join(distDir, 'index.html');
const backupFile = path.join(distDir, 'index.bak');

beforeAll(() => {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  if (!fs.existsSync(indexFile)) {
    fs.writeFileSync(indexFile, '<html><body>test</body></html>');
  }
});

describe('SPA route error', () => {
  beforeAll(() => {
    if (fs.existsSync(indexFile)) fs.renameSync(indexFile, backupFile);
  });

  afterAll(() => {
    if (fs.existsSync(backupFile)) fs.renameSync(backupFile, indexFile);
  });

  it('returns 404 when index.html missing', async () => {
    const res = await request(app).get('/nagl/app/any');
    expect(res.statusCode).toBe(404);
  });
});
