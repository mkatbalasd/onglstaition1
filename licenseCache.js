const pool = require('./db');

let cache = null;
let lastLoaded = 0;
const TTL = 10 * 60 * 1000; // 10 minutes

async function loadLicenseTypes() {
  try {
    cache = await pool.query('SELECT LicenseTypeNameAR FROM OPC_LicenseType');
    lastLoaded = Date.now();
  } catch (err) {
    console.error('Error loading license types:', err);
    cache = [];
  }
}

async function getLicenseTypes() {
  if (!cache || Date.now() - lastLoaded > TTL) {
    await loadLicenseTypes();
  }
  return cache;
}

module.exports = {
  getLicenseTypes,
  loadLicenseTypes
};
