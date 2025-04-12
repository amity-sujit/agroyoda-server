// config/db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = 'cropsDB';
const featureCollectionName = 'yields';
const userCollectionName = 'users';

let client;
let db;
let featureCollection;
let userCollection;

async function connectDB() {
  if (featureCollection && userCollection) return;

  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    featureCollection = db.collection(featureCollectionName);
    userCollection = db.collection(userCollectionName);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    throw err;
  }
}

function getFeatureCollection() {
  if (!featureCollection) {
    throw new Error('Feature collection not initialized. Call connectDB first.');
  }
  return featureCollection;
}

function getUserCollection() {
  if (!userCollection) {
    throw new Error('User collection not initialized. Call connectDB first.');
  }
  return userCollection;
}

async function closeDB() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
    client = null;
    featureCollection = null;
    userCollection = null;
  }
}

module.exports = { connectDB, getFeatureCollection, getUserCollection, closeDB };