const express = require('express');
const router = express.Router();
const YieldData = require('../models/YieldData');

const dbName = 'cropsDB';
const collectionName = 'yields';
let client;
let collection;

// Connect to MongoDB when the server starts
async function connectToMongoDB() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    collection = db.collection(collectionName);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit if connection fails
  }
}


router.get('/yield', async (req, res) => {
  const { crop, year } = req.query;

  // Validate query parameters
  if (!crop || !year) {
    return res.status(400).json({ error: 'Both crop and year are required' });
  }

  try {
    // Convert year to number (stored as number in DB)
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) {
      return res.status(400).json({ error: 'Year must be a valid number' });
    }

    // Query MongoDB
    const features = await collection
      .find({
        'properties.COMMODITY_DESC': crop.toUpperCase(), // Case-insensitive, assuming DB has uppercase (e.g., "SUGARCANE")
        'properties.YEAR': yearNum,
      })
      .toArray();

    // Return as GeoJSON FeatureCollection
    const featureCollection = {
      type: 'FeatureCollection',
      features: features.length > 0 ? features : [],
    };

    res.status(200).json(featureCollection);
  } catch (err) {
    console.error('Error fetching features:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/documents', async (req, res) => {
    try {
      const documents = await YieldData.find({}, { name: 1, _id: 1 }); // Fetch only name and _id
      if (!documents || documents.length === 0) {
        return res.status(404).json({ msg: 'No documents found in the collection' });
      }
      res.json(documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ msg: 'Server error', error: error.message });
    }
  });
module.exports = router;