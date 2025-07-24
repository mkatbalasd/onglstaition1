const pool = require('../db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM color');
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM color WHERE id = ?', [id]);
  return rows[0];
}

async function create(data) {
  const [result] = await pool.query('INSERT INTO color SET ?', [data]);
  return getById(result.insertId);
}

async function update(id, data) {
  await pool.query('UPDATE color SET ? WHERE id = ?', [data, id]);
  return getById(id);
}

async function remove(id) {
  await pool.query('DELETE FROM color WHERE id = ?', [id]);
}

module.exports = { getAll, getById, create, update, remove };
