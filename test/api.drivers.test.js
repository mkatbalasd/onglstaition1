const request = require('supertest');

jest.mock('../db', () => {
  return {
    pool: {
      query: jest.fn(),
      end: jest.fn()
    }
  };
});

const { pool } = require('../db');
const app = require('../index');

beforeEach(() => {
  pool.query.mockReset();
});

describe('GET /nagl/api/drivers', () => {
  it('responds with list of drivers', async () => {
    const drivers = [
      { DriverID: 1, FirstName: 'John', LastName: 'Doe', IdentityNumber: '1' },
      { DriverID: 2, FirstName: 'Jane', LastName: 'Smith', IdentityNumber: '2' }
    ];
    pool.query.mockResolvedValueOnce(drivers);

    const res = await request(app).get('/nagl/api/drivers');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(drivers);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});
