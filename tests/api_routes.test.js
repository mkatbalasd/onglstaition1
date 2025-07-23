const request = require('supertest');

jest.mock('../db', () => ({
  pool: {
    query: jest.fn(),
    end: jest.fn()
  },
  generateCardNumber: jest.fn()
}));

const { pool } = require('../db');
const app = require('../index');

beforeEach(() => {
  pool.query.mockReset();
});

describe('GET /nagl/api/drivers', () => {
  it('returns list of drivers', async () => {
    const data = [
      { DriverID: 1, FirstName: 'A', LastName: 'B', IdentityNumber: '1' }
    ];
    pool.query.mockResolvedValueOnce(data);
    const res = await request(app)
      .get('/nagl/api/drivers')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(data);
  });

  it('handles database errors', async () => {
    pool.query.mockRejectedValueOnce(new Error('db fail'));
    const res = await request(app)
      .get('/nagl/api/drivers')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'db fail' });
  });
});

describe('POST /nagl/api/drivers', () => {
  it('creates a driver', async () => {
    pool.query.mockResolvedValueOnce({ insertId: 42 });
    const payload = {
      FacilityID: 1,
      FirstName: 'Foo',
      LastName: 'Bar',
      IdentityNumber: '1234'
    };
    const res = await request(app)
      .post('/nagl/api/drivers')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      DriverID: 42,
      FirstName: 'Foo',
      LastName: 'Bar',
      IdentityNumber: '1234'
    });
  });
});

describe('GET /nagl/api/driver-cards', () => {
  it('returns driver cards', async () => {
    const rows = [{ ID: 1 }];
    pool.query
      .mockResolvedValueOnce([{ count: 1 }])
      .mockResolvedValueOnce(rows);
    const res = await request(app)
      .get('/nagl/api/driver-cards')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: rows, pageCount: 1 });
  });

  it('supports pagination and filtering', async () => {
    const rows = [{ ID: 2 }];
    pool.query
      .mockResolvedValueOnce([{ count: 12 }])
      .mockResolvedValueOnce(rows);
    const res = await request(app)
      .get('/nagl/api/driver-cards?page=2&name=a')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: rows, pageCount: 2 });
  });
});

describe('GET /nagl/api/driver-cards/:id', () => {
  it('returns a single card', async () => {
    const row = { ID: 5 };
    pool.query.mockResolvedValueOnce([row]);
    const res = await request(app)
      .get('/nagl/api/driver-cards/5')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(row);
  });

  it('returns 404 when missing', async () => {
    pool.query.mockResolvedValueOnce([]);
    const res = await request(app)
      .get('/nagl/api/driver-cards/99')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(404);
  });
});

describe('GET /nagl/api/cards error handling', () => {
  it('returns 500 on db failure', async () => {
    pool.query.mockRejectedValueOnce(new Error('boom'));
    const res = await request(app)
      .get('/nagl/api/cards')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'boom' });
  });
});
