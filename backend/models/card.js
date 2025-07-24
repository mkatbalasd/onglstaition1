const pool = require('../db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM card');
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM card WHERE id = ?', [id]);
  return rows[0];
}

async function create(data) {
  const [result] = await pool.query('INSERT INTO card SET ?', [data]);
  return getById(result.insertId);
}

async function update(id, data) {
  await pool.query('UPDATE card SET ? WHERE id = ?', [data, id]);
  return getById(id);
}

async function remove(id) {
  await pool.query('DELETE FROM card WHERE id = ?', [id]);
}

module.exports = { getAll, getById, create, update, remove };
