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

describe('GET /nagl/api/vehicles', () => {
  it('responds with list of vehicles', async () => {
    const vehicles = [
      { ID: 1, PlateNumber: 'ABC123', SerialNumber: 'SN1' },
      { ID: 2, PlateNumber: 'XYZ789', SerialNumber: 'SN2' }
    ];
    pool.query.mockResolvedValueOnce(vehicles);

    const res = await request(app).get('/nagl/api/vehicles');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(vehicles);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});
