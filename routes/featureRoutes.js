// routes/featureRoutes.js
const express = require('express');
const router = express.Router();
const { getFeaturesByCropAndYear } = require('../models/featureModel');
const auth = require('../middleware/auth');
const { getFeatureCollection } = require('../config/db');

// GET /api/features?crop=SUGARCANE&year=2022 (protected)
router.get('/', auth, async (req, res) => {
  const { crop, year } = req.query;

  if (!crop || !year) {
    return res.status(400).json({ error: 'Both crop and year are required' });
  }

  try {
    const features = await getFeaturesByCropAndYear(crop, year);
    const featureCollection = {
      type: 'FeatureCollection',
      features: features.length > 0 ? features : [],
    };
    res.status(200).json(featureCollection);
  } catch (err) {
    if (err.message === 'Year must be a valid number') {
      res.status(400).json({ error: err.message });
    } else {
      console.error('Error in feature route:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// New endpoint: GET /api/years?crop=SUGARCANE (protected)
router.get('/years', auth, async (req, res) => {
  const { crop } = req.query;

  if (!crop) {
    return res.status(400).json({ error: 'Crop is required' });
  }

  try {
    const collection = getFeatureCollection();
    const years = await collection
      .distinct('properties.YEAR', { 'properties.COMMODITY_DESC': crop.toUpperCase() });
    res.status(200).json(years.sort());
  } catch (err) {
    console.error('Error fetching years:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;