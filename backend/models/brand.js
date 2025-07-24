const pool = require('../db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM OPC_Brand');
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM OPC_Brand WHERE BrandID = ?', [id]);
  return rows[0];
}

async function create(data) {
  const [result] = await pool.query('INSERT INTO OPC_Brand SET ?', [data]);
  return getById(result.insertId);
}

async function update(id, data) {
  await pool.query('UPDATE OPC_Brand SET ? WHERE BrandID = ?', [data, id]);
  return getById(id);
}

async function remove(id) {
  await pool.query('DELETE FROM OPC_Brand WHERE BrandID = ?', [id]);
}

module.exports = { getAll, getById, create, update, remove };
