afterAll(async () => {
  const app = require('../index');
  if (app.pool && typeof app.pool.end === 'function') {
    await app.pool.end();
  }
});
