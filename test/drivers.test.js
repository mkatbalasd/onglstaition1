const request = require('supertest');
const app = require('../index');
const { expect } = require('chai');
const pool = require('../db');

describe('Drivers CRUD', () => {
  let drivers = [];

  beforeEach(() => {
    drivers = [];
    pool.query = async (sql, params) => {
      if (sql.startsWith('INSERT INTO OPC_Driver')) {
        const id = drivers.length ? Math.max(...drivers.map(d => d.DriverID)) + 1 : 1;
        const [FacilityID, IdentityNumber, FirstName, LastName] = params;
        drivers.push({
          DriverID: id,
          FacilityID: FacilityID ? Number(FacilityID) : null,
          IdentityNumber,
          FirstName,
          LastName
        });
        return { insertId: id };
      }
      if (sql.startsWith('SELECT DriverID FROM OPC_Driver WHERE IdentityNumber')) {
        const [identity, id] = params;
        return drivers.filter(d => d.IdentityNumber === identity && d.DriverID !== Number(id));
      }
      if (sql.startsWith('UPDATE OPC_Driver SET')) {
        const [FacilityID, IdentityNumber, FirstName, LastName, id] = params;
        const d = drivers.find(x => x.DriverID === Number(id));
        if (d) {
          d.FacilityID = FacilityID ? Number(FacilityID) : null;
          d.IdentityNumber = IdentityNumber;
          d.FirstName = FirstName;
          d.LastName = LastName;
          return { affectedRows: 1 };
        }
        return { affectedRows: 0 };
      }
      if (sql.startsWith('DELETE FROM OPC_Driver')) {
        const id = params[0];
        const idx = drivers.findIndex(d => d.DriverID === Number(id));
        if (idx === -1) return { affectedRows: 0 };
        if (drivers[idx].referenced) {
          const err = new Error('referenced');
          err.code = 'ER_ROW_IS_REFERENCED_2';
          throw err;
        }
        drivers.splice(idx, 1);
        return { affectedRows: 1 };
      }
      return [];
    };
  });

  it('adds a driver', async () => {
    await request(app)
      .post('/nagl/drivers')
      .send('FacilityID=1&IdentityNumber=123&FirstName=John&LastName=Doe')
      .expect(302);
    expect(drivers).to.have.length(1);
    expect(drivers[0]).to.include({ IdentityNumber: '123', FirstName: 'John', LastName: 'Doe' });
  });

  it('edits a driver', async () => {
    drivers.push({ DriverID: 1, FacilityID: 1, IdentityNumber: '123', FirstName: 'John', LastName: 'Doe' });
    await request(app)
      .post('/nagl/drivers/1')
      .send('FacilityID=2&IdentityNumber=123&FirstName=Jane&LastName=Doe')
      .expect(302);
    expect(drivers[0]).to.include({ FacilityID: 2, FirstName: 'Jane' });
  });

  it('deletes a driver successfully', async () => {
    drivers.push({ DriverID: 1, FacilityID: 1, IdentityNumber: '123', FirstName: 'John', LastName: 'Doe' });
    await request(app)
      .post('/nagl/drivers/1/delete')
      .expect(302);
    expect(drivers).to.have.length(0);
  });

  it('fails to delete a referenced driver', async () => {
    drivers.push({ DriverID: 2, FacilityID: 1, IdentityNumber: '999', FirstName: 'Ref', LastName: 'Driver', referenced: true });
    const res = await request(app)
      .post('/nagl/drivers/2/delete')
      .expect(302);
    expect(drivers).to.have.length(1);
    expect(res.headers.location).to.include('error=');
  });
});

