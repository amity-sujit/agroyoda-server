const mongoose = require('mongoose');

const coordinateSchema = new mongoose.Schema({
  0: { type: Number, required: true }, // Longitude
  1: { type: Number, required: true }  // Latitude
});

const geometrySchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., "Polygon"
  coordinates: [[[[coordinateSchema]]]] // Nested arrays for Polygon
});

const propertiesSchema = new mongoose.Schema({
  STATE_ALPHA: { type: String, required: true },
  YEAR: { type: Number, required: true },
  COMMODITY_DESC: { type: String, required: true },
  VALUE: { type: Number, default: null }, // Can be null
  lon: { type: Number, required: true },
  lat: { type: Number, required: true }
});

const featureSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., "Feature"
  properties: propertiesSchema,
  geometry: geometrySchema
});

const crsSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., "name"
  properties: {
    name: { type: String, required: true } // e.g., "urn:ogc:def:crs:OGC:1.3:CRS84"
  }
});

const yieldDataSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., "FeatureCollection"
  name: { type: String, required: true }, // e.g., "census_CORN_yield"
  crs: crsSchema,
  features: [featureSchema]
}, { collection: 'yields' });

module.exports = mongoose.model('YieldData', yieldDataSchema);