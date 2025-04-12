// models/featureModel.js
const { getFeatureCollection } = require('../config/db');

async function getFeaturesByCropAndYear(crop, year) {
  try {
    const collection = getFeatureCollection();
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) {
      throw new Error('Year must be a valid number');
    }
    const features = await collection
      .find({
        'properties.COMMODITY_DESC': crop.toUpperCase(),
        'properties.YEAR': yearNum,
      })
      .toArray();
    return features;
  } catch (err) {
    console.error('Error in getFeaturesByCropAndYear:', err.message);
    throw err;
  }
}

module.exports = { getFeaturesByCropAndYear };