const pool = require('../db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM OPC_Vehicle');
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM OPC_Vehicle WHERE VehicleID = ?', [id]);
  return rows[0];
}

async function create(data) {
  const [result] = await pool.query('INSERT INTO OPC_Vehicle SET ?', [data]);
  return getById(result.insertId);
}

async function update(id, data) {
  await pool.query('UPDATE OPC_Vehicle SET ? WHERE VehicleID = ?', [data, id]);
  return getById(id);
}

async function remove(id) {
  await pool.query('DELETE FROM OPC_Vehicle WHERE VehicleID = ?', [id]);
}

module.exports = { getAll, getById, create, update, remove };
