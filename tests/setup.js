const app = require('../index');

afterAll(async () => {
  await app.pool.end();
});
