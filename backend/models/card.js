const pool = require('../db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM OPC_Card');
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM OPC_Card WHERE CardID = ?', [id]);
  return rows[0];
}

async function create(data) {
  const [result] = await pool.query('INSERT INTO OPC_Card SET ?', [data]);
  return getById(result.insertId);
}

async function update(id, data) {
  await pool.query('UPDATE OPC_Card SET ? WHERE CardID = ?', [data, id]);
  return getById(id);
}

async function remove(id) {
  await pool.query('DELETE FROM OPC_Card WHERE CardID = ?', [id]);
}

module.exports = { getAll, getById, create, update, remove };
