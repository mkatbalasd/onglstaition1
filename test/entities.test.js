const request = require('supertest');
const app = require('../index');
const { expect } = require('chai');
const pool = require('../db');

describe('Brands, Models, Colors CRUD', () => {
  let brands = [];
  let models = [];
  let colors = [];

  beforeEach(() => {
    brands = [];
    models = [];
    colors = [];
    pool.query = async (sql, params) => {
      if (sql.startsWith('SELECT BrandID, BrandName FROM OPC_Brand ORDER BY')) {
        return [...brands].sort((a, b) => b.BrandID - a.BrandID);
      }
      if (sql.startsWith('INSERT INTO OPC_Brand')) {
        const id = brands.length ? Math.max(...brands.map(b => b.BrandID)) + 1 : 1;
        brands.push({ BrandID: id, BrandName: params[0] });
        return { insertId: id };
      }
      if (sql.startsWith('SELECT BrandID, BrandName FROM OPC_Brand WHERE')) {
        const id = params[0];
        return brands.filter(b => b.BrandID === Number(id));
      }
      if (sql.startsWith('UPDATE OPC_Brand')) {
        const [name, id] = params;
        const b = brands.find(x => x.BrandID === Number(id));
        if (b) b.BrandName = name;
        return { affectedRows: b ? 1 : 0 };
      }
      if (sql.startsWith('DELETE FROM OPC_Brand')) {
        const id = params[0];
        brands = brands.filter(b => b.BrandID !== Number(id));
        return { affectedRows: 1 };
      }

      if (sql.startsWith('SELECT ModelID, ModelName FROM OPC_Model ORDER BY')) {
        return [...models].sort((a, b) => b.ModelID - a.ModelID);
      }
      if (sql.startsWith('INSERT INTO OPC_Model')) {
        const id = models.length ? Math.max(...models.map(m => m.ModelID)) + 1 : 1;
        models.push({ ModelID: id, ModelName: params[1], BrandID: params[0] ? Number(params[0]) : null });
        return { insertId: id };
      }
      if (sql.startsWith('SELECT ModelID, BrandID, ModelName FROM OPC_Model WHERE')) {
        const id = params[0];
        return models.filter(m => m.ModelID === Number(id));
      }
      if (sql.startsWith('UPDATE OPC_Model')) {
        const [brandId, name, id] = params;
        const m = models.find(x => x.ModelID === Number(id));
        if (m) {
          m.BrandID = brandId ? Number(brandId) : null;
          m.ModelName = name;
        }
        return { affectedRows: m ? 1 : 0 };
      }
      if (sql.startsWith('DELETE FROM OPC_Model')) {
        const id = params[0];
        models = models.filter(m => m.ModelID !== Number(id));
        return { affectedRows: 1 };
      }
      if (sql.startsWith('SELECT BrandID, BrandName FROM OPC_Brand ORDER BY')) {
        return brands;
      }

      if (sql.startsWith('SELECT ColorID, ColorName FROM OPC_Color ORDER BY')) {
        return [...colors].sort((a, b) => b.ColorID - a.ColorID);
      }
      if (sql.startsWith('INSERT INTO OPC_Color')) {
        const id = colors.length ? Math.max(...colors.map(c => c.ColorID)) + 1 : 1;
        colors.push({ ColorID: id, ColorName: params[0] });
        return { insertId: id };
      }
      if (sql.startsWith('SELECT ColorID, ColorName FROM OPC_Color WHERE')) {
        const id = params[0];
        return colors.filter(c => c.ColorID === Number(id));
      }
      if (sql.startsWith('UPDATE OPC_Color')) {
        const [name, id] = params;
        const c = colors.find(x => x.ColorID === Number(id));
        if (c) c.ColorName = name;
        return { affectedRows: c ? 1 : 0 };
      }
      if (sql.startsWith('DELETE FROM OPC_Color')) {
        const id = params[0];
        colors = colors.filter(c => c.ColorID !== Number(id));
        return { affectedRows: 1 };
      }

      return [];
    };
  });

  it('handles brand CRUD', async () => {
    await request(app).post('/nagl/brands').send('BrandName=TestBrand').expect(302);
    expect(brands).to.have.length(1);
    const id = brands[0].BrandID;
    await request(app).post(`/nagl/brands/${id}`).send('BrandName=Updated').expect(302);
    expect(brands[0].BrandName).to.equal('Updated');
    await request(app).post(`/nagl/brands/${id}/delete`).expect(302);
    expect(brands).to.have.length(0);
  });

  it('handles model CRUD', async () => {
    brands.push({ BrandID: 1, BrandName: 'B1' });
    await request(app).post('/nagl/models').send('BrandID=1&ModelName=M1').expect(302);
    expect(models).to.have.length(1);
    const id = models[0].ModelID;
    await request(app).post(`/nagl/models/${id}`).send('BrandID=1&ModelName=M2').expect(302);
    expect(models[0].ModelName).to.equal('M2');
    await request(app).post(`/nagl/models/${id}/delete`).expect(302);
    expect(models).to.have.length(0);
  });

  it('handles color CRUD', async () => {
    await request(app).post('/nagl/colors').send('ColorName=Red').expect(302);
    expect(colors).to.have.length(1);
    const id = colors[0].ColorID;
    await request(app).post(`/nagl/colors/${id}`).send('ColorName=Blue').expect(302);
    expect(colors[0].ColorName).to.equal('Blue');
    await request(app).post(`/nagl/colors/${id}/delete`).expect(302);
    expect(colors).to.have.length(0);
  });
});
