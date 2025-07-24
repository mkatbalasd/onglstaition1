const driverCardModel = require('../models/driverCard');

async function getAll(req, res) {
  try {
    const data = await driverCardModel.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const item = await driverCardModel.getById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Driver card not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const created = await driverCardModel.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const updated = await driverCardModel.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await driverCardModel.remove(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, getById, create, update, remove };
