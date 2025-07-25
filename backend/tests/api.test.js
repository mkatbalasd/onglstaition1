const request = require('supertest');
const app = require('../server');

jest.mock('../models/driver');
jest.mock('../models/driverCard');
jest.mock('../middleware/driverValidation', () => ({
  checkUniqueIdentity: (req, res, next) => next(),
  checkUniqueIdentityOnUpdate: (req, res, next) => next(),
}));

const driverModel = require('../models/driver');
const driverCardModel = require('../models/driverCard');

describe('API tests', () => {
  test('create driver', async () => {
    const sample = { FirstName: 'John', LastName: 'Doe' };
    driverModel.create.mockResolvedValue({ DriverID: 1, ...sample });

    const res = await request(app).post('/api/drivers').send(sample);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ DriverID: 1, ...sample });
  });

  test('fetch driver cards', async () => {
    const cards = [{ DriverCardID: 1, CardNumber: '123' }];
    driverCardModel.getAll.mockResolvedValue(cards);

    const res = await request(app).get('/api/driver-cards');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(cards);
  });
});
